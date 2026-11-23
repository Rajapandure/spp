// Curriculum Service: Seeding, Strict Scoping by (session, board, medium, classNum), and Completeness Audit
import { dbBulkPut, dbDelete, dbGet, dbGetAll, dbPut } from "../db/database.js";
import { getSeedPart1 } from "./seed_part1.js";
import { getSeedPart2 } from "./seed_part2.js";
import { generateFullSyllabusCoverage } from "./full_syllabus_generator.js";
import { generateEnglishGrammarCurriculum } from "./grammar_curriculum.js";

const SEED_VERSION_KEY = "curriculum_seed_version";
const CURRENT_SEED_VERSION = "2026.27.v9";
const OFFICIAL_MATHS_SOURCES = {
  NCERT: "https://ncert.nic.in/textbook.php",
  EPATHSHALA: "https://epathshala.nic.in/",
  DIKSHA: "https://diksha.gov.in/",
  MPTBC: "https://mptbc.mp.gov.in/",
  MPBSE: "https://mpbse.nic.in/academics.html",
  CBSE: "https://cbseacademic.nic.in/",
  NCERT_HOME: "https://ncert.nic.in/"
};

export function attachOfficialMathsSources(book) {
  if (book.subjectId !== "maths") return book;
  const isMP = book.board === "MP_BOARD";
  return {
    ...book,
    sourceUrl: isMP ? OFFICIAL_MATHS_SOURCES.MPTBC : OFFICIAL_MATHS_SOURCES.NCERT,
    sourceLabel: isMP ? "MP Textbook Corporation (MPTBC)" : "NCERT Official Textbooks",
    supplementarySourceUrl: isMP ? OFFICIAL_MATHS_SOURCES.DIKSHA : OFFICIAL_MATHS_SOURCES.EPATHSHALA,
    supplementarySourceLabel: isMP ? "DIKSHA – Madhya Pradesh" : "ePathshala – NCERT",
    syllabusUrl: isMP ? OFFICIAL_MATHS_SOURCES.MPBSE : (book.board === "CBSE" ? OFFICIAL_MATHS_SOURCES.CBSE : OFFICIAL_MATHS_SOURCES.NCERT_HOME),
    sourceAttribution: isMP
      ? "Official MP textbook and syllabus reference. Book content remains subject to the publisher's terms."
      : "Official NCERT textbook reference. Open the publisher's portal for the original book and exercises.",
    contentPolicy: "LINK_TO_OFFICIAL_SOURCE"
  };
}


export async function ensureCurriculumSeeded() {
  const existing = await dbGet("settings", SEED_VERSION_KEY);
  if (existing && existing.value === CURRENT_SEED_VERSION) return;

  // Remove legacy auto-padded Maths questions from older seed versions. These mixed topics
  // into unrelated chapters (for example, HCF/LCM into Coordinate Geometry).
  const storedQuestions = await dbGetAll("questions");
  const legacyMathsFillers = storedQuestions.filter((q) =>
    q.subjectId === "maths" && String(q.id || "").startsWith("q-sub-")
  );
  await Promise.all(legacyMathsFillers.map((q) => dbDelete("questions", q.id)));

  const p1 = getSeedPart1();
  const p2 = getSeedPart2();
  const baseBooks = [...p1.textbooks, ...p2.textbooks];
  const baseChapters = [...p1.chapters, ...p2.chapters];
  const baseQuestions = [...p1.questions, ...p2.questions];

  const { newBooks, newChapters, newQuestions } = generateFullSyllabusCoverage(baseBooks, baseChapters, baseQuestions);
  const grammar = generateEnglishGrammarCurriculum();

  const allBooks = [...baseBooks, ...newBooks, ...grammar.books].map(attachOfficialMathsSources);
  await dbBulkPut("textbooks", allBooks);
  await dbBulkPut("chapters", [...baseChapters, ...newChapters, ...grammar.chapters]);
  await dbBulkPut("questions", [...baseQuestions, ...newQuestions, ...grammar.questions]);
  await dbBulkPut("games", [...p1.games, ...p2.games]);
  await dbPut("settings", { key: SEED_VERSION_KEY, value: CURRENT_SEED_VERSION });
  const sr = await dbGet("settings", "selfRegistrationEnabled");
  if (!sr) await dbPut("settings", { key: "selfRegistrationEnabled", value: true });
}

// Strict Student Curriculum Scoping: ONLY returns Published content for student's exact (session, board, medium, classNum)
export async function getStudentCurriculum(profile) {
  const [allBooks, allChapters, allQuestions, allGames] = await Promise.all([
    dbGetAll("textbooks"),
    dbGetAll("chapters"),
    dbGetAll("questions"),
    dbGetAll("games")
  ]);

  const books = allBooks.filter(
    (b) =>
      b.classNum === String(profile.classNum) &&
      b.board === profile.board &&
      b.medium === profile.medium &&
      b.session === (profile.session || "2026-27") &&
      b.status === "Published"
  );

  const bookIds = new Set(books.map((b) => b.id));

  const chapters = allChapters
    .filter((c) => bookIds.has(c.bookId) && c.status === "Published")
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const chapterIds = new Set(chapters.map((c) => c.id));
  const questions = allQuestions.filter((q) => chapterIds.has(q.chapterId));
  const games = allGames.filter((g) => chapterIds.has(g.chapterId));

  const subjectMap = {};
  for (const b of books) {
    if (!subjectMap[b.subjectId]) {
      subjectMap[b.subjectId] = {
        id: b.subjectId,
        name: b.subjectName,
        icon: b.subjectIcon,
        color: b.coverColor,
        books: []
      };
    }
    subjectMap[b.subjectId].books.push(b);
  }

  return {
    subjects: Object.values(subjectMap),
    books,
    chapters,
    questions,
    games
  };
}

export function computeChapterCompleteness(chapter, chapterQuestions) {
  const missing = [];
  if (!chapter.explanation || chapter.explanation.trim().length < 40) missing.push("Lesson explanation");
  if (!chapter.exercises || chapter.exercises.length === 0) missing.push("Textbook exercises");
  if (!chapterQuestions || chapterQuestions.length < 3) missing.push("Practice questions (<3)");
  const noSolution = (chapterQuestions || []).filter((q) => !q.solution && !q.explanation).length;
  if (noSolution > 0) missing.push(`${noSolution} question solution(s)`);
  const score = Math.max(0, 100 - missing.length * 25);
  return { score, missing, isComplete: missing.length === 0 };
}
