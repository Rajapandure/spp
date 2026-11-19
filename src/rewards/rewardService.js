// Reliable Reward Transaction Ledger & Learning-Activity Streak Engine
// Rules:
// 1. Login alone NEVER increases streak.
// 2. Meaningful learning activities increment streak at most once per local calendar day.
// 3. Idempotency keys prevent duplicate completion XP/coins.

import { dbPut, dbQueryByIndex } from "../db/database.js";

export function getLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function updateStreakOnLearningActivity(profile) {
  const today = getLocalDateKey();
  if (profile.lastLearningDate === today) return false;
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = getLocalDateKey(yesterdayDate);

  profile.streak = profile.lastLearningDate === yesterday ? (profile.streak || 0) + 1 : 1;
  profile.lastLearningDate = today;
  profile.streakHistory = Array.isArray(profile.streakHistory) ? profile.streakHistory : [];
  if (!profile.streakHistory.includes(today)) profile.streakHistory.push(today);
  return true;
}

export async function awardActivityReward(studentProfile, {
  activityType,
  subjectId = "",
  chapterId = "",
  xp = 0,
  coins = 0,
  idempotencyKey,
  note = ""
}) {
  if (!studentProfile || !studentProfile.studentId) {
    throw new Error("Student profile required for reward transaction.");
  }
  if (idempotencyKey) {
    const existing = await dbQueryByIndex("rewardTransactions", "idempotencyKey", idempotencyKey);
    if (existing.length > 0) {
      return { awarded: false, reason: "Duplicate completion prevented", xp: 0, coins: 0, tx: existing[0] };
    }
  }

  const streakUpdated = updateStreakOnLearningActivity(studentProfile);
  const safeXP = Math.max(0, Number(xp) || 0);
  const safeCoins = Math.max(0, Number(coins) || 0);

  const tx = {
    txId: `tx_${studentProfile.studentId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    studentId: studentProfile.studentId,
    activityType,
    subjectId,
    chapterId,
    xpEarned: safeXP,
    coinsEarned: safeCoins,
    streakUpdated,
    note,
    idempotencyKey: idempotencyKey || `tx_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  studentProfile.xp = (studentProfile.xp || 0) + safeXP;
  studentProfile.coins = (studentProfile.coins || 0) + safeCoins;

  await dbPut("rewardTransactions", tx);
  await dbPut("studentProfiles", studentProfile);
  return { awarded: true, xp: safeXP, coins: safeCoins, streakUpdated, tx };
}
