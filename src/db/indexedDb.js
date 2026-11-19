// Offline-First IndexedDB Store for Scholars Point
const DB_NAME = "scholars_point_v2";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("packs")) db.createObjectStore("packs", { keyPath: "packId" });
      if (!db.objectStoreNames.contains("progress")) db.createObjectStore("progress", { keyPath: "id" });
      if (!db.objectStoreNames.contains("mistakes")) db.createObjectStore("mistakes", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("profile")) db.createObjectStore("profile", { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePack(pack) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("packs", "readwrite");
    tx.objectStore("packs").put(pack);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPack(packId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("packs", "readonly");
    const req = tx.objectStore("packs").get(packId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function listPacks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("packs", "readonly");
    const req = tx.objectStore("packs").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePack(packId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("packs", "readwrite");
    tx.objectStore("packs").delete(packId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getStudentState() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("profile", "readonly");
    const req = tx.objectStore("profile").get("student");
    req.onsuccess = () => {
      resolve(req.result?.value || {
        name: "Aarav",
        grade: 6,
        board: "MP Board",
        medium: "English Medium",
        xp: 640,
        streak: 5,
        completedChapters: ["math-ch1", "math-ch2", "sci-ch1"]
      });
    };
    req.onerror = () => resolve({ name: "Aarav", grade: 6, board: "MP Board", medium: "English Medium", xp: 640, streak: 5, completedChapters: [] });
  });
}

export async function saveStudentState(state) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("profile", "readwrite");
    tx.objectStore("profile").put({ key: "student", value: state });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function addMistake(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("mistakes", "readwrite");
    tx.objectStore("mistakes").add({ ...entry, createdAt: new Date().toISOString() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function listMistakes() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("mistakes", "readonly");
    const req = tx.objectStore("mistakes").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}
