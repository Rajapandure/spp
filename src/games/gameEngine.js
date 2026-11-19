// Chapter-Linked Educational Games Engine (Offline-First, Class 1-10)
// Includes Playcards (Flip & Recall), Match the Column, and Chapter Mini-Games for every chapter.
import { dbPut, enqueueSyncRecord } from "../db/database.js";

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
  number_puzzle: (level) => {
    const puzzles = [
      { q: "Complete the number bond: 6 + ___ = 10", options: ["3", "4", "5", "6"], ans: "4", tip: "Count up from 6 to 10: 7, 8, 9, 10 (4 steps)." },
      { q: "What comes next in skip counting by 5s: 5, 10, 15, ___?", options: ["18", "20", "25", "16"], ans: "20", tip: "Add 5 to 15: 15 + 5 = 20." },
      { q: "3 groups of 4 apples = ___ apples", options: ["7", "10", "12", "14"], ans: "12", tip: "4 + 4 + 4 = 12." }
    ];
    const puz = puzzles[(level - 1) % puzzles.length];
    return { prompt: puz.q, visual: `<div style="padding:10px;border-radius:12px;background:#fefce8;color:#713f12;font-size:0.86rem;">💡 Learn Tip: ${puz.tip}</div>`, options: puz.options, answer: puz.ans };
  },
  word_explorer: (level) => {
    const rounds = [
      { q: "Pick the Naming Word (Noun) for a place:", options: ["Jump", "School", "Happy", "Blue"], ans: "School", tip: "A Noun names a person, place, animal, or thing." },
      { q: "Which word is an Action Word (Verb)?", options: ["Apple", "Chair", "Dance", "Tall"], ans: "Dance", tip: "A Verb shows an action you can do." },
      { q: "Choose the right article: ___ elephant", options: ["A", "An"], ans: "An", tip: "Use An before vowel sounds (a, e, i, o, u)." }
    ];
    const r = rounds[(level - 1) % rounds.length];
    return { prompt: r.q, visual: `<div style="padding:10px;border-radius:12px;background:#fdf2f8;color:#831843;font-size:0.86rem;">📖 Word Tip: ${r.tip}</div>`, options: r.options, answer: r.ans };
  },
  evs_explorer: (level) => {
    const rounds = [
      { q: "Which part of the plant makes food using sunlight?", options: ["Root", "Leaf", "Stem", "Seed"], ans: "Leaf", tip: "Green leaves contain chlorophyll to make food for the plant." },
      { q: "Where does rainwater go when it falls on soil?", options: ["Groundwater", "Disappears forever", "Turns to stone"], ans: "Groundwater", tip: "Water seeps into the soil to recharge underground water." },
      { q: "Which of these is a healthy habit?", options: ["Washing hands before meals", "Wasting water", "Skipping sleep"], ans: "Washing hands before meals", tip: "Clean hands keep germs away!" }
    ];
    const r = rounds[(level - 1) % rounds.length];
    return { prompt: r.q, visual: `<div style="padding:10px;border-radius:12px;background:#ecfdf5;color:#065f46;font-size:0.86rem;">🌿 Nature Fact: ${r.tip}</div>`, options: r.options, answer: r.ans };
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

export function generateGameRound(gameType, level = 1) {
  const fn = GAME_GENERATORS[gameType] || GAME_GENERATORS.count_shapes;
  return fn(level);
}

// Generate Playcards (Flashcards) for ANY chapter from its concepts, examples, exercises, and questions
export function generatePlaycardsForChapter(chapter, chQuestions = []) {
  const cards = (chapter.playcards && chapter.playcards.length) ? chapter.playcards.map(c => ({ front: c.front, back: c.back, tag: c.tag || "Teacher Card" })) : [];
  for (const c of chapter.concepts || []) {
    cards.push({ front: c.term, back: c.def, tag: "Concept" });
  }
  for (const ex of chapter.examples || []) {
    cards.push({ front: ex.q, back: ex.a, tag: "Worked Example" });
  }
  for (const q of chQuestions) {
    if (cards.length >= 12) break;
    cards.push({ front: q.q, back: `${q.ans}${q.explanation ? " — " + q.explanation : ""}`, tag: "Quick Recall" });
  }
  for (const ex of chapter.exercises || []) {
    if (cards.length >= 12) break;
    cards.push({ front: ex.q, back: ex.ans, tag: "Book Exercise" });
  }
  if (cards.length === 0) {
    cards.push({ front: chapter.title, back: chapter.intro || chapter.explanation, tag: "Summary" });
  }
  return cards;
}

// Generate Match-the-Column pairs for ANY chapter
export function generateMatchColumnForChapter(chapter, chQuestions = []) {
  const pairs = [];
  for (const c of chapter.concepts || []) {
    if (c.term && c.def) pairs.push({ id: `m_c_${pairs.length}`, left: c.term, right: c.def.slice(0, 72) });
  }
  for (const q of chQuestions) {
    if (pairs.length >= 10) break;
    if (q.q && q.ans) {
      pairs.push({ id: `m_q_${pairs.length}`, left: q.q.slice(0, 68), right: String(q.ans).slice(0, 68) });
    }
  }
  for (const ex of chapter.exercises || []) {
    if (pairs.length >= 10) break;
    pairs.push({ id: `m_e_${pairs.length}`, left: ex.q.slice(0, 68), right: String(ex.ans).slice(0, 68) });
  }
  const rightOptions = pairs.map((p) => ({ id: p.id, text: p.right }));
  for (let i = rightOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rightOptions[i], rightOptions[j]] = [rightOptions[j], rightOptions[i]];
  }
  return { pairs, rightOptions };
}

export async function recordGameCompletion(studentProfile, game, score, total) {
  const attemptId = `game_${studentProfile.studentId}_${game.id}_${Date.now()}`;
  const earnedCoins = score >= 2 ? (game.rewardCoins || 15) : 5;
  const record = {
    attemptId,
    studentId: studentProfile.studentId,
    type: "game",
    gameId: game.id,
    chapterId: game.chapterId,
    score,
    total,
    earnedCoins,
    createdAt: new Date().toISOString()
  };
  await dbPut("studentAttempts", record);
  studentProfile.coins = (studentProfile.coins || 0) + earnedCoins;
  studentProfile.xp = (studentProfile.xp || 0) + earnedCoins * 2;
  await dbPut("studentProfiles", studentProfile);
  await enqueueSyncRecord(studentProfile.studentId, "game_attempt", record, attemptId);
  return { earnedCoins, record };
}
