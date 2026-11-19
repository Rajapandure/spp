// Offline-First IndexedDB Engine (ScholarsPointDB_v7, Schema v2)
// Enforces strict studentId isolation and honest local-first persistence (no fake cloud sync).

const DB_NAME = "ScholarsPointDB_v7";
const DB_VERSION = 2;

export const STORES = {
  users: { keyPath: "userId", indexes: ["username", "role", "studentId"] },
  studentProfiles: { keyPath: "studentId", indexes: ["classNum", "board", "medium", "session"] },
  teacherProfiles: { keyPath: "teacherId", indexes: ["userId"] },
  sessions: { keyPath: "id" },
  subjects: { keyPath: "id", indexes: ["board", "medium", "classNum"] },
  textbooks: { keyPath: "id", indexes: ["board", "medium", "classNum", "subjectId", "status", "session"] },
  chapters: { keyPath: "id", indexes: ["bookId", "board", "medium", "classNum", "subjectId", "status", "verificationStatus"] },
  questions: { keyPath: "id", indexes: ["chapterId", "bookId", "board", "medium", "classNum", "subjectId", "type", "difficulty", "verificationStatus"] },
  games: { keyPath: "id", indexes: ["chapterId", "classNum", "subjectId"] },
  assessments: { keyPath: "id", indexes: ["board", "medium", "classNum", "subjectId", "session"] },
  studentAttempts: { keyPath: "attemptId", indexes: ["studentId", "chapterId", "assessmentId", "type"] },
  studentProgress: { keyPath: "progressId", indexes: ["studentId", "chapterId", "subjectId"] },
  wrongAnswers: { keyPath: "id", indexes: ["studentId", "chapterId", "questionId"] },
  bookmarks: { keyPath: "id", indexes: ["studentId", "chapterId"] },
  highlights: { keyPath: "id", indexes: ["studentId", "chapterId"] },
  offlinePacks: { keyPath: "packId", indexes: ["bookId", "chapterId"] },
  syncQueue: { keyPath: "syncId", indexes: ["studentId", "status", "idempotencyKey"] },
  rewardTransactions: { keyPath: "txId", indexes: ["studentId", "idempotencyKey", "activityType"] },
  assignments: { keyPath: "assignmentId", indexes: ["classNum", "board", "medium", "session", "subjectId"] },
  revisions: { keyPath: "revisionId", indexes: ["studentId", "status", "revisionDate"] },
  settings: { keyPath: "key" }
};

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const [name, cfg] of Object.entries(STORES)) {
        let store;
        if (!db.objectStoreNames.contains(name)) {
          store = db.createObjectStore(name, { keyPath: cfg.keyPath });
        } else {
          store = event.target.transaction.objectStore(name);
        }
        (cfg.indexes || []).forEach((idx) => {
          if (!store.indexNames.contains(idx)) {
            store.createIndex(idx, idx, { unique: false });
          }
        });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

export async function dbGet(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAll(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbQueryByIndex(storeName, indexName, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const idx = tx.objectStore(storeName).index(indexName);
    const req = idx.getAll(value);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut(storeName, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function dbBulkPut(storeName, records) {
  if (!records || !records.length) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const r of records) store.put(r);
    tx.oncomplete = () => resolve(records.length);
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbDelete(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export async function dbClearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Strict Student Isolation Helpers
export async function getStudentProgressMap(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  const rows = await dbQueryByIndex("studentProgress", "studentId", studentId);
  const map = {};
  for (const r of rows) map[r.chapterId] = r;
  return map;
}

export async function getStudentWrongAnswers(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  return dbQueryByIndex("wrongAnswers", "studentId", studentId);
}

export async function getStudentAttempts(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  return dbQueryByIndex("studentAttempts", "studentId", studentId);
}

export async function getStudentBookmarks(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  return dbQueryByIndex("bookmarks", "studentId", studentId);
}

export async function getStudentHighlights(studentId, chapterId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  const rows = await dbQueryByIndex("highlights", "studentId", studentId);
  return chapterId ? rows.filter((h) => h.chapterId === chapterId) : rows;
}

export async function getStudentRewardTransactions(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  return dbQueryByIndex("rewardTransactions", "studentId", studentId);
}

export async function getStudentRevisions(studentId) {
  if (!studentId) throw new Error("Student isolation violation: studentId required");
  return dbQueryByIndex("revisions", "studentId", studentId);
}

// Honest Local-First Activity Persistence (replaces misleading remote-sync statuses)
export async function recordLocalActivity(studentId, entityType, payload, idempotencyKey) {
  const existing = await dbQueryByIndex("syncQueue", "idempotencyKey", idempotencyKey);
  if (existing.length > 0) return existing[0];
  const record = {
    syncId: "act_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
    studentId,
    entityType,
    payload,
    idempotencyKey,
    status: "Saved Locally",
    createdAt: new Date().toISOString()
  };
  await dbPut("syncQueue", record);
  return record;
}

// Backward-compatible alias that never fabricates cloud synchronization
export async function enqueueSyncRecord(studentId, entityType, payload, idempotencyKey) {
  return recordLocalActivity(studentId, entityType, payload, idempotencyKey);
}

export async function getLocalPersistenceSummary(studentId) {
  const all = await dbQueryByIndex("syncQueue", "studentId", studentId);
  const lastBackup = await dbGet("settings", "last_backup_timestamp");
  return {
    savedLocallyCount: all.length,
    statusLabel: lastBackup ? "Backup Available" : "Backup Required",
    lastBackupAt: lastBackup ? lastBackup.value : null
  };
}
