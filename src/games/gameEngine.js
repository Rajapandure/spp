// Chapter-Linked Educational Games Engine (Offline-First, Class 1-10)
// Every class, subject, and chapter builds its Play activities from its own chapter content & questions.
import { dbPut, recordLocalActivity } from "../db/database.js";
import { awardActivityReward } from "../rewards/rewardService.js";

const GAME_GENERATORS = {
  count_shapes: (level) => {
    const shapes = [
      { name: "Circle (गोल)", svg: `<circle cx="24" cy="24" r="16" fill="#f97316"/>` },
      { name: "Triangle (त्रिकोण)", svg: `<polygon points="24,6 6,40 42,40" fill="#10b981"/>` },
      { name: "Square (वर्ग)", svg: `<rect x="8" y="8" width="32" height="32" rx="4" fill="#2563eb"/>` }
    ];
    const target = shapes[(level - 1) % shapes.length];
    const count = Math.min(2 + level, 9);
    const items = Array.from({ length: count }, () => `<svg width="40" height="40" viewBox="0 0 48 48">${target.svg}</svg>`).join("");
    const opts = [count - 1, count, count + 1, count + 2].map(String);
    return {
      prompt: `Count the ${target.name} shapes below!`,
      visual: `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:16px;background:var(--bg-muted);border-radius:16px;">${items}</div>`,
      options: opts,
      answer: String(count)
    };
  },
  fraction_match: (level) => {
    const bank = [
      { q: "Which fraction is equivalent to 1/2?", options: ["2/4", "2/3", "1/4", "3/5"], ans: "2/4" },
      { q: "Which fraction is larger: 1/3 or 1/6?", options: ["1/3", "1/6", "Both equal", "Cannot tell"], ans: "1/3" },
      { q: "Simplify 4/8 to its lowest form:", options: ["1/2", "2/3", "1/4", "3/4"], ans: "1/2" }
    ];
    const item = bank[(level - 1) % bank.length];
    return { prompt: item.q, visual: "", options: item.options, answer: item.ans };
  },
  pattern_sprint: (level) => {
    const bank = [
      { q: "Next Square Number: 1, 4, 9, 16, ___", options: ["20", "24", "25", "36"], ans: "25" },
      { q: "Next Triangular Number: 1, 3, 6, 10, ___", options: ["12", "14", "15", "16"], ans: "15" },
      { q: "Powers of 2: 2, 4, 8, 16, ___", options: ["24", "30", "32", "64"], ans: "32" }
    ];
    const item = bank[(level - 1) % bank.length];
    return { prompt: item.q, visual: "", options: item.options, answer: item.ans };
  },
  trig_sprint: (level) => {
    const bank = [
      { q: "Value of sin 30° + cos 60°:", options: ["0", "1/2", "1", "√3"], ans: "1" },
      { q: "Value of tan 45°:", options: ["0", "1", "1/√3", "√3"], ans: "1" },
      { q: "sec²θ - tan²θ equals:", options: ["0", "1", "-1", "2"], ans: "1" }
    ];
    const item = bank[(level - 1) % bank.length];
    return { prompt: item.q, visual: "", options: item.options, answer: item.ans };
  },
  ohms_race: (level) => {
    const bank = [
      { q: "V = 24 V, R = 6 Ω. Find Current (I):", options: ["2 A", "4 A", "6 A", "144 A"], ans: "4 A" },
      { q: "I = 3 A, R = 5 Ω. Find Voltage (V):", options: ["8 V", "15 V", "1.6 V", "2 V"], ans: "15 V" },
      { q: "Two 6 Ω resistors in parallel give Rp:", options: ["12 Ω", "6 Ω", "3 Ω", "2 Ω"], ans: "3 Ω" }
    ];
    const item = bank[(level - 1) % bank.length];
    return { prompt: item.q, visual: "", options: item.options, answer: item.ans };
  }
};

export function generateGameRound(gameType, level = 1, chapter = null, chQuestions = []) {
  if (gameType && GAME_GENERATORS[gameType]) {
    return GAME_GENERATORS[gameType](level);
  }
  // Build dynamic round from this exact chapter's own questions & concepts (never same across classes/subjects)
  const mcqPool = (chQuestions || []).filter((q) => Array.isArray(q.options) && q.options.length >= 2);
  if (mcqPool.length > 0) {
    const q = mcqPool[(level - 1) % mcqPool.length];
    const tip = q.explanation || chapter?.intro || "";
    return {
      prompt: q.q,
      visual: tip ? `<div style="padding:10px;border-radius:12px;background:var(--bg-muted);font-size:0.86rem;">💡 ${tip}</div>` : "",
      options: q.options,
      answer: q.ans
    };
  }
  if (chapter && chapter.concepts && chapter.concepts.length > 0) {
    const c = chapter.concepts[(level - 1) % chapter.concepts.length];
    return {
      prompt: `What is "${c.term}"?`,
      visual: "",
      options: [c.def, "Not covered in this chapter"],
      answer: c.def
    };
  }
  return GAME_GENERATORS.count_shapes(level);
}

// Generate Playcards (Flashcards) strictly for the active chapter
export function generatePlaycardsForChapter(chapter, chQuestions = []) {
  const cards = (chapter.playcards && chapter.playcards.length)
    ? chapter.playcards.map((c) => ({ front: c.front, back: c.back, tag: c.tag || "Teacher Card" }))
    : [];
  for (const c of chapter.concepts || []) {
    cards.push({ front: c.term, back: c.def, tag: "Concept" });
  }
  for (const ex of chapter.examples || []) {
    cards.push({ front: ex.q, back: ex.a, tag: "Worked Example" });
  }
  for (const r of chapter.revision || []) {
    if (cards.length >= 8) break;
    cards.push({ front: `Key Point (${chapter.title.replace(/^\d+\.\s*/, "")})`, back: r, tag: "Revision Fact" });
  }
  if (cards.length < 3) {
    cards.push({ front: chapter.title, back: chapter.intro || chapter.explanation, tag: "Chapter Overview" });
  }
  if (cards.length === 0) {
    cards.push({ front: chapter.title, back: chapter.intro || chapter.explanation, tag: "Summary" });
  }
  return cards;
}

// Generate Match-the-Column pairs strictly for the active chapter
export function generateMatchColumnForChapter(chapter, chQuestions = []) {
  const pairs = [];
  for (const c of chapter.concepts || []) {
    if (c.term && c.def) pairs.push({ id: `m_c_${pairs.length}`, left: c.term, right: c.def.slice(0, 72) });
  }
  for (const ex of chapter.examples || []) {
    if (pairs.length >= 6) break;
    if (ex.q && ex.a) pairs.push({ id: `m_ex_${pairs.length}`, left: ex.q.slice(0, 68), right: String(ex.a).slice(0, 68) });
  }
  if (pairs.length < 2 && chapter.objectives?.length) {
    chapter.objectives.forEach((obj, idx) => {
      pairs.push({ id: `m_obj_${idx}`, left: `Goal ${idx + 1}`, right: obj.slice(0, 68) });
    });
  }
  const rightOptions = pairs.map((p) => ({ id: p.id, text: p.right }));
  for (let i = rightOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightOptions[i], rightOptions[j]] = [rightOptions[j], rightOptions[i]];
  }
  return { chapterId: chapter.id, pairs, rightOptions };
}

export async function recordGameCompletion(studentProfile, game, score, total) {
  const attemptId = `game_${studentProfile.studentId}_${game.id}_${Date.now()}`;
  const passed = score >= Math.ceil(total * 0.6);
  const reward = passed
    ? await awardActivityReward(studentProfile, {
        activityType: "Educational Game Completion",
        subjectId: game.subjectId || "",
        chapterId: game.chapterId || "",
        xp: (game.rewardCoins || 15) * 2,
        coins: game.rewardCoins || 15,
        idempotencyKey: `game_first::${studentProfile.studentId}::${game.id}`,
        note: `Completed ${game.title} (${score}/${total})`
      })
    : { awarded: false, xp: 0, coins: 0 };

  const record = {
    attemptId,
    studentId: studentProfile.studentId,
    type: "game",
    gameId: game.id,
    chapterId: game.chapterId,
    score,
    total,
    earnedCoins: reward.coins,
    earnedXP: reward.xp,
    createdAt: new Date().toISOString()
  };
  await dbPut("studentAttempts", record);
  await recordLocalActivity(studentProfile.studentId, "game_attempt", record, attemptId);
  return { earnedCoins: reward.coins, earnedXP: reward.xp, awarded: reward.awarded, record };
}
