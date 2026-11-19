// Authentication, Salted SHA-256 Hashing, Session Persistence & Account Isolation
// SECURITY NOTE: Local PIN/password authentication and IndexedDB storage are client-side only
// and are NOT equivalent to server-side authentication or encrypted database storage.
import { dbGet, dbGetAll, dbPut, dbQueryByIndex } from "../db/database.js";

const SESSION_KEY = "sp_active_session_v7";

// Pure JS SHA-256 fallback for file:// or non-secure contexts where crypto.subtle is unavailable
function sha256Fallback(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = "length";
  let i, j, result = "";
  const words = [], asciiBitLength = ascii[lengthProperty] * 8;
  let hash = sha256Fallback.h = sha256Fallback.h || [];
  const k = sha256Fallback.k = sha256Fallback.k || [];
  let primeCounter = k[lengthProperty], isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16)), oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] +
        (w[i] = i < 16 ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
}

export async function hashSecret(secret, salt) {
  const input = `${salt}:${secret}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return sha256Fallback(input);
}

export function generateSalt() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function generateStudentId(classNum) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SP-2026-C${classNum}-${rand}`;
}

export async function registerStudent({
  name,
  username,
  pinOrPassword,
  classNum,
  board,
  medium,
  session = "2026-27",
  schoolName = "",
  avatar = "owl",
  createdBy = "self",
  customStudentId = ""
}) {
  if (!name || !username || !pinOrPassword || !classNum || !board || !medium) {
    throw new Error("All required student fields must be provided.");
  }
  if (String(pinOrPassword).length < 4) {
    throw new Error("PIN/Password must be at least 4 characters.");
  }
  const cleanUser = username.trim().toLowerCase();
  const existingUsers = await dbQueryByIndex("users", "username", cleanUser);
  if (existingUsers.length > 0) {
    throw new Error(`Username "${cleanUser}" is already taken.`);
  }

  const studentId = customStudentId.trim() || generateStudentId(classNum);
  const existingStudent = await dbGet("studentProfiles", studentId);
  if (existingStudent) {
    throw new Error(`Student ID "${studentId}" already exists.`);
  }

  const salt = generateSalt();
  const passwordHash = await hashSecret(String(pinOrPassword), salt);
  const userId = "usr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);

  const userRecord = {
    userId,
    username: cleanUser,
    role: "student",
    studentId,
    salt,
    passwordHash,
    status: "active",
    offlinePinEnabled: true,
    createdBy,
    createdAt: new Date().toISOString()
  };

  const profileRecord = {
    studentId,
    userId,
    name: name.trim(),
    username: cleanUser,
    classNum: String(classNum),
    board,
    medium,
    session,
    schoolName: schoolName.trim(),
    avatar,
    coins: 0,
    xp: 0,
    streak: 0,
    lastLearningDate: null,
    streakHistory: [],
    achievements: ["welcome_scholar"],
    dailyActivity: {},
    status: "active",
    createdAt: new Date().toISOString()
  };

  await dbPut("users", userRecord);
  await dbPut("studentProfiles", profileRecord);
  return { user: userRecord, profile: profileRecord };
}

export async function loginStudent(identifier, pinOrPassword, isOfflineMode = !navigator.onLine) {
  const cleanId = identifier.trim();
  let user = null;

  // Allow login by Student ID (for younger classes) OR Username
  const byUsername = await dbQueryByIndex("users", "username", cleanId.toLowerCase());
  if (byUsername.length > 0) {
    user = byUsername[0];
  } else {
    const byStudentId = await dbQueryByIndex("users", "studentId", cleanId);
    if (byStudentId.length > 0) user = byStudentId[0];
  }

  if (!user || user.role !== "student") {
    throw new Error("Student account not found. Please check your Student ID or Username.");
  }
  if (user.status !== "active") {
    throw new Error("This account is currently inactive. Contact your teacher/admin.");
  }

  const candidateHash = await hashSecret(String(pinOrPassword), user.salt);
  if (candidateHash !== user.passwordHash) {
    throw new Error("Incorrect PIN or Password.");
  }

  const profile = await dbGet("studentProfiles", user.studentId);
  if (!profile) throw new Error("Student profile record missing.");

  // Login alone must NOT increment learning streak; streaks update only on learning activities.

  const sessionObj = {
    role: "student",
    userId: user.userId,
    studentId: profile.studentId,
    authMode: isOfflineMode ? "offline_cached_pin" : "local_verified",
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  return { session: sessionObj, profile };
}

export async function hasTeacherAccount() {
  const teachers = await dbQueryByIndex("users", "role", "teacher");
  return teachers.length > 0;
}

export async function setupTeacherAccount({ name, username, pinOrPassword }) {
  const existing = await dbQueryByIndex("users", "role", "teacher");
  if (existing.length > 0) throw new Error("Teacher/Admin account already configured.");
  if (!pinOrPassword || String(pinOrPassword).length < 4) {
    throw new Error("Admin password/PIN must be at least 4 characters.");
  }
  const salt = generateSalt();
  const passwordHash = await hashSecret(String(pinOrPassword), salt);
  const userId = "tchr_" + Date.now();
  const userRecord = {
    userId,
    username: username.trim().toLowerCase(),
    role: "teacher",
    salt,
    passwordHash,
    status: "active",
    createdAt: new Date().toISOString()
  };
  const teacherProfile = {
    teacherId: userId,
    userId,
    name: name.trim(),
    roleTitle: "School Admin / Teacher",
    createdAt: new Date().toISOString()
  };
  await dbPut("users", userRecord);
  await dbPut("teacherProfiles", teacherProfile);
  return { user: userRecord, profile: teacherProfile };
}

export async function loginTeacher(username, pinOrPassword) {
  const matches = await dbQueryByIndex("users", "username", username.trim().toLowerCase());
  const user = matches.find((u) => u.role === "teacher" || u.role === "admin");
  if (!user) throw new Error("Teacher/Admin account not found.");
  const candidateHash = await hashSecret(String(pinOrPassword), user.salt);
  if (candidateHash !== user.passwordHash) throw new Error("Invalid Teacher/Admin credentials.");
  const profile = await dbGet("teacherProfiles", user.userId);
  const sessionObj = {
    role: "teacher",
    userId: user.userId,
    teacherId: user.userId,
    authMode: navigator.onLine ? "local_verified" : "offline_cached_pin",
    loggedInAt: new Date().toISOString()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  return { session: sessionObj, profile };
}

export async function resetStudentPinByTeacher(teacherSession, studentId, newPin) {
  if (!teacherSession || teacherSession.role !== "teacher") {
    throw new Error("Unauthorized: Only an authenticated teacher/admin can reset a student PIN.");
  }
  if (!newPin || String(newPin).length < 4) {
    throw new Error("New PIN must be at least 4 characters.");
  }
  const matches = await dbQueryByIndex("users", "studentId", studentId);
  if (!matches.length) throw new Error("Student user record not found.");
  const user = matches[0];
  user.salt = generateSalt();
  user.passwordHash = await hashSecret(String(newPin), user.salt);
  user.updatedAt = new Date().toISOString();
  await dbPut("users", user);
  return true;
}

export function getSavedSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function listAllStudentsForCMS() {
  return dbGetAll("studentProfiles");
}
