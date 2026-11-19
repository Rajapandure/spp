// Versioned Complete Backup & Restore Engine (Merge / Replace with Safety Backup & Rollback)
import { dbBulkPut, dbClearStore, dbGet, dbGetAll, dbPut } from "../db/database.js";

const BACKUP_FORMAT_VERSION = "2.0";
const APP_VERSION = "2.0.0";
const SCHEMA_VERSION = 2;

const BACKUP_STORES = [
  "studentProfiles", "teacherProfiles", "textbooks", "chapters", "questions",
  "games", "assessments", "studentProgress", "studentAttempts", "wrongAnswers",
  "bookmarks", "highlights", "rewardTransactions", "assignments", "revisions",
  "offlinePacks", "settings"
];

function computeChecksum(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export async function createCompleteBackup() {
  const data = {};
  const recordCounts = {};
  for (const store of BACKUP_STORES) {
    const rows = await dbGetAll(store);
    data[store] = rows;
    recordCounts[store] = rows.length;
  }

  // Include user account metadata WITHOUT plain-text passwords/PINs
  const users = await dbGetAll("users");
  data.users = users.map((u) => ({
    userId: u.userId,
    username: u.username,
    role: u.role,
    studentId: u.studentId || null,
    status: u.status,
    salt: u.salt,
    passwordHash: u.passwordHash,
    createdAt: u.createdAt
  }));
  recordCounts.users = data.users.length;

  const serializedData = JSON.stringify(data);
  const backup = {
    appName: "Scholars Point",
    backupFormatVersion: BACKUP_FORMAT_VERSION,
    appVersion: APP_VERSION,
    schemaVersion: SCHEMA_VERSION,
    credentialsPolicy: "salted_sha256_hashes_only_no_plaintext",
    createdAt: new Date().toISOString(),
    recordCounts,
    checksum: computeChecksum(serializedData),
    data
  };

  await dbPut("settings", { key: "last_backup_timestamp", value: backup.createdAt });
  return backup;
}

export function validateBackupObject(parsed) {
  const errors = [];
  if (!parsed || typeof parsed !== "object") {
    return { valid: false, errors: ["Invalid JSON object."] };
  }
  if (parsed.appName !== "Scholars Point") errors.push("Not a Scholars Point backup file.");
  if (!parsed.backupFormatVersion) errors.push("Missing backupFormatVersion.");
  if (!parsed.data || typeof parsed.data !== "object") errors.push("Missing data sections.");
  else {
    if (!Array.isArray(parsed.data.studentProfiles)) errors.push("Missing studentProfiles array.");
    if (!Array.isArray(parsed.data.chapters)) errors.push("Missing chapters array.");
    const expectedSum = computeChecksum(JSON.stringify(parsed.data));
    if (parsed.checksum && parsed.checksum !== expectedSum) {
      errors.push("Backup integrity checksum mismatch (file may be modified or corrupted).");
    }
  }
  return { valid: errors.length === 0, errors };
}

export async function restoreBackup(parsed, mode = "merge") {
  const check = validateBackupObject(parsed);
  if (!check.valid) {
    throw new Error("Backup validation failed: " + check.errors.join(" "));
  }

  // Create automatic safety backup before any destructive replacement
  const safetyBackup = await createCompleteBackup();
  await dbPut("settings", { key: "safety_backup_pre_restore", value: safetyBackup });

  const allTargetStores = [...BACKUP_STORES, "users"];
  let added = 0;
  let updated = 0;

  try {
    if (mode === "replace") {
      for (const store of allTargetStores) {
        await dbClearStore(store);
        const rows = parsed.data[store] || [];
        if (rows.length) {
          await dbBulkPut(store, rows);
          added += rows.length;
        }
      }
    } else {
      // Merge mode: preserve existing records, add missing, prevent duplicate IDs
      const kpMap = {
        users: "userId", studentProfiles: "studentId", teacherProfiles: "teacherId",
        textbooks: "id", chapters: "id", questions: "id", games: "id", assessments: "id",
        studentProgress: "progressId", studentAttempts: "attemptId", wrongAnswers: "id",
        bookmarks: "id", highlights: "id", rewardTransactions: "txId",
        assignments: "assignmentId", revisions: "revisionId", offlinePacks: "packId", settings: "key"
      };
      for (const store of allTargetStores) {
        const incoming = parsed.data[store] || [];
        if (!incoming.length) continue;
        const existing = await dbGetAll(store);
        const kp = kpMap[store];
        const existingKeys = new Set(existing.map((r) => r[kp]));
        const toInsert = incoming.filter((r) => r && r[kp] && !existingKeys.has(r[kp]));
        if (toInsert.length) {
          await dbBulkPut(store, toInsert);
          added += toInsert.length;
        }
      }
    }
    return { success: true, mode, added, updated };
  } catch (err) {
    // Rollback to safetyBackup if replacement failed mid-way
    if (mode === "replace") {
      for (const store of allTargetStores) {
        await dbClearStore(store);
        const rows = safetyBackup.data[store] || [];
        if (rows.length) await dbBulkPut(store, rows);
      }
    }
    throw new Error("Restore failed and rolled back safely: " + err.message);
  }
}
