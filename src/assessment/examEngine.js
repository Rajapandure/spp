// Mock Examination & Assessment Engine (20-Question Configurable, Save/Resume, Weak-Topic Analysis)
import { dbDelete, dbGet, dbPut, dbQueryByIndex, recordLocalActivity } from "../db/database.js";
import { awardActivityReward } from "../rewards/rewardService.js";

export const EXAM_TEMPLATES = {
  chapter_test: { id: "chapter_test", label: "Chapter Assessment (10 Qs)", count: 10, durationMin: 15 },
  mock_20: { id: "mock_20", label: "Standard Mock Paper (20 Qs)", count: 20, durationMin: 30 },
  board_pattern: { id: "board_pattern", label: "Board Pattern Mock (20 Qs + Descriptive)", count: 20, durationMin: 45 }
};

export function buildMockPaper(questionsPool, { subjectId = "ALL", chapterId = "ALL", difficulty = "ALL", templateId = "mock_20" }) {
  const tpl = EXAM_TEMPLATES[templateId] || EXAM_TEMPLATES.mock_20;
  let filtered = questionsPool.slice();
  if (subjectId !== "ALL") filtered = filtered.filter((q) => q.subjectId === subjectId);
  if (chapterId !== "ALL") filtered = filtered.filter((q) => q.chapterId === chapterId);
  if (difficulty !== "ALL") filtered = filtered.filter((q) => q.difficulty === difficulty);

  // Shuffle deterministically/randomly without duplicating questions
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  const selected = filtered.slice(0, tpl.count);
  return {
    paperId: "paper_" + Date.now(),
    templateId: tpl.id,
    title: tpl.label,
    requestedCount: tpl.count,
    actualCount: selected.length,
    durationSec: tpl.durationMin * 60,
    questions: selected
  };
}

export async function saveExamDraft(studentId, draftState) {
  await dbPut("settings", { key: `exam_draft::${studentId}`, value: draftState });
}

export async function loadExamDraft(studentId) {
  const rec = await dbGet("settings", `exam_draft::${studentId}`);
  return rec ? rec.value : null;
}

export async function clearExamDraft(studentId) {
  await dbDelete("settings", `exam_draft::${studentId}`);
}

export function normalizeAns(val) {
  return String(val || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export async function submitMockExam(studentProfile, paper, answersMap) {
  let objectiveTotal = 0;
  let objectiveCorrect = 0;
  let objectiveMarks = 0;
  let earnedObjectiveMarks = 0;
  let descriptiveCount = 0;
  const topicStats = {};
  const breakdown = [];

  for (const q of paper.questions) {
    const given = answersMap[q.id] || "";
    const topic = q.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = { total: 0, wrong: 0 };

    const isObjective = q.type === "MCQ" || q.type === "TF" || q.type === "FILL";
    if (isObjective) {
      objectiveTotal++;
      objectiveMarks += q.marks || 1;
      const isRight = normalizeAns(given) === normalizeAns(q.ans);
      topicStats[topic].total++;
      if (isRight) {
        objectiveCorrect++;
        earnedObjectiveMarks += q.marks || 1;
      } else {
        topicStats[topic].wrong++;
        // Save to wrongAnswers isolated by studentId
        await dbPut("wrongAnswers", {
          id: `${studentProfile.studentId}::${q.id}`,
          studentId: studentProfile.studentId,
          questionId: q.id,
          chapterId: q.chapterId,
          q: q.q,
          givenAns: given || "(Unattempted)",
          correctAns: q.ans,
          explanation: q.explanation || q.solution || "",
          updatedAt: new Date().toISOString()
        });
      }
      breakdown.push({ q, given, isObjective: true, isRight, evalStatus: "auto_scored" });
    } else {
      descriptiveCount++;
      breakdown.push({ q, given, isObjective: false, isRight: null, evalStatus: "pending_teacher_review" });
    }
  }

  const weakTopics = Object.entries(topicStats)
    .filter(([, s]) => s.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([topic, s]) => ({ topic, wrong: s.wrong, total: s.total }));

  const attemptId = `exam_${studentProfile.studentId}_${paper.paperId}`;
  const attemptRecord = {
    attemptId,
    studentId: studentProfile.studentId,
    studentName: studentProfile.name,
    classNum: studentProfile.classNum,
    board: studentProfile.board,
    medium: studentProfile.medium,
    type: "mock_exam",
    paperId: paper.paperId,
    title: paper.title,
    objectiveTotal,
    objectiveCorrect,
    objectiveMarks,
    earnedObjectiveMarks,
    descriptiveCount,
    teacherMarksAwarded: 0,
    evaluationStatus: descriptiveCount > 0 ? "pending_teacher_review" : "evaluated",
    weakTopics,
    breakdown,
    createdAt: new Date().toISOString()
  };

  await dbPut("studentAttempts", attemptRecord);
  await clearExamDraft(studentProfile.studentId);

  // Idempotent reward transaction (only if at least 1 objective answer was correct)
  if (objectiveCorrect > 0) {
    await awardActivityReward(studentProfile, {
      activityType: "Mock Examination Completion",
      subjectId: paper.subjectId || "",
      chapterId: paper.chapterId || "",
      xp: objectiveCorrect * 10,
      coins: objectiveCorrect * 3,
      idempotencyKey: `exam_reward::${attemptId}`,
      note: `${paper.title} (${objectiveCorrect}/${objectiveTotal})`
    });
  }

  await recordLocalActivity(studentProfile.studentId, "exam_attempt", { attemptId, earnedObjectiveMarks, objectiveTotal }, attemptId);

  return attemptRecord;
}

export async function getPendingDescriptiveExams() {
  const all = await dbQueryByIndex("studentAttempts", "type", "mock_exam");
  return all.filter((a) => a.evaluationStatus === "pending_teacher_review");
}
