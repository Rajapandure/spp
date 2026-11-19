// Curriculum Service: Seeding, Verification Statuses, Validation Report, & Strict Session Scoping
import { dbBulkPut, dbGet, dbGetAll, dbPut } from "../db/database.js";
import { getSeedPart1 } from "./seed_part1.js";
import { getSeedPart2 } from "./seed_part2.js";
import { generateFullSyllabusCoverage } from "./full_syllabus_generator.js";
import { generateEnglishGrammarCurriculum } from "./grammar_curriculum.js";

const SEED_VERSION_KEY = "curriculum_seed_version";
const CURRENT_SEED_VERSION = "2026.27.v9";

export const CONTENT_STATUSES = ["Draft", "Generated", "Under Review", "Verified", "Published", "Archived"];

export async function ensureCurriculumSeeded() {
  const existing = await dbGet("settings", SEED_VERSION_KEY);
  if (existing && existing.value === CURRENT_SEED_VERSION) return;

  const p1 = getSeedPart1();
  const p2 = getSeedPart2();

  // Preserve manually verified content with explicit verificationStatus: "Verified"
  const baseBooks = [...p1.textbooks, ...p2.textbooks].map((b) => ({
    ...b,
    verificationStatus: b.verificationStatus || "Verified",
    isSupplementary: false
  }));
  const baseChapters = [...p1.chapters, ...p2.chapters].map((c) => ({
    ...c,
    verificationStatus: c.verificationStatus || "Verified",
    isSupplementary: false
  }));
  const baseQuestions = [...p1.questions, ...p2.questions].map((q) => ({
    ...q,
    verificationStatus: q.verificationStatus || "Verified",
    isSupplementary: false
  }));

  const { newBooks, newChapters, newQuestions } = generateFullSyllabusCoverage(baseBooks, baseChapters, baseQuestions);
  const grammar = generateEnglishGrammarCurriculum();

  // Mark generated supplementary content honestly as "Generated" (never auto-Verified)
  const taggedGenBooks = newBooks.map((b) => ({ ...b, verificationStatus: "Generated", isSupplementary: true }));
  const taggedGenChapters = newChapters.map((c) => ({ ...c, verificationStatus: "Generated", isSupplementary: true }));
  const taggedGenQuestions = newQuestions.map((q) => ({ ...q, verificationStatus: "Generated", isSupplementary: true }));

  const taggedGramBooks = grammar.books.map((b) => ({ ...b, verificationStatus: "Generated", isSupplementary: true }));
  const taggedGramChapters = grammar.chapters.map((c) => ({ ...c, verificationStatus: "Generated", isSupplementary: true }));
  const taggedGramQuestions = grammar.questions.map((q) => ({ ...q, verificationStatus: "Generated", isSupplementary: true }));

  // Preserve any teacher-edited chapters/questions already in DB (never overwrite teacher edits)
  const existingChapters = await dbGetAll("chapters");
  const existingMap = new Map(existingChapters.map((c) => [c.id, c]));
  const mergedChapters = [...baseChapters, ...taggedGenChapters, ...taggedGramChapters].map((c) => {
    const prev = existingMap.get(c.id);
    if (prev && (prev.verificationStatus === "Verified" || prev.sourceType === "Teacher CMS Authored Content")) {
      return prev;
    }
    return c;
  });

  await dbBulkPut("textbooks", [...baseBooks, ...taggedGenBooks, ...taggedGramBooks]);
  await dbBulkPut("chapters", mergedChapters);
  await dbBulkPut("questions", [...baseQuestions, ...taggedGenQuestions, ...taggedGramQuestions]);
  await dbBulkPut("games", [...p1.games, ...p2.games]);
  await dbPut("settings", { key: SEED_VERSION_KEY, value: CURRENT_SEED_VERSION });
  const sr = await dbGet("settings", "selfRegistrationEnabled");
  if (!sr) await dbPut("settings", { key: "selfRegistrationEnabled", value: true });
}

// Strict Student Curriculum Scoping by (session, board, medium, classNum) — NO silent session fallback!
export async function getStudentCurriculum(profile) {
  const [allBooks, allChapters, allQuestions, allGames] = await Promise.all([
    dbGetAll("textbooks"),
    dbGetAll("chapters"),
    dbGetAll("questions"),
    dbGetAll("games")
  ]);

  const targetSession = profile.session || "2026-27";
  const availableSessions = Array.from(new Set(allBooks.filter((b) => b.status === "Published").map((b) => b.session)));

  const books = allBooks.filter(
    (b) =>
      b.classNum === String(profile.classNum) &&
      b.board === profile.board &&
      b.medium === profile.medium &&
      b.session === targetSession &&
      (b.status === "Published" || b.status === "Verified")
  );

  const bookIds = new Set(books.map((b) => b.id));

  const chapters = allChapters
    .filter((c) => bookIds.has(c.bookId) && (c.status === "Published" || c.status === "Verified"))
    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  // Strict chapter-question association validation: prevent unrelated questions from appearing under a chapter
  const questions = allQuestions.filter((q) => {
    const ch = chapterById.get(q.chapterId);
    if (!ch) return false;
    return (
      q.classNum === ch.classNum &&
      q.board === ch.board &&
      q.medium === ch.medium &&
      q.subjectId === ch.subjectId &&
      q.verificationStatus !== "Archived" &&
      q.verificationStatus !== "Draft"
    );
  });

  const games = allGames.filter((g) => chapterById.has(g.chapterId));

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
    games,
    sessionMissing: books.length === 0,
    availableSessions
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

// Teacher Content Validation Report
export function validateCurriculumIntegrity(chapters, questions) {
  const chMap = new Map(chapters.map((c) => [c.id, c]));
  const validTypes = new Set(["MCQ", "TF", "FILL", "SHORT", "LONG", "MULTI", "MATCH", "ONE_WORD", "NUMERICAL", "DIAGRAM"]);
  const validDiffs = new Set(["Easy", "Medium", "Hard"]);
  const seenQText = new Map();
  const issues = [];

  for (const q of questions) {
    const ch = chMap.get(q.chapterId);
    if (!ch) {
      issues.push({ id: q.id, severity: "error", reason: "Orphaned question (chapter not found)" });
      continue;
    }
    if (q.subjectId !== ch.subjectId || q.classNum !== ch.classNum || q.board !== ch.board || q.medium !== ch.medium) {
      issues.push({ id: q.id, severity: "error", reason: "Mismatched class/board/medium/subject with parent chapter" });
    }
    if (!q.q || !q.q.trim()) {
      issues.push({ id: q.id, severity: "error", reason: "Empty question text" });
    }
    if (!q.ans || !String(q.ans).trim()) {
      issues.push({ id: q.id, severity: "error", reason: "Missing answer" });
    }
    if (!validTypes.has(q.type)) {
      issues.push({ id: q.id, severity: "warning", reason: `Invalid question type: ${q.type}` });
    }
    if (q.difficulty && !validDiffs.has(q.difficulty)) {
      issues.push({ id: q.id, severity: "warning", reason: `Inconsistent difficulty: ${q.difficulty}` });
    }
    const dupKey = `${q.chapterId}::${String(q.q || "").trim().toLowerCase()}`;
    if (seenQText.has(dupKey)) {
      issues.push({ id: q.id, severity: "warning", reason: `Duplicate question in chapter (${seenQText.get(dupKey)})` });
    } else {
      seenQText.set(dupKey, q.id);
    }
  }

  return {
    totalChapters: chapters.length,
    verifiedChapters: chapters.filter((c) => c.verificationStatus === "Verified").length,
    generatedChapters: chapters.filter((c) => c.verificationStatus === "Generated").length,
    totalQuestions: questions.length,
    verifiedQuestions: questions.filter((q) => q.verificationStatus === "Verified").length,
    generatedQuestions: questions.filter((q) => q.verificationStatus === "Generated").length,
    issues
  };
}
