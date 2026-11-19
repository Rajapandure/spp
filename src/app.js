// Scholars Point — Main Application Controller & UI Renderer
import { ACADEMIC_SESSIONS, AVATARS, BOARDS, CLASS_CONFIGS, MEDIUMS } from "./config/classes.js";
import {
  dbBulkPut, dbDelete, dbGet, dbGetAll, dbPut, dbQueryByIndex,
  getStudentAttempts, getStudentBookmarks, getStudentProgressMap,
  getStudentRewardTransactions, getStudentRevisions, getStudentWrongAnswers, recordLocalActivity
} from "./db/database.js";
import { awardActivityReward, getLocalDateKey } from "./rewards/rewardService.js";
import { createCompleteBackup, restoreBackup, validateBackupObject } from "./backup/backupService.js";
import { escapeHTML, validateImportPayload } from "./ui/sanitize.js";
import {
  getSavedSession, hasTeacherAccount, loginStudent, loginTeacher,
  logoutSession, registerStudent, resetStudentPinByTeacher, setupTeacherAccount
} from "./auth/auth.js";
import { ensureCurriculumSeeded, getStudentCurriculum } from "./curriculum/curriculumService.js";
import { renderAchievementBadgeSVG, renderAvatarSVG, renderClipboardSVG, renderGradCapSVG, renderOpenBookSVG, renderScholarHeroSVG, renderSubjectSVG, renderTrophySVG } from "./ui/illustrations.js";
import {
  addHighlight, getBookOfflineStatus, getStorageUsageSummary, renderLearnChapterHTML,
  speakChapterText, stopChapterSpeech, toggleBookmark, toggleBookOfflinePack
} from "./reader/textbookReader.js";
import { generateGameRound, generateMatchColumnForChapter, generatePlaycardsForChapter, recordGameCompletion } from "./games/gameEngine.js";
import {
  buildMockPaper, EXAM_TEMPLATES, loadExamDraft, normalizeAns,
  saveExamDraft, submitMockExam
} from "./assessment/examEngine.js";
import { renderCMSDashboardHTML } from "./cms/cmsModule.js";

const state = {
  session: null,
  profile: null,
  teacherProfile: null,
  curriculum: null,
  progressMap: {},
  view: "home", // home | learn | books | practice | games | exercises | mock | progress | profile | cms
  cmsTab: "content",
  authTab: "student_login", // student_login | student_register | teacher_login
  selectedSubjectId: null,
  selectedChapterId: null,
  chapterTab: "LEARN", // LEARN | PRACTICE | EXERCISE | PLAY | TEST
  readerFontSize: 16,
  practiceState: { idx: 0, answered: false, selected: "", difficulty: "ALL", retryOnly: false },
  gameState: { mode: "playcard", cardIdx: 0, flipped: false, matchData: null, matchLeft: null, matchedIds: [], matchFeedback: "", activeGame: null, level: 1, score: 0, round: null, feedback: "" },
  quickTest: { answers: {}, submitted: false, startTime: Date.now() },
  searchQuery: "",
  examState: { paper: null, answers: {}, currentIdx: 0, secondsLeft: 0, timerId: null, lastResult: null },
  darkMode: false
};

function showToast(msg, type = "info") {
  const el = document.getElementById("sp-toast");
  if (!el) return;
  const bg = type === "error" ? "#dc2626" : type === "success" ? "#059669" : "#1e293b";
  el.style.background = bg;
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, 3200);
}

function applyClassTheme(classNum) {
  const cfg = CLASS_CONFIGS[String(classNum)] || CLASS_CONFIGS["5"];
  const root = document.documentElement;
  root.style.setProperty("--accent-primary", cfg.accentPrimary);
  root.style.setProperty("--accent-secondary", cfg.accentSecondary);
  root.style.setProperty("--bg-tint", cfg.bgTint);
  root.style.setProperty("--radius-card", cfg.cardRadius);
  root.style.setProperty("--btn-min-h", cfg.btnMinHeight);
  root.style.setProperty("--font-size-base", cfg.fontSizeBase);
}

async function bootstrap() {
  const savedTheme = localStorage.getItem("sp_theme") || "light";
  state.darkMode = savedTheme === "dark";
  document.documentElement.classList.toggle("dark", state.darkMode);
  await ensureCurriculumSeeded();
  const saved = getSavedSession();
  if (saved && saved.role === "student" && saved.studentId) {
    const profile = await dbGet("studentProfiles", saved.studentId);
    if (profile && profile.status === "active") {
      state.session = saved;
      state.profile = profile;
      await loadStudentContext();
    } else {
      logoutSession();
    }
  } else if (saved && saved.role === "teacher" && saved.teacherId) {
    const tp = await dbGet("teacherProfiles", saved.teacherId);
    if (tp) {
      state.session = saved;
      state.teacherProfile = tp;
      state.view = "cms";
    } else {
      logoutSession();
    }
  }
  window.addEventListener("online", handleNetworkChange);
  window.addEventListener("offline", handleNetworkChange);
  render();
}

async function handleNetworkChange() {
  render();
}

async function loadStudentContext() {
  applyClassTheme(state.profile.classNum);
  state.curriculum = await getStudentCurriculum(state.profile);
  state.progressMap = await getStudentProgressMap(state.profile.studentId);
  window.SP._cachedAssessments = await dbGetAll("assessments");
  if (state.curriculum.subjects.length > 0 && !state.selectedSubjectId) {
    state.selectedSubjectId = state.curriculum.subjects[0].id;
  }
  const subChapters = state.curriculum.chapters.filter((c) => c.subjectId === state.selectedSubjectId);
  if (subChapters.length > 0 && !state.selectedChapterId) {
    state.selectedChapterId = subChapters[0].id;
  }
}

async function render() {
  const app = document.getElementById("sp-app");
  if (!app) return;

  if (!state.session) {
    app.innerHTML = await renderAuthScreen();
    return;
  }

  if (state.session.role === "teacher") {
    app.innerHTML = renderTopBar(true) + (await renderCMSDashboardHTML(state.teacherProfile, state.cmsTab));
    return;
  }

  let bodyHTML = "";
  if (state.view === "home") bodyHTML = await renderStudentHome();
  else if (state.view === "learn" || state.view === "practice" || state.view === "games") {
    bodyHTML = await renderSubjectChapterWorkspace();
  } else if (state.view === "books") bodyHTML = await renderBooksManager();
  else if (state.view === "mock") bodyHTML = await renderMockExamView();
  else if (state.view === "tasks") bodyHTML = await renderTasksView();
  else if (state.view === "search") bodyHTML = await renderSearchView();
  else if (state.view === "progress" || state.view === "profile") bodyHTML = await renderProgressAndProfile();

  app.innerHTML = `<div class="sp-app-shell">${renderSidebar()}<div class="sp-main-area">${state.view === "home" ? "" : renderTopBar(false)}${bodyHTML}</div></div>${renderMobileBottomNav()}`;
}

async function renderAuthScreen() {
  const teacherExists = await hasTeacherAccount();
  const selfRegSetting = await dbGet("settings", "selfRegistrationEnabled");
  const selfRegEnabled = selfRegSetting ? Boolean(selfRegSetting.value) : true;
  const offlineBadge = navigator.onLine
    ? `<span class="sp-badge" style="background:#d1fae5;color:#065f46;">● Online Ready</span>`
    : `<span class="sp-badge" style="background:#fef3c7;color:#92400e;">● Offline Mode (Cached PIN Unlock)</span>`;

  return `
    <div class="sp-container" style="max-width:520px;padding-top:32px;padding-bottom:48px;">
      <div style="display:flex;justify-content:flex-end;margin-bottom:8px;"><button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 12px;font-size:12px;" onclick="window.SP.toggleDark()">${state.darkMode ? "☀️ Light" : "🌙 Dark"}</button></div>
      <div style="text-align:center;margin-bottom:20px;">
        <div style="width:64px;height:64px;border-radius:20px;background:var(--accent-primary);color:#fff;font-size:24px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px;box-shadow:var(--shadow-card);">SP</div>
        <h1 style="margin:0;font-size:1.6rem;">Scholars Point</h1>
        <p style="margin:4px 0 8px;color:var(--text-secondary);font-size:0.9rem;">Offline-First Digital Learning Platform · Classes 1 to 10 (NCERT, CBSE & MP Board)</p>
        ${offlineBadge}
      </div>

      <div class="sp-card" style="padding:20px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:18px;background:var(--bg-muted);padding:4px;border-radius:14px;">
          <button class="sp-btn ${state.authTab === "student_login" ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:38px;font-size:0.8rem;border:none;" onclick="window.SP.setAuthTab('student_login')">Student Login</button>
          <button class="sp-btn ${state.authTab === "student_register" ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:38px;font-size:0.8rem;border:none;" onclick="window.SP.setAuthTab('student_register')">New Student</button>
          <button class="sp-btn ${state.authTab === "teacher_login" ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:38px;font-size:0.8rem;border:none;" onclick="window.SP.setAuthTab('teacher_login')">Teacher CMS</button>
        </div>

        ${state.authTab === "student_login" ? `
          <form onsubmit="window.SP.handleStudentLogin(event)" style="display:grid;gap:12px;">
            <div>
              <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px;">Student ID or Username</label>
              <input id="loginIdentifier" class="sp-input" placeholder="e.g. SP-2026-C5-1024 or aarav" required />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px;">PIN or Password</label>
              <input id="loginSecret" type="password" class="sp-input" placeholder="Enter your PIN / Password" required />
            </div>
            <button type="submit" class="sp-btn sp-btn-primary" style="width:100%;">🚀 Open My Class Portal</button>
            <p style="margin:0;font-size:11px;color:var(--text-muted);text-align:center;">Offline? Previously registered students can unlock their local profile using their PIN.</p>
          </form>
        ` : ""}

        ${state.authTab === "student_register" ? (selfRegEnabled ? `
          <form onsubmit="window.SP.handleStudentRegister(event)" style="display:grid;gap:10px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="font-size:12px;font-weight:700;">Full Name *</label>
                <input id="regName" class="sp-input" placeholder="Student Name" required />
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Username *</label>
                <input id="regUsername" class="sp-input" placeholder="e.g. ananya_c1" required />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="font-size:12px;font-weight:700;">PIN / Password (4+ chars) *</label>
                <input id="regPin" type="password" minlength="4" class="sp-input" placeholder="4+ digits/chars" required />
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Class (1–10) *</label>
                <select id="regClass" class="sp-select">
                  ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Class ${i + 1}</option>`).join("")}
                </select>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="font-size:12px;font-weight:700;">Board *</label>
                <select id="regBoard" class="sp-select">
                  ${Object.values(BOARDS).map((b) => `<option value="${b.id}">${b.name}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Medium *</label>
                <select id="regMedium" class="sp-select">
                  ${Object.values(MEDIUMS).map((m) => `<option value="${m.id}">${m.name}</option>`).join("")}
                </select>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="font-size:12px;font-weight:700;">Academic Session</label>
                <select id="regSession" class="sp-select">
                  ${ACADEMIC_SESSIONS.map((s) => `<option value="${s}">${s}</option>`).join("")}
                </select>
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Avatar</label>
                <select id="regAvatar" class="sp-select">
                  ${AVATARS.map((a) => `<option value="${a.id}">${a.label}</option>`).join("")}
                </select>
              </div>
            </div>
            <input id="regSchool" class="sp-input" placeholder="School Name (Optional)" />
            <button type="submit" class="sp-btn sp-btn-success" style="width:100%;">✨ Create My Individual Account</button>
          </form>
        ` : `<div style="padding:16px;text-align:center;color:var(--text-muted);">Self-registration is disabled by your school admin. Ask your teacher to create your account.</div>`) : ""}

        ${state.authTab === "teacher_login" ? (teacherExists ? `
          <form onsubmit="window.SP.handleTeacherLogin(event)" style="display:grid;gap:12px;">
            <div>
              <label style="font-size:12px;font-weight:700;">Teacher / Admin Username</label>
              <input id="tchrLoginUser" class="sp-input" placeholder="Admin username" required />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;">Password / PIN</label>
              <input id="tchrLoginPin" type="password" class="sp-input" placeholder="Password / PIN" required />
            </div>
            <button type="submit" class="sp-btn sp-btn-primary" style="width:100%;">🔓 Enter Teacher CMS</button>
          </form>
        ` : `
          <form onsubmit="window.SP.handleTeacherSetup(event)" style="display:grid;gap:10px;">
            <div class="sp-badge" style="background:#dbeafe;color:#1e40af;justify-content:center;">First-Time Teacher / Admin Setup</div>
            <input id="tchrSetupName" class="sp-input" placeholder="Teacher / Admin Full Name" required />
            <input id="tchrSetupUser" class="sp-input" placeholder="Admin Username (e.g. admin)" required />
            <input id="tchrSetupPin" type="password" minlength="4" class="sp-input" placeholder="Create Secure PIN/Password (4+ chars)" required />
            <button type="submit" class="sp-btn sp-btn-success" style="width:100%;">🛡️ Initialize Teacher CMS Account</button>
          </form>
        `) : ""}
      </div>
    </div>
  `;
}

function renderSidebar() {
  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "learn", icon: "📖", label: "My Subjects" },
    { id: "tasks", icon: "📋", label: "My Tasks" },
    { id: "progress", icon: "📊", label: "My Progress" },
    { id: "profile", icon: "👤", label: "My Profile" }
  ];
  return `
    <aside class="sp-sidebar no-print">
      <div>
        <div style="display:flex;align-items:center;gap:10px;padding:4px 8px;cursor:pointer;" onclick="window.SP.goHome()">
          ${renderGradCapSVG(34)}
          <div style="font-weight:900;font-size:1.1rem;line-height:1.15;color:#fff;">Scholars<br/>Point</div>
        </div>
        <nav class="sp-sidebar-nav">
          ${navItems.map(it => `
            <button class="sp-sidebar-btn ${state.view === it.id ? "active" : ""}" onclick="window.SP.setView('${it.id}')">
              <span>${it.icon}</span><span>${it.label}</span>
            </button>
          `).join("")}
        </nav>
      </div>
      <div>
        <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:14px;text-align:center;margin-bottom:14px;">
          ${renderTrophySVG(54)}
          <div style="font-weight:800;font-size:0.88rem;color:#fff;margin-top:4px;">Keep Learning!</div>
          <div style="font-size:0.74rem;color:#cbd5e1;">You're doing great!</div>
        </div>
        <button onclick="window.SP.toggleDark()" style="width:100%;padding:9px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.12);color:#fff;font-weight:700;font-size:0.8rem;cursor:pointer;">
          ${state.darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </aside>
  `;
}

function renderTopBar(isTeacher) {
  const p = state.profile;
  const syncBadge = navigator.onLine
    ? `<span class="sp-badge" style="background:#d1fae5;color:#065f46;" title="Data is stored locally in IndexedDB">● Saved Locally (Online)</span>`
    : `<span class="sp-badge" style="background:#fef3c7;color:#92400e;" title="Working offline from local IndexedDB">● Offline (Local)</span>`;
  return `
    <header class="sp-topbar no-print">
      <div style="max-width:1220px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;cursor:pointer;" onclick="window.SP.goHome()">
          ${isTeacher ? `<div style="width:38px;height:38px;border-radius:12px;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;">CMS</div>` : renderAvatarSVG(p.avatar, 40)}
          <div style="min-width:0;">
            <div style="font-weight:800;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${isTeacher ? "Scholars Point CMS" : escapeHTML(p.name)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${isTeacher ? "Teacher & Admin Studio" : `Class ${p.classNum} · ${BOARDS[p.board]?.name || p.board} · ${MEDIUMS[p.medium]?.name || p.medium}`}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${!isTeacher ? `<span class="sp-badge" style="background:#fef3c7;color:#92400e;">🔥 ${p.streak || 1}d · 🪙 ${p.coins || 0}</span>` : ""}
          ${syncBadge}
          ${!isTeacher ? `<button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.setView('search')">🔍 Search</button><button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.setView('tasks')">📋 Tasks</button><button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.openRoughSlate()">✏️ Slate</button>` : ""}
          <button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.toggleDark()">${state.darkMode ? "☀️" : "🌙"}</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.logout()">Logout</button>
        </div>
      </div>
    </header>
  `;
}

async function renderStudentHome() {
  const p = state.profile;
  const cfg = CLASS_CONFIGS[p.classNum] || CLASS_CONFIGS["5"];
  const { subjects, chapters } = state.curriculum;
  const completedCount = Object.values(state.progressMap).filter((pr) => pr.completed).length;
  const nextChapter = chapters.find((c) => !state.progressMap[c.id]?.completed) || chapters[0];
  const nextSub = nextChapter ? subjects.find((s) => s.id === nextChapter.subjectId) : subjects[0];

  const xp = p.xp || 0;
  const level = Math.floor(xp / 200) + 1;
  const nextLevelXP = level * 200;
  const xpIntoLevel = xp % 200;
  const xpPct = Math.min(100, Math.round((xpIntoLevel / 200) * 100));
  const xpRemaining = nextLevelXP - xp;

  const allAssignments = await dbGetAll("assignments");
  const myTasks = allAssignments.filter(a => a.classNum === p.classNum && a.board === p.board && a.medium === p.medium && a.session === (p.session || "2026-27"));
  const pendingTasks = myTasks.filter(a => !(a.completedBy && a.completedBy[p.studentId]));
  const savedDraft = await loadExamDraft(p.studentId);

  const pastelMap = {
    maths: { bg: "#eff6ff", bar: "#2563eb", btn: "#dbeafe", col: "#1e40af" },
    science: { bg: "#ecfdf5", bar: "#10b981", btn: "#d1fae5", col: "#065f46" },
    evs: { bg: "#ecfdf5", bar: "#10b981", btn: "#d1fae5", col: "#065f46" },
    english: { bg: "#fff7ed", bar: "#f97316", btn: "#ffedd5", col: "#9a3412" },
    grammar: { bg: "#f5f3ff", bar: "#7c3aed", btn: "#ede9fe", col: "#5b21b6" },
    hindi: { bg: "#f5f3ff", bar: "#7c3aed", btn: "#ede9fe", col: "#5b21b6" },
    sanskrit: { bg: "#fdf2f8", bar: "#db2777", btn: "#fce7f3", col: "#9d174d" },
    social: { bg: "#fefce8", bar: "#d97706", btn: "#fef3c7", col: "#92400e" }
  };

  return `
    <div class="sp-container">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:46px;height:46px;border-radius:14px;background:#dbeafe;display:flex;align-items:center;justify-content:center;">${renderGradCapSVG(30)}</div>
          <div>
            <h2 class="sp-chapter-head" style="margin:0;font-size:1.35rem;">Good Morning, ${escapeHTML(p.name)}! 👋</h2>
            <div style="font-size:0.86rem;color:var(--text-secondary);">Ready to learn something new today?</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="sp-badge" style="background:var(--bg-card);border:1px solid var(--border-subtle);color:var(--text-primary);padding:6px 12px;">
            ${cfg.label} · ${BOARDS[p.board]?.name || p.board} · ${MEDIUMS[p.medium]?.name || p.medium} · ${escapeHTML(p.session || "2026-27")}
          </span>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.setView('search')" title="Search">🔍</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.openRoughSlate()" title="Rough Slate">✏️</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.logout()">Logout</button>
          <div style="cursor:pointer;" onclick="window.SP.setView('profile')">${renderAvatarSVG(p.avatar, 36)}</div>
        </div>
      </div>

      ${state.curriculum.sessionMissing ? `
        <div class="sp-card" style="padding:24px;text-align:center;margin-bottom:18px;">
          <p style="font-weight:700;margin-top:0;">No verified curriculum is currently available for this academic session (${escapeHTML(p.session || "2026-27")}).</p>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px;">
            ${(state.curriculum.availableSessions || ["2026-27"]).map(ss => `<button class="sp-btn sp-btn-primary" onclick="window.SP.switchStudentSession('${ss}')">Switch to Session ${ss}</button>`).join("")}
          </div>
        </div>
      ` : `
        <div class="sp-dash-grid">
          <div>
            <div class="sp-hero-journey">
              ${renderScholarHeroSVG(102)}
              <div style="flex:1;min-width:200px;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <strong style="font-size:0.95rem;">Your Learning Journey</strong>
                  <span class="sp-badge" style="background:#f59e0b;color:#fff;">⭐ Level ${level}</span>
                </div>
                <div style="display:flex;align-items:baseline;gap:12px;margin:4px 0;">
                  <span style="font-size:1.85rem;font-weight:900;">${xp} XP</span>
                  <span style="font-size:0.84rem;opacity:0.85;">Next Level: ${nextLevelXP} XP</span>
                </div>
                <div class="sp-xp-bar" style="background:rgba(255,255,255,0.75);height:11px;">
                  <div class="sp-xp-bar-fill" style="width:${xpPct}%;background:#2563eb;"></div>
                </div>
                <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:0.8rem;font-weight:700;margin-top:8px;">
                  <span>⭐ ${xpRemaining} XP to next level</span>
                  <span>🔥 ${p.streak || 0}-day streak</span>
                  <span>🪙 ${p.coins || 0} Coins</span>
                </div>
              </div>
              ${renderTrophySVG(82)}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <h3 class="sp-chapter-head" style="margin:0;font-size:1.1rem;">📖 My Subjects</h3>
              <button class="sp-btn sp-btn-secondary" style="min-height:32px;padding:0 12px;font-size:12px;" onclick="window.SP.setView('books')">View All →</button>
            </div>

            <div class="sp-subject-grid-${cfg.subjectCardSize}">
              ${subjects.map((sub) => {
                const subChs = chapters.filter((c) => c.subjectId === sub.id);
                const done = subChs.filter((c) => state.progressMap[c.id]?.completed).length;
                const pct = subChs.length ? Math.round((done / subChs.length) * 100) : 0;
                const pt = pastelMap[sub.id] || pastelMap.maths;
                return `
                  <div class="sp-card sp-card-interactive" style="padding:16px;cursor:pointer;background:${state.darkMode ? "var(--bg-card)" : pt.bg};display:flex;flex-direction:column;justify-content:space-between;gap:10px;" onclick="window.SP.openSubject('${sub.id}')">
                    <div>
                      ${renderSubjectSVG(sub.icon, 44)}
                      <div class="sp-chapter-head" style="font-size:1.02rem;margin-top:8px;">${escapeHTML(sub.name)}</div>
                      <div style="font-size:0.78rem;color:var(--text-secondary);">${subChs.length} Chapters · ${done} Completed</div>
                    </div>
                    <div>
                      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <div class="sp-xp-bar" style="flex:1;height:7px;">
                          <div class="sp-xp-bar-fill" style="width:${pct}%;background:${pt.bar};"></div>
                        </div>
                        <span style="font-size:0.76rem;font-weight:800;">${pct}%</span>
                      </div>
                      <div style="padding:7px 10px;border-radius:999px;background:${state.darkMode ? "var(--bg-muted)" : pt.btn};color:${state.darkMode ? "var(--text-primary)" : pt.col};text-align:center;font-size:0.78rem;font-weight:800;">
                        Go to Subject →
                      </div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>

            <div class="sp-dash-bottom-row">
              <div class="sp-card" style="padding:16px;">
                <h4 class="sp-chapter-head" style="margin:0 0 10px;">⚡ Learning Shortcuts</h4>
                <div class="sp-shortcut-grid">
                  <button class="sp-shortcut-tile" style="background:#f3e8ff;" onclick="window.SP.openQuickTab('PLAY')"><span style="font-size:1.3rem;">🎮</span><span>Learning Games</span></button>
                  <button class="sp-shortcut-tile" style="background:#dcfce7;" onclick="window.SP.setView('mock')"><span style="font-size:1.3rem;">📝</span><span>Mock Papers</span></button>
                  <button class="sp-shortcut-tile" style="background:#ffedd5;" onclick="window.SP.setView('progress')"><span style="font-size:1.3rem;">🔄</span><span>Revision</span></button>
                  <button class="sp-shortcut-tile" style="background:#fce7f3;" onclick="window.SP.setView('progress')"><span style="font-size:1.3rem;">💡</span><span>Mistake Notebook</span></button>
                </div>
              </div>

              <div class="sp-card" style="padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <h4 class="sp-chapter-head" style="margin:0;">🏆 Recent Achievements</h4>
                  <button class="sp-btn sp-btn-secondary" style="min-height:28px;padding:0 10px;font-size:11px;" onclick="window.SP.setView('progress')">View All →</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                  <div class="sp-badge-card ${(p.streak || 0) >= 1 ? "" : "locked"}">${renderAchievementBadgeSVG("streak_hero", (p.streak || 0) >= 1, 40)}<span style="font-size:0.72rem;font-weight:700;">Streak</span></div>
                  <div class="sp-badge-card ${completedCount >= 1 ? "" : "locked"}">${renderAchievementBadgeSVG("lesson_starter", completedCount >= 1, 40)}<span style="font-size:0.72rem;font-weight:700;">Lesson Pro</span></div>
                  <div class="sp-badge-card ${xp >= 50 ? "" : "locked"}">${renderAchievementBadgeSVG("quiz_master", xp >= 50, 40)}<span style="font-size:0.72rem;font-weight:700;">Quiz Star</span></div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:grid;gap:16px;">
            ${nextChapter ? `
              <div class="sp-card" style="padding:16px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                  <strong style="font-size:0.95rem;">▶️ Continue Learning</strong>
                  ${renderOpenBookSVG(36)}
                </div>
                <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:var(--bg-muted);margin-bottom:12px;">
                  ${renderSubjectSVG(nextSub?.icon || "maths", 38)}
                  <div style="min-width:0;">
                    <div style="font-weight:800;font-size:0.9rem;">${escapeHTML(nextSub?.name || "Subject")}</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(nextChapter.title)}</div>
                  </div>
                </div>
                <button class="sp-btn sp-btn-primary" style="width:100%;" onclick="window.SP.openChapter('${nextChapter.subjectId}','${nextChapter.id}','LEARN')">Continue Learning →</button>
              </div>
            ` : ""}

            <div class="sp-card" style="padding:16px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <strong style="font-size:0.95rem;">📋 My Tasks</strong>
                <button class="sp-btn sp-btn-secondary" style="min-height:26px;padding:0 8px;font-size:11px;" onclick="window.SP.setView('tasks')">View All →</button>
              </div>
              <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:#fff7ed;color:#7c2d12;margin-bottom:12px;">
                ${renderClipboardSVG(38)}
                <div>
                  <div style="font-weight:800;font-size:0.92rem;">${pendingTasks.length} Task(s) Pending</div>
                  <div style="font-size:0.78rem;">${savedDraft ? "1 Saved Exam Draft" : "Stay on track offline"}</div>
                </div>
              </div>
              <button class="sp-btn sp-btn-primary" style="width:100%;" onclick="${savedDraft ? "window.SP.resumeExamDraft()" : "window.SP.setView('tasks')"}">${savedDraft ? "Resume Saved Exam →" : "View Tasks →"}</button>
            </div>

            <div class="sp-promo-purple">
              <div>
                <div class="sp-chapter-head" style="font-size:1.1rem;line-height:1.2;">Dream Big,<br/>Learn More!</div>
                <div style="font-size:0.78rem;opacity:0.9;margin-top:6px;">You are making excellent progress!</div>
              </div>
              ${renderTrophySVG(64)}
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

async function renderSubjectChapterWorkspace() {
  const cfg = CLASS_CONFIGS[state.profile.classNum] || CLASS_CONFIGS["5"];
  const { subjects, chapters, questions, games } = state.curriculum;
  const sub = subjects.find((s) => s.id === state.selectedSubjectId) || subjects[0];
  if (!sub) {
    return `<div class="sp-container"><div class="sp-card" style="padding:24px;">No subjects available for your class/board/medium yet.</div></div>`;
  }
  const subChapters = chapters.filter((c) => c.subjectId === sub.id);
  const activeChapter = subChapters.find((c) => c.id === state.selectedChapterId) || subChapters[0];
  const chQuestions = activeChapter ? questions.filter((q) => q.chapterId === activeChapter.id) : [];
  const chGames = activeChapter ? games.filter((g) => g.chapterId === activeChapter.id) : [];

  let tabBody = "";
  if (!activeChapter) {
    tabBody = `<div style="padding:24px;text-align:center;color:var(--text-muted);">No published chapters in ${sub.name} yet.</div>`;
  } else if (state.chapterTab === "LEARN") {
    tabBody = await renderLearnChapterHTML(activeChapter, state.profile, state.readerFontSize);
  } else if (state.chapterTab === "PRACTICE") {
    tabBody = await renderPracticeTab(activeChapter, chQuestions);
  } else if (state.chapterTab === "EXERCISE") {
    tabBody = renderExerciseTab(activeChapter);
  } else if (state.chapterTab === "PLAY") {
    tabBody = renderGamesTab(activeChapter, chGames, chQuestions);
  } else if (state.chapterTab === "TEST") {
    tabBody = renderQuickChapterTestTab(sub, activeChapter, chQuestions);
  }

  return `
    <div class="sp-container sp-anim-${cfg.animationIntensity}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 12px;" onclick="window.SP.setView('home')">← Dashboard</button>
        ${subjects.map((s) => `<button class="sp-btn ${s.id === sub.id ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:36px;padding:0 12px;" onclick="window.SP.openSubject('${s.id}')">${s.name}</button>`).join("")}
      </div>

      <div class="sp-action-strip">
        <button class="sp-action-tile ${state.chapterTab === "LEARN" ? "active" : ""}" onclick="window.SP.setChapterTab('LEARN')"><span>📖</span><span>Learn</span></button>
        <button class="sp-action-tile ${state.chapterTab === "PRACTICE" ? "active" : ""}" onclick="window.SP.setChapterTab('PRACTICE')"><span>🎯</span><span>Practice</span></button>
        <button class="sp-action-tile ${state.chapterTab === "EXERCISE" ? "active" : ""}" onclick="window.SP.setChapterTab('EXERCISE')"><span>✏️</span><span>Exercises</span></button>
        <button class="sp-action-tile" onclick="window.SP.openSubjectMock('${sub.id}')"><span>📝</span><span>Mock Papers</span></button>
      </div>

      <div style="display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:16px;align-items:start;" class="sp-workspace-grid">
        <aside class="sp-card" style="padding:14px;">
          <div style="font-weight:800;font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Chapters (${subChapters.length})</div>
          <div style="display:grid;gap:6px;max-height:520px;overflow-y:auto;">
            ${subChapters.map((c) => {
              const isDone = Boolean(state.progressMap[c.id]?.completed);
              const isAct = activeChapter && c.id === activeChapter.id;
              return `
                <button class="sp-btn ${isAct ? "sp-btn-primary" : "sp-btn-secondary"}" style="justify-content:space-between;text-align:left;height:auto;padding:10px 12px;font-size:0.84rem;" onclick="window.SP.openChapter('${sub.id}','${c.id}','${state.chapterTab}')">
                  <span>${c.title}</span>
                  <span>${isDone ? "✅" : ""}</span>
                </button>
              `;
            }).join("")}
          </div>
        </aside>

        <main class="sp-card" style="padding:18px;min-width:0;" data-reading-layout="${cfg.readingLayout}">
          ${activeChapter ? `
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
              <h2 class="sp-chapter-head" style="margin:0;font-size:1.28rem;">${activeChapter.title}</h2>
              ${cfg.allowAudioByDefault ? `<span class="sp-badge" style="background:var(--bg-muted);color:var(--accent-primary);">🔊 Audio Read-Aloud Ready</span>` : ""}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;">
              ${["LEARN", "PRACTICE", "EXERCISE", "PLAY", "TEST"].map((t) => `
                <button class="sp-btn ${state.chapterTab === t ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:36px;padding:0 14px;font-size:0.82rem;" onclick="window.SP.setChapterTab('${t}')">${t}</button>
              `).join("")}
            </div>
          ` : ""}
          ${tabBody}
        </main>
      </div>
    </div>
  `;
}

async function renderPracticeTab(chapter, chQuestions) {
  let pool = chQuestions.slice();
  if (state.practiceState.difficulty !== "ALL") {
    pool = pool.filter((q) => q.difficulty === state.practiceState.difficulty);
  }
  if (state.practiceState.retryOnly) {
    const wrongs = await getStudentWrongAnswers(state.profile.studentId);
    const wrongIds = new Set(wrongs.map((w) => w.questionId));
    pool = pool.filter((q) => wrongIds.has(q.id));
  }

  if (pool.length === 0) {
    return `
      <div style="padding:20px;text-align:center;">
        <p style="color:var(--text-secondary);">Honest Content Availability: No ${state.practiceState.retryOnly ? "incorrect " : ""}questions match this filter yet for <strong>${chapter.title}</strong>.</p>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.resetPracticeFilters()">Show All Chapter Questions</button>
      </div>
    `;
  }

  const idx = state.practiceState.idx % pool.length;
  const q = pool[idx];
  const ps = state.practiceState;

  return `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
        <span class="sp-badge" style="background:var(--bg-muted);color:var(--text-primary);">Question ${idx + 1} of ${pool.length} · ${q.difficulty} · ${q.topic || "Concept"}</span>
        <div style="display:flex;gap:6px;">
          <select class="sp-select" style="width:auto;padding:6px 10px;font-size:12px;" onchange="window.SP.setPracticeDifficulty(this.value)">
            ${["ALL", "Easy", "Medium", "Hard"].map((d) => `<option value="${d}" ${ps.difficulty === d ? "selected" : ""}>${d}</option>`).join("")}
          </select>
          <button class="sp-btn ${ps.retryOnly ? "sp-btn-warm" : "sp-btn-secondary"}" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.togglePracticeRetry()">Retry Incorrect</button>
        </div>
      </div>

      <div style="padding:16px;border-radius:14px;background:var(--bg-muted);font-weight:700;margin-bottom:12px;">${q.q}</div>

      ${(q.options && q.options.length > 0) ? `
        <div style="display:grid;gap:8px;margin-bottom:12px;">
          ${q.options.map((opt) => {
            const isSel = ps.selected === opt;
            const isRight = normalizeAns(opt) === normalizeAns(q.ans);
            let cls = "sp-btn-secondary";
            if (ps.answered) {
              if (isRight) cls = "sp-btn-success";
              else if (isSel) cls = "sp-btn-danger";
            }
            return `<button class="sp-btn ${cls}" style="justify-content:flex-start;text-align:left;" ${ps.answered ? "disabled" : ""} onclick="window.SP.answerPractice('${q.id}','${opt.replace(/'/g, "\\'")}')">${opt}</button>`;
          }).join("")}
        </div>
      ` : `
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input id="practiceTextAns" class="sp-input" placeholder="Type your answer..." ${ps.answered ? "disabled" : ""} value="${ps.selected || ""}" />
          ${!ps.answered ? `<button class="sp-btn sp-btn-primary" onclick="window.SP.answerPractice('${q.id}', document.getElementById('practiceTextAns').value)">Check</button>` : ""}
        </div>
      `}

      ${ps.answered ? `
        <div style="padding:14px;border-radius:14px;background:#f0fdf4;color:#14532d;border:1px solid #86efac;margin-bottom:12px;">
          <strong>Correct Answer:</strong> ${q.ans}
          <div style="margin-top:4px;font-size:0.9rem;">${q.explanation || q.solution || ""}</div>
        </div>
        <button class="sp-btn sp-btn-primary" onclick="window.SP.nextPracticeQuestion()">Next Question →</button>
      ` : ""}

    </div>
  `;
}

function renderExerciseTab(chapter) {
  const exs = chapter.exercises || [];
  if (!exs.length) {
    return `<div style="padding:20px;text-align:center;color:var(--text-muted);">No textbook exercises added for this chapter yet.</div>`;
  }
  return `
    <div style="display:grid;gap:14px;">
      ${exs.map((ex, i) => `
        <div class="sp-card" style="padding:16px;background:var(--bg-muted);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span class="sp-badge" style="background:var(--accent-primary);color:#fff;">Q ${ex.qNo || i + 1}</span>
            <span class="sp-badge" style="background:var(--bg-card);color:var(--text-secondary);">${ex.marks || 1} Mark(s)</span>
          </div>
          <div style="font-weight:700;margin-bottom:10px;">${ex.q}</div>
          <textarea id="exAttempt_${chapter.id}_${i}" class="sp-textarea" rows="2" placeholder="Write your working or answer here before checking solution..."></textarea>
          <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
            ${ex.hint ? `<button class="sp-btn sp-btn-secondary" style="min-height:34px;font-size:12px;" onclick="document.getElementById('exHint_${i}').style.display='block'">💡 Hint</button>` : ""}
            <button class="sp-btn sp-btn-primary" style="min-height:34px;font-size:12px;" onclick="document.getElementById('exSol_${i}').style.display='block'">✓ Show Step-by-Step Solution</button>
          </div>
          <div id="exHint_${i}" style="display:none;margin-top:8px;padding:10px;border-radius:10px;background:#fefce8;color:#713f12;font-size:0.88rem;"><strong>Hint:</strong> ${ex.hint || ""}</div>
          <div id="exSol_${i}" style="display:none;margin-top:8px;padding:12px;border-radius:10px;background:#ecfdf5;color:#065f46;font-size:0.9rem;">
            <strong>Answer:</strong> ${ex.ans}
            <pre style="margin:6px 0 0;white-space:pre-wrap;font-family:inherit;">${ex.steps || ""}</pre>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGamesTab(chapter, chGames, chQuestions) {
  const gs = state.gameState;
  const classNum = Number(state.profile.classNum);

  // Classes 1-4: Interactive Topic-Learning Games to teach kids in depth & easy way
  if (classNum < 5) {
    const defaultType = (chapter.subjectId === "maths" && classNum <= 1 && chapter.sequence === 1) ? "count_shapes" : "chapter_quiz_game";
    const game = gs.activeGame || (chGames.length ? chGames[0] : {
      id: `auto-game-${chapter.id}`,
      chapterId: chapter.id,
      title: `${chapter.title} — Learn & Play`,
      gameType: defaultType,
      instructions: "Learn the topic step by step by playing this interactive activity!",
      rewardCoins: 15
    });
    if (!gs.round || gs.activeGame?.id !== game.id || gs.activeGame?.chapterId !== chapter.id) {
      gs.activeGame = game;
      gs.round = generateGameRound(game.gameType, gs.level, chapter, chQuestions);
    }
    const r = gs.round;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <div>
            <h3 class="sp-chapter-head" style="margin:0;">🎮 ${game.title}</h3>
            <div style="font-size:0.85rem;color:var(--text-muted);">${game.instructions}</div>
          </div>
          <span class="sp-badge" style="background:#fef3c7;color:#92400e;">Level ${gs.level}/3 · Score: ${gs.score}</span>
        </div>
        ${r.visual || ""}
        <div style="font-weight:800;font-size:1.05rem;margin:14px 0;">${r.prompt}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;">
          ${r.options.map((opt) => `<button class="sp-btn sp-btn-secondary" onclick="window.SP.playGameAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>`).join("")}
        </div>
        ${gs.feedback ? `<div style="margin-top:12px;font-weight:700;">${gs.feedback}</div>` : ""}
      </div>
    `;
  }

  // Classes 5-10: Small Questions & Definitions (Playcards + Match the Column + Definitions)
  const cards = generatePlaycardsForChapter(chapter, chQuestions);
  if (!gs.matchData || gs.matchData.chapterId !== chapter.id) gs.matchData = generateMatchColumnForChapter(chapter, chQuestions);

  let modeHTML = "";
  if (gs.mode === "playcard") {
    const idx = gs.cardIdx % cards.length;
    const card = cards[idx];
    modeHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span class="sp-badge" style="background:var(--bg-muted);">Small Question / Definition ${idx + 1} of ${cards.length} · ${card.tag}</span>
          <span style="font-size:0.8rem;color:var(--text-muted);">Tap card to flip</span>
        </div>
        <div onclick="window.SP.flipPlaycard()" style="cursor:pointer;padding:28px 20px;border-radius:18px;border:2px solid var(--accent-primary);background:${gs.flipped ? "#ecfdf5" : "var(--bg-muted)"};color:${gs.flipped ? "#065f46" : "var(--text-primary)"};text-align:center;min-height:140px;display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <div style="font-size:0.75rem;font-weight:800;text-transform:uppercase;opacity:0.7;">${gs.flipped ? "Definition / Answer" : "Term / Small Question"}</div>
          <div style="font-size:1.05rem;font-weight:800;">${gs.flipped ? card.back : card.front}</div>
        </div>
        <div style="display:flex;gap:10px;margin-top:12px;justify-content:center;">
          <button class="sp-btn sp-btn-secondary" onclick="window.SP.flipPlaycard()">🔄 Flip Card</button>
          <button class="sp-btn sp-btn-primary" onclick="window.SP.nextPlaycard()">Next Card →</button>
        </div>
      </div>
    `;
  } else {
    const { pairs, rightOptions } = gs.matchData;
    const allDone = gs.matchedIds.length === pairs.length && pairs.length > 0;
    modeHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span class="sp-badge" style="background:#dbeafe;color:#1e40af;">Match Definitions & Answers (${gs.matchedIds.length}/${pairs.length})</span>
          <button class="sp-btn sp-btn-secondary" style="min-height:32px;font-size:12px;" onclick="window.SP.resetMatchGame()">↻ Reset</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="display:grid;gap:8px;">
            <div style="font-size:0.78rem;font-weight:800;color:var(--text-muted);">COLUMN A</div>
            ${pairs.map((p) => {
              const matched = gs.matchedIds.includes(p.id);
              const sel = gs.matchLeft === p.id;
              return `<button class="sp-btn ${matched ? "sp-btn-success" : sel ? "sp-btn-primary" : "sp-btn-secondary"}" style="justify-content:flex-start;text-align:left;height:auto;padding:10px;" ${matched ? "disabled" : ""} onclick="window.SP.pickMatchLeft('${p.id}')">${p.left}</button>`;
            }).join("")}
          </div>
          <div style="display:grid;gap:8px;">
            <div style="font-size:0.78rem;font-weight:800;color:var(--text-muted);">COLUMN B</div>
            ${rightOptions.map((r) => {
              const matched = gs.matchedIds.includes(r.id);
              return `<button class="sp-btn ${matched ? "sp-btn-success" : "sp-btn-secondary"}" style="justify-content:flex-start;text-align:left;height:auto;padding:10px;" ${matched ? "disabled" : ""} onclick="window.SP.pickMatchRight('${r.id}')">${r.text}</button>`;
            }).join("")}
          </div>
        </div>
        ${gs.matchFeedback ? `<div style="margin-top:10px;font-weight:700;">${gs.matchFeedback}</div>` : ""}
        ${allDone ? `<div style="margin-top:10px;padding:10px;border-radius:12px;background:#d1fae5;color:#065f46;font-weight:800;">🎉 All pairs matched! +15 XP earned!</div>` : ""}
      </div>
    `;
  }

  return `
    <div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
        <button class="sp-btn ${gs.mode === "playcard" ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:36px;font-size:12px;" onclick="window.SP.setPlayMode('playcard')">🃏 Small Questions & Definitions</button>
        <button class="sp-btn ${gs.mode === "match" ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:36px;font-size:12px;" onclick="window.SP.setPlayMode('match')">🔗 Match the Column</button>
      </div>
      ${modeHTML}
    </div>
  `;
}

function renderQuickChapterTestTab(sub, chapter, chQuestions) {
  const testQs = chQuestions;
  const qt = state.quickTest;
  let score = 0;
  if (qt.submitted) {
    for (const q of testQs) {
      if (normalizeAns(qt.answers[q.id]) === normalizeAns(q.ans)) score++;
    }
  }
  return `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <h3 style="margin:0;">📝 Whole Chapter Test (${testQs.length} Questions)</h3>
          <div style="font-size:0.84rem;color:var(--text-muted);">Total questions in ${chapter.title}: ${chQuestions.length}</div>
        </div>
        <button class="sp-btn sp-btn-secondary" style="min-height:36px;font-size:12px;" onclick="window.SP.startChapterTest('${sub.id}','${chapter.id}')">⏱ Timed Full Chapter Test</button>
      </div>
      ${testQs.length === 0 ? `<p style="color:var(--text-muted);">No test questions available for this chapter yet.</p>` : `
        <div style="display:grid;gap:12px;">
          ${testQs.map((q, i) => {
            const given = qt.answers[q.id] || "";
            const isRight = normalizeAns(given) === normalizeAns(q.ans);
            return `
              <div style="padding:14px;border-radius:14px;background:var(--bg-muted);">
                <div style="font-weight:700;margin-bottom:8px;">Q${i + 1}. ${q.q}</div>
                ${(q.options && q.options.length > 0) ? `
                  <div style="display:grid;gap:6px;">
                    ${q.options.map((opt) => `
                      <button class="sp-btn ${given === opt ? "sp-btn-primary" : "sp-btn-secondary"}" style="justify-content:flex-start;min-height:38px;" ${qt.submitted ? "disabled" : ""} onclick="window.SP.setQuickTestAns('${q.id}','${opt.replace(/'/g, "\\'")}')">${opt}</button>
                    `).join("")}
                  </div>
                ` : `<input class="sp-input" placeholder="Type answer..." ${qt.submitted ? "disabled" : ""} value="${given}" oninput="window.SP.setQuickTestAns('${q.id}', this.value)" />`}
                ${qt.submitted ? `<div style="margin-top:8px;font-size:0.86rem;font-weight:700;color:${isRight ? "#059669" : "#dc2626"};">${isRight ? "✅ Correct!" : `❌ Correct Answer: ${q.ans}`} — ${q.explanation || ""}</div>` : ""}
              </div>
            `;
          }).join("")}
        </div>
        <div style="margin-top:14px;display:flex;gap:10px;align-items:center;">
          ${!qt.submitted
            ? `<button class="sp-btn sp-btn-success" onclick="window.SP.submitQuickTest()">✓ Submit Chapter Test</button>`
            : `<span class="sp-badge" style="background:#dbeafe;color:#1e40af;font-size:0.9rem;">Score: ${score} / ${testQs.length}</span><button class="sp-btn sp-btn-secondary" onclick="window.SP.resetQuickTest()">↻ Retry Test</button>`}
        </div>
      `}
    </div>
  `;
}

async function renderBooksManager() {
  const { books, chapters } = state.curriculum;
  const storageInfo = await getStorageUsageSummary();
  const items = await Promise.all(books.map(async (b) => {
    const bookChs = chapters.filter((c) => c.bookId === b.id);
    const st = await getBookOfflineStatus(b, bookChs);
    return { b, st, chCount: bookChs.length };
  }));
  return `
    <div class="sp-container">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <h2 style="margin:0;">📥 My Textbooks & Offline Storage</h2>
          <div style="font-size:0.82rem;color:var(--text-muted);">${storageInfo.supported ? `Local Storage Used: ${storageInfo.usageKB} KB of ${storageInfo.quotaMB} MB` : "Offline structured textbooks stored locally in IndexedDB"}</div>
        </div>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">← Dashboard</button>
      </div>
      <div class="sp-grid-auto">
        ${items.map(({ b, st, chCount }) => `
          <div class="sp-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
            <div style="display:flex;gap:12px;align-items:center;">
              ${renderSubjectSVG(b.subjectIcon, 48)}
              <div>
                <div style="font-weight:800;">${escapeHTML(b.title)}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHTML(b.publisher)} · ${chCount} Chapter(s)</div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
              <span class="sp-badge" style="background:${st.isAvailable ? "#d1fae5" : "#f1f5f9"};color:${st.isAvailable ? "#065f46" : "#475569"};">${escapeHTML(st.label)}</span>
              <div style="display:flex;gap:6px;">
                <button class="sp-btn sp-btn-primary" style="min-height:34px;padding:0 12px;font-size:12px;" onclick="window.SP.openSubject('${b.subjectId}')">Read Book</button>
                <button class="sp-btn ${st.status === "Downloaded" ? "sp-btn-secondary" : "sp-btn-success"}" style="min-height:34px;padding:0 12px;font-size:12px;" onclick="window.SP.toggleOfflineBook('${b.id}')">${st.status === "Downloaded" ? "Remove Pack" : "Save Pack"}</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

async function renderMockExamView() {
  const { subjects, chapters, questions } = state.curriculum;
  const es = state.examState;
  const draft = !es.paper ? await loadExamDraft(state.profile.studentId) : null;

  if (es.lastResult) {
    const r = es.lastResult;
    return `
      <div class="sp-container">
        <div class="sp-card" style="padding:24px;">
          <h2 style="margin-top:0;">📊 Examination Result — ${r.title}</h2>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
            <span class="sp-badge" style="background:#dbeafe;color:#1e40af;font-size:0.9rem;">Objective Score: ${r.earnedObjectiveMarks} / ${r.objectiveMarks}</span>
            <span class="sp-badge" style="background:${r.evaluationStatus === "evaluated" ? "#d1fae5" : "#fef3c7"};color:${r.evaluationStatus === "evaluated" ? "#065f46" : "#92400e"};font-size:0.9rem;">
              ${r.evaluationStatus === "evaluated" ? "Evaluated" : `Pending Teacher Review (${r.descriptiveCount} descriptive Qs)`}
            </span>
          </div>
          ${r.weakTopics.length ? `
            <div style="padding:12px;border-radius:12px;background:#fef2f2;color:#991b1b;margin-bottom:16px;">
              <strong>Weak Topics for Revision:</strong> ${r.weakTopics.map((w) => `${w.topic} (${w.wrong} wrong)`).join(", ")}
            </div>
          ` : `<div style="padding:12px;border-radius:12px;background:#ecfdf5;color:#065f46;margin-bottom:16px;">Great accuracy! No weak topics flagged.</div>`}
          <div style="display:grid;gap:10px;">
            ${r.breakdown.map((b, i) => `
              <div style="padding:12px;border-radius:12px;border:1px solid var(--border-subtle);">
                <div style="font-weight:700;">Q${i + 1}. ${b.q.q}</div>
                <div style="font-size:0.86rem;margin-top:4px;">Your Answer: <strong>${b.given || "(Blank)"}</strong> · Correct: <strong style="color:#059669;">${b.q.ans}</strong></div>
                <div style="font-size:0.84rem;color:var(--text-secondary);margin-top:4px;">${b.q.explanation || b.q.solution || ""}</div>
              </div>
            `).join("")}
          </div>
          <div style="margin-top:16px;display:flex;gap:10px;">
            <button class="sp-btn sp-btn-primary" onclick="window.SP.clearLastExamResult()">Take Another Exam</button>
            <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">Back to Dashboard</button>
          </div>
        </div>
      </div>
    `;
  }

  if (es.paper) {
    const q = es.paper.questions[es.currentIdx];
    const mins = Math.floor(es.secondsLeft / 60);
    const secs = String(es.secondsLeft % 60).padStart(2, "0");
    return `
      <div class="sp-container">
        <div class="sp-card" style="padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;margin-bottom:14px;">
            <div><strong>${es.paper.title}</strong> · Q ${es.currentIdx + 1}/${es.paper.actualCount}</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <span class="sp-badge" style="background:#fee2e2;color:#991b1b;">⏱ ${mins}:${secs}</span>
              <button class="sp-btn sp-btn-secondary" style="min-height:34px;font-size:12px;" onclick="window.SP.saveCurrentExamDraft()">💾 Save & Pause</button>
              <button class="sp-btn sp-btn-success" style="min-height:34px;font-size:12px;" onclick="window.SP.submitActiveExam()">Submit Exam</button>
            </div>
          </div>

          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;">
            ${es.paper.questions.map((pq, i) => `
              <button class="sp-btn ${i === es.currentIdx ? "sp-btn-primary" : es.answers[pq.id] ? "sp-btn-success" : "sp-btn-secondary"}" style="min-height:32px;width:36px;padding:0;font-size:12px;" onclick="window.SP.jumpExamQ(${i})">${i + 1}</button>
            `).join("")}
          </div>

          <div style="padding:16px;border-radius:14px;background:var(--bg-muted);font-weight:700;margin-bottom:14px;">
            <span class="sp-badge" style="background:var(--bg-card);margin-right:6px;">${q.type} · ${q.marks || 1}M</span> ${q.q}
          </div>

          ${(q.options && q.options.length > 0) ? `
            <div style="display:grid;gap:8px;">
              ${q.options.map((opt) => `
                <button class="sp-btn ${es.answers[q.id] === opt ? "sp-btn-primary" : "sp-btn-secondary"}" style="justify-content:flex-start;" onclick="window.SP.setExamAnswer('${q.id}','${opt.replace(/'/g, "\\'")}')">${opt}</button>
              `).join("")}
            </div>
          ` : `
            <textarea class="sp-textarea" rows="3" placeholder="Write your answer..." oninput="window.SP.setExamAnswer('${q.id}', this.value)">${es.answers[q.id] || ""}</textarea>
          `}

          <div style="display:flex;justify-content:space-between;margin-top:16px;">
            <button class="sp-btn sp-btn-secondary" ${es.currentIdx === 0 ? "disabled" : ""} onclick="window.SP.jumpExamQ(${es.currentIdx - 1})">← Previous</button>
            <button class="sp-btn sp-btn-primary" ${es.currentIdx >= es.paper.actualCount - 1 ? "disabled" : ""} onclick="window.SP.jumpExamQ(${es.currentIdx + 1})">Next →</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="sp-container">
      <div class="sp-card" style="padding:22px;max-width:640px;margin:0 auto;">
        <h2 style="margin-top:0;">📝 Mock Papers & Examinations (Class ${state.profile.classNum})</h2>
        <p style="color:var(--text-secondary);font-size:0.9rem;">Available verified questions in your class bank: <strong>${questions.length}</strong></p>
        ${(() => {
          const allAs = window.SP._cachedAssessments || [];
          const mine = allAs.filter(a => a.classNum === state.profile.classNum && a.board === state.profile.board && a.medium === state.profile.medium);
          if (!mine.length) return "";
          return `<div style="margin-bottom:14px;padding:12px;border-radius:12px;background:#eff6ff;">
            <strong style="display:block;margin-bottom:8px;">📄 Teacher-Assigned Exam Papers</strong>
            <div style="display:grid;gap:8px;">
              ${mine.map(a => `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><span><strong>${a.title}</strong> (${a.questions.length} Qs · ${Math.round(a.durationSec/60)} min)</span><button class="sp-btn sp-btn-primary" style="min-height:34px;font-size:12px;" onclick="window.SP.launchTeacherExamPaper('${a.id}')">Start</button></div>`).join("")}
            </div>
          </div>`;
        })()}
        ${draft ? `<div style="padding:12px;border-radius:12px;background:#fef3c7;color:#92400e;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;"><span>Saved exam in progress!</span><button class="sp-btn sp-btn-warm" style="min-height:34px;" onclick="window.SP.resumeExamDraft()">Resume</button></div>` : ""}
        <form onsubmit="window.SP.launchMockExam(event)" style="display:grid;gap:12px;">
          <div>
            <label style="font-size:12px;font-weight:700;">Subject</label>
            <select id="mockSub" class="sp-select"><option value="ALL">All Subjects (${questions.length} Qs)</option>${subjects.map((s) => `<option value="${s.id}" ${s.id === state.selectedSubjectId ? "selected" : ""}>${s.name}</option>`).join("")}</select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;">Examination Template</label>
            <select id="mockTpl" class="sp-select">${Object.values(EXAM_TEMPLATES).map((t) => `<option value="${t.id}" ${t.id === "mock_20" ? "selected" : ""}>${t.label}</option>`).join("")}</select>
          </div>
          <div>
            <label style="font-size:12px;font-weight:700;">Difficulty</label>
            <select id="mockDiff" class="sp-select"><option value="ALL">Mixed (Board Pattern)</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
          </div>
          <button type="submit" class="sp-btn sp-btn-primary">🚀 Start Mock Examination</button>
        </form>
      </div>
    </div>
  `;
}

async function renderProgressAndProfile() {
  const p = state.profile;
  const [attempts, wrongs, bookmarks] = await Promise.all([
    getStudentAttempts(p.studentId),
    getStudentWrongAnswers(p.studentId),
    getStudentBookmarks(p.studentId)
  ]);
  const completedChs = Object.values(state.progressMap).filter((x) => x.completed).length;

  return `
    <div class="sp-container">
      <div style="display:grid;gap:16px;">
        <div class="sp-card" style="padding:20px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px;">
          <div style="display:flex;gap:14px;align-items:center;">
            ${renderAvatarSVG(p.avatar, 64)}
            <div>
              <h2 style="margin:0;">${p.name}</h2>
              <div style="font-size:0.85rem;color:var(--text-muted);">ID: <code>${p.studentId}</code> · Class ${p.classNum} · ${BOARDS[p.board]?.name} · ${MEDIUMS[p.medium]?.name}</div>
              <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
                <span class="sp-badge" style="background:#dbeafe;color:#1e40af;">⭐ ${p.xp || 0} XP</span>
                <span class="sp-badge" style="background:#fef3c7;color:#92400e;">🪙 ${p.coins || 0} Coins</span>
                <span class="sp-badge" style="background:#d1fae5;color:#065f46;">✓ ${completedChs} Chapters Done</span>
              </div>
            </div>
          </div>
          <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">← Dashboard</button>
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 class="sp-chapter-head" style="margin-top:0;">🏅 Achievement Badges</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:10px;">
            ${[
              { id: "welcome_scholar", name: "Welcome Scholar", ok: true },
              { id: "lesson_starter", name: "First Lesson Done", ok: completedChs >= 1 },
              { id: "streak_hero", name: "3-Day Streak", ok: (p.streak || 1) >= 3 },
              { id: "quiz_master", name: "Exam Explorer", ok: attempts.length >= 1 },
              { id: "book_explorer", name: "Bookmarker", ok: bookmarks.length >= 1 }
            ].map(b => `
              <div class="sp-badge-card ${b.ok ? "" : "locked"}">
                ${renderAchievementBadgeSVG(b.id, b.ok, 46)}
                <div style="font-size:0.78rem;font-weight:700;">${b.name}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 class="sp-chapter-head" style="margin-top:0;">📅 Revision Schedule</h3>
          ${await (async () => {
            const revs = await getStudentRevisions(p.studentId);
            if (!revs.length) return `<p style="color:var(--text-muted);">No pending revisions scheduled.</p>`;
            const today = getLocalDateKey();
            return revs.map(rv => {
              const st = rv.status === "completed" ? "Completed" : rv.revisionDate < today ? "Overdue" : rv.revisionDate === today ? "Revise Today" : "Upcoming";
              return `<div style="padding:10px;border-radius:10px;background:var(--bg-muted);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <div><span class="sp-badge" style="background:var(--bg-card);">${st}</span> <strong style="margin-left:6px;">${escapeHTML(rv.title)}</strong></div>
                ${rv.status !== "completed" ? `<button class="sp-btn sp-btn-success" style="min-height:30px;font-size:12px;" onclick="window.SP.markRevisionDone('${rv.revisionId}')">✓ Revised</button>` : ""}
              </div>`;
            }).join("");
          })()}
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 class="sp-chapter-head" style="margin-top:0;">🪙 Reward Transaction Audit</h3>
          ${await (async () => {
            const txs = await getStudentRewardTransactions(p.studentId);
            if (!txs.length) return `<p style="color:var(--text-muted);">No reward transactions yet. Complete a lesson, practice, or test to earn XP!</p>`;
            return txs.slice(-10).reverse().map(t => `<div style="padding:8px 12px;border-radius:10px;background:var(--bg-muted);margin-bottom:6px;display:flex;justify-content:space-between;font-size:0.84rem;"><span><strong>${escapeHTML(t.activityType)}</strong> — ${escapeHTML(t.note)}</span><span>+${t.xpEarned} XP · +${t.coinsEarned} 🪙</span></div>`).join("");
          })()}
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 style="margin-top:0;">📈 Exam, Test & Game History (${attempts.length})</h3>
          ${attempts.length === 0 ? `<p style="color:var(--text-muted);">No exams or games completed yet.</p>` : `
            <div style="display:grid;gap:8px;">
              ${attempts.slice(-8).reverse().map((a) => `
                <div style="padding:10px 14px;border-radius:12px;background:var(--bg-muted);display:flex;justify-content:space-between;align-items:center;">
                  <span><strong>${a.title || a.type}</strong> · ${a.createdAt.slice(0, 10)}</span>
                  <span class="sp-badge" style="background:var(--bg-card);">${a.type === "mock_exam" ? `${a.earnedObjectiveMarks}/${a.objectiveMarks} (${a.evaluationStatus})` : `Score: ${a.score}/${a.total}`}</span>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 style="margin-top:0;">💡 Revision & Mistake Notebook (${wrongs.length})</h3>
          ${wrongs.length === 0 ? `<p style="color:var(--text-muted);">No mistakes recorded! Keep practicing.</p>` : `
            <div style="display:grid;gap:8px;">
              ${wrongs.map((w) => `
                <div style="padding:12px;border-radius:12px;background:#fef2f2;color:#7f1d1d;">
                  <div style="font-weight:700;">${w.q}</div>
                  <div style="font-size:0.85rem;margin-top:4px;">Your Answer: ${w.givenAns} · <strong>Correct: ${w.correctAns}</strong></div>
                  <div style="font-size:0.82rem;margin-top:2px;">${w.explanation}</div>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <div class="sp-card" style="padding:18px;">
          <h3 style="margin-top:0;">★ Bookmarked Chapters (${bookmarks.length})</h3>
          ${bookmarks.length === 0 ? `<p style="color:var(--text-muted);">No bookmarks yet.</p>` : bookmarks.map((b) => `<div style="padding:6px 0;">★ ${b.title}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
}


async function renderTasksView() {
  const p = state.profile;
  const all = await dbGetAll("assignments");
  const mine = all.filter(a => a.classNum === p.classNum && a.board === p.board && a.medium === p.medium && a.session === (p.session || "2026-27"));
  const today = getLocalDateKey();
  return `
    <div class="sp-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 class="sp-chapter-head" style="margin:0;">📋 My Tasks & Homework</h2>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">← Dashboard</button>
      </div>
      ${mine.length === 0 ? `<div class="sp-card" style="padding:24px;text-align:center;color:var(--text-muted);">No assignments assigned for Class ${p.classNum} yet.</div>` : `
        <div style="display:grid;gap:12px;">
          ${mine.map(a => {
            const done = Boolean(a.completedBy && a.completedBy[p.studentId]);
            const overdue = !done && a.dueDate && a.dueDate < today;
            const badge = done ? "Completed" : overdue ? "Overdue" : "Pending";
            const bg = done ? "#d1fae5" : overdue ? "#fee2e2" : "#fef3c7";
            const col = done ? "#065f46" : overdue ? "#991b1b" : "#92400e";
            return `
              <div class="sp-card" style="padding:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                <div>
                  <span class="sp-badge" style="background:${bg};color:${col};">${badge}</span>
                  <h3 style="margin:6px 0 4px;">${escapeHTML(a.title)}</h3>
                  <div style="font-size:0.86rem;color:var(--text-secondary);">${escapeHTML(a.description)}</div>
                  <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px;">Due: ${escapeHTML(a.dueDate)}</div>
                </div>
                ${!done ? `<button class="sp-btn sp-btn-success" onclick="window.SP.completeAssignment('${a.assignmentId}')">✓ Mark Complete</button>` : ""}
              </div>
            `;
          }).join("")}
        </div>
      `}
    </div>
  `;
}

async function renderSearchView() {
  const q = (state.searchQuery || "").trim().toLowerCase();
  const { subjects, chapters, questions } = state.curriculum;
  const chHits = q ? chapters.filter(c => c.title.toLowerCase().includes(q) || (c.explanation || "").toLowerCase().includes(q)).slice(0, 15) : [];
  const qHits = q ? questions.filter(x => x.q.toLowerCase().includes(q)).slice(0, 15) : [];
  return `
    <div class="sp-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 class="sp-chapter-head" style="margin:0;">🔍 Search My Class Curriculum</h2>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">← Dashboard</button>
      </div>
      <div class="sp-card" style="padding:16px;margin-bottom:16px;">
        <input id="globalSearchInput" class="sp-input" value="${escapeHTML(state.searchQuery)}" placeholder="Search chapters, topics, or questions in Class ${state.profile.classNum}..." oninput="window.SP.runGlobalSearch(this.value)" />
      </div>
      ${q ? `
        <div style="display:grid;gap:14px;">
          <div class="sp-card" style="padding:16px;">
            <h3 style="margin-top:0;">Chapters (${chHits.length})</h3>
            ${chHits.length === 0 ? `<p style="color:var(--text-muted);">No matching chapters.</p>` : chHits.map(c => `
              <div style="padding:8px 0;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
                <span><strong>${escapeHTML(c.title)}</strong></span>
                <button class="sp-btn sp-btn-primary" style="min-height:32px;font-size:12px;" onclick="window.SP.openChapter('${c.subjectId}','${c.id}','LEARN')">Open</button>
              </div>
            `).join("")}
          </div>
          <div class="sp-card" style="padding:16px;">
            <h3 style="margin-top:0;">Questions (${qHits.length})</h3>
            ${qHits.length === 0 ? `<p style="color:var(--text-muted);">No matching questions.</p>` : qHits.map(x => `
              <div style="padding:8px 0;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;gap:10px;">
                <span>${escapeHTML(x.q)}</span>
                <button class="sp-btn sp-btn-secondary" style="min-height:32px;font-size:12px;" onclick="window.SP.openChapter('${x.subjectId}','${x.chapterId}','PRACTICE')">Practice</button>
              </div>
            `).join("")}
          </div>
        </div>
      ` : `<div class="sp-card" style="padding:20px;color:var(--text-muted);text-align:center;">Type a keyword to search across your ${subjects.length} subjects and ${chapters.length} chapters offline.</div>`}
    </div>
  `;
}

function renderMobileBottomNav() {
  const items = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "learn", icon: "📚", label: "Learn" },
    { id: "practice", icon: "🎯", label: "Practice" },
    { id: "games", icon: "🎮", label: "Games" },
    { id: "profile", icon: "👤", label: "Profile" }
  ];
  return `
    <nav class="sp-bottom-nav no-print">
      ${items.map((it) => `
        <button onclick="window.SP.navMobile('${it.id}')" style="border:none;background:transparent;display:flex;flex-direction:column;align-items:center;font-size:11px;font-weight:${state.view === it.id ? "800" : "500"};color:${state.view === it.id ? "var(--accent-primary)" : "var(--text-muted)"};cursor:pointer;">
          <span style="font-size:18px;">${it.icon}</span><span>${it.label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

// Public Global API for DOM Event Handlers
window.SP = {
  setAuthTab: (t) => { state.authTab = t; render(); },
  setView: (v) => { state.view = v; render(); },
  goHome: () => { if (state.session?.role === "student") { state.view = "home"; render(); } },
  navMobile: (id) => {
    if (id === "practice") { state.chapterTab = "PRACTICE"; state.view = "learn"; }
    else if (id === "games") { state.chapterTab = "PLAY"; state.view = "learn"; }
    else state.view = id;
    render();
  },
  toggleDark: () => {
    state.darkMode = !state.darkMode;
    localStorage.setItem("sp_theme", state.darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", state.darkMode);
    render();
  },
  logout: () => {
    clearInterval(state.examState.timerId);
    stopChapterSpeech();
    logoutSession();
    state.session = null;
    state.profile = null;
    state.teacherProfile = null;
    state.curriculum = null;
    state.selectedSubjectId = null;
    state.selectedChapterId = null;
    state.examState = { paper: null, answers: {}, currentIdx: 0, secondsLeft: 0, timerId: null, lastResult: null };
    render();
  },
  handleStudentLogin: async (e) => {
    e.preventDefault();
    try {
      const id = document.getElementById("loginIdentifier").value;
      const sec = document.getElementById("loginSecret").value;
      const { session, profile } = await loginStudent(id, sec);
      state.session = session;
      state.profile = profile;
      state.selectedSubjectId = null;
      state.selectedChapterId = null;
      state.view = "home";
      await loadStudentContext();
      showToast(`Welcome back, ${profile.name}!`, "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  handleStudentRegister: async (e) => {
    e.preventDefault();
    try {
      const { profile } = await registerStudent({
        name: document.getElementById("regName").value,
        username: document.getElementById("regUsername").value,
        pinOrPassword: document.getElementById("regPin").value,
        classNum: document.getElementById("regClass").value,
        board: document.getElementById("regBoard").value,
        medium: document.getElementById("regMedium").value,
        session: document.getElementById("regSession").value,
        avatar: document.getElementById("regAvatar").value,
        schoolName: document.getElementById("regSchool").value
      });
      const { session } = await loginStudent(profile.username, document.getElementById("regPin").value);
      state.session = session;
      state.profile = profile;
      state.selectedSubjectId = null;
      state.selectedChapterId = null;
      state.view = "home";
      await loadStudentContext();
      showToast(`Account created! Your Student ID is ${profile.studentId}`, "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  handleTeacherSetup: async (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById("tchrSetupName").value;
      const username = document.getElementById("tchrSetupUser").value;
      const pin = document.getElementById("tchrSetupPin").value;
      await setupTeacherAccount({ name, username, pinOrPassword: pin });
      const { session, profile } = await loginTeacher(username, pin);
      state.session = session;
      state.teacherProfile = profile;
      state.view = "cms";
      showToast("Teacher CMS initialized!", "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  handleTeacherLogin: async (e) => {
    e.preventDefault();
    try {
      const { session, profile } = await loginTeacher(
        document.getElementById("tchrLoginUser").value,
        document.getElementById("tchrLoginPin").value
      );
      state.session = session;
      state.teacherProfile = profile;
      state.view = "cms";
      showToast("Teacher CMS unlocked!", "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  openSubjectMock: (subId) => { state.selectedSubjectId = subId; state.view = "mock"; render(); },
  openSubject: (subId) => {
    state.selectedSubjectId = subId;
    state.gameState = { mode: "playcard", cardIdx: 0, flipped: false, matchData: null, matchLeft: null, matchedIds: [], matchFeedback: "", activeGame: null, level: 1, score: 0, round: null, feedback: "" };
    const chs = state.curriculum.chapters.filter((c) => c.subjectId === subId);
    state.selectedChapterId = chs[0]?.id || null;
    state.chapterTab = "LEARN";
    state.view = "learn";
    render();
  },
  openChapter: (subId, chId, tab = "LEARN") => {
    state.selectedSubjectId = subId;
    state.selectedChapterId = chId;
    state.chapterTab = tab;
    state.practiceState = { idx: 0, answered: false, selected: "", difficulty: "ALL", retryOnly: false };
    state.gameState = { mode: "playcard", cardIdx: 0, flipped: false, matchData: null, matchLeft: null, matchedIds: [], matchFeedback: "", activeGame: null, level: 1, score: 0, round: null, feedback: "" };
    state.quickTest = { answers: {}, submitted: false, startTime: Date.now() };
    state.view = "learn";
    render();
  },
  openQuickTab: (tab) => {
    state.chapterTab = tab;
    state.view = "learn";
    render();
  },
  setChapterTab: (tab) => {
    stopChapterSpeech();
    state.chapterTab = tab;
    state.practiceState.answered = false;
    state.practiceState.selected = "";
    render();
  },
  changeReaderFont: (delta) => {
    state.readerFontSize = Math.max(13, Math.min(24, state.readerFontSize + delta * 2));
    render();
  },
  readChapterAloud: (chId) => {
    const ch = state.curriculum.chapters.find((c) => c.id === chId);
    if (!ch) return;
    const ok = speakChapterText(`${ch.title}. ${ch.intro}. ${ch.explanation}`, state.profile.medium);
    showToast(ok ? "Reading chapter aloud..." : "Audio narration not supported on this browser.");
  },
  toggleChapterBookmark: async (chId) => {
    const ch = state.curriculum.chapters.find((c) => c.id === chId);
    if (!ch) return;
    const added = await toggleBookmark(state.profile.studentId, ch);
    showToast(added ? "Chapter bookmarked!" : "Bookmark removed.");
    render();
  },
  highlightSelection: async (chId) => {
    const sel = window.getSelection()?.toString().trim();
    if (!sel) return showToast("Select some text in the lesson first, then click Highlight.", "info");
    await addHighlight(state.profile.studentId, chId, sel);
    showToast("Highlighted and saved to your account!", "success");
    render();
  },
  markLessonComplete: async (chId) => {
    const ch = state.curriculum.chapters.find((c) => c.id === chId);
    if (!ch) return;
    const progressId = `${state.profile.studentId}::${chId}`;
    const existing = state.progressMap[chId];
    if (!existing || !existing.completed) {
      const rec = { progressId, studentId: state.profile.studentId, chapterId: chId, subjectId: ch.subjectId, completed: true, completedAt: new Date().toISOString() };
      await dbPut("studentProgress", rec);
      state.progressMap[chId] = rec;
      const rw = await awardActivityReward(state.profile, {
        activityType: "Lesson Completion",
        subjectId: ch.subjectId,
        chapterId: chId,
        xp: 20,
        coins: 10,
        idempotencyKey: `lesson::${progressId}`,
        note: `Completed ${ch.title}`
      });
      await recordLocalActivity(state.profile.studentId, "lesson_complete", rec, progressId);
      showToast(rw.awarded ? `Lesson completed! +${rw.xp} XP & +${rw.coins} Coins` : "Lesson completed!", "success");
      render();
    } else {
      showToast("Already completed!");
    }
  },
  answerPractice: async (qId, given) => {
    const q = state.curriculum.questions.find((x) => x.id === qId);
    if (!q) return;
    state.practiceState.answered = true;
    state.practiceState.selected = given;
    const isRight = normalizeAns(given) === normalizeAns(q.ans);
    if (isRight) {
      await awardActivityReward(state.profile, {
        activityType: "Practice Completion",
        subjectId: q.subjectId,
        chapterId: q.chapterId,
        xp: 5,
        coins: 1,
        idempotencyKey: `practice::${state.profile.studentId}::${q.id}`,
        note: `Solved practice question`
      });
    } else {
      await dbPut("wrongAnswers", {
        id: `${state.profile.studentId}::${q.id}`,
        studentId: state.profile.studentId,
        questionId: q.id,
        chapterId: q.chapterId,
        q: q.q,
        givenAns: given || "(Blank)",
        correctAns: q.ans,
        explanation: q.explanation || q.solution || "",
        updatedAt: new Date().toISOString()
      });
      // Schedule revision automatically in revisions store
      await dbPut("revisions", {
        revisionId: `${state.profile.studentId}::${q.id}`,
        studentId: state.profile.studentId,
        subjectId: q.subjectId,
        chapterId: q.chapterId,
        questionId: q.id,
        title: q.q,
        category: "Incorrect answer",
        revisionDate: getLocalDateKey(),
        status: "pending",
        createdAt: new Date().toISOString()
      });
    }
    render();
  },
  nextPracticeQuestion: () => {
    state.practiceState.idx++;
    state.practiceState.answered = false;
    state.practiceState.selected = "";
    render();
  },
  setPracticeDifficulty: (d) => { state.practiceState.difficulty = d; state.practiceState.idx = 0; state.practiceState.answered = false; render(); },
  togglePracticeRetry: () => { state.practiceState.retryOnly = !state.practiceState.retryOnly; state.practiceState.idx = 0; state.practiceState.answered = false; render(); },
  resetPracticeFilters: () => { state.practiceState = { idx: 0, answered: false, selected: "", difficulty: "ALL", retryOnly: false }; render(); },
  setPlayMode: (m) => { state.gameState.mode = m; render(); },
  flipPlaycard: () => { state.gameState.flipped = !state.gameState.flipped; render(); },
  nextPlaycard: () => { state.gameState.cardIdx++; state.gameState.flipped = false; render(); },
  resetMatchGame: () => { state.gameState.matchData = null; state.gameState.matchLeft = null; state.gameState.matchedIds = []; state.gameState.matchFeedback = ""; render(); },
  pickMatchLeft: (id) => { state.gameState.matchLeft = id; state.gameState.matchFeedback = "Now tap the matching item in Column B!"; render(); },
  pickMatchRight: async (id) => {
    const gs = state.gameState;
    if (!gs.matchLeft) { gs.matchFeedback = "First select an item from Column A."; return render(); }
    if (gs.matchLeft === id) {
      gs.matchedIds.push(id);
      gs.matchLeft = null;
      gs.matchFeedback = "✅ Matched!";
      if (gs.matchData && gs.matchedIds.length === gs.matchData.pairs.length) {
        await awardActivityReward(state.profile, {
          activityType: "Educational Game Completion",
          subjectId: state.selectedSubjectId || "",
          chapterId: state.selectedChapterId || "",
          xp: 15,
          coins: 10,
          idempotencyKey: `match_col::${state.profile.studentId}::${state.selectedChapterId}`,
          note: "Completed Match the Column"
        });
      }
    } else {
      gs.matchFeedback = "❌ Not a match — try again!";
    }
    render();
  },
  setQuickTestAns: (qId, val) => { state.quickTest.answers[qId] = val; render(); },
  submitQuickTest: () => { state.quickTest.submitted = true; render(); },
  resetQuickTest: () => { state.quickTest = { answers: {}, submitted: false, startTime: Date.now() }; render(); },
  playGameAnswer: async (opt) => {
    const gs = state.gameState;
    if (!gs.round) return;
    if (opt === gs.round.answer) {
      gs.score++;
      gs.feedback = "✅ Correct! Great job!";
    } else {
      gs.feedback = `❌ Correct answer was ${gs.round.answer}`;
    }
    if (gs.level < 3) {
      gs.level++;
      const curCh = state.curriculum.chapters.find(c => c.id === state.selectedChapterId);
      const curQs = state.curriculum.questions.filter(q => q.chapterId === state.selectedChapterId);
      gs.round = generateGameRound(gs.activeGame.gameType, gs.level, curCh, curQs);
    } else {
      const { earnedCoins } = await recordGameCompletion(state.profile, gs.activeGame, gs.score, 3);
      showToast(`Game finished! Score ${gs.score}/3 · +${earnedCoins} Coins!`, "success");
      gs.level = 1;
      gs.score = 0;
      const curCh = state.curriculum.chapters.find(c => c.id === state.selectedChapterId);
      const curQs = state.curriculum.questions.filter(q => q.chapterId === state.selectedChapterId);
      gs.round = generateGameRound(gs.activeGame.gameType, 1, curCh, curQs);
    }
    render();
  },
  toggleOfflineBook: async (bookId) => {
    const book = state.curriculum.books.find((b) => b.id === bookId);
    if (!book) return;
    const chs = state.curriculum.chapters.filter((c) => c.bookId === bookId);
    const nowDl = await toggleBookOfflinePack(book, chs);
    showToast(nowDl ? `${book.title} saved for offline reading!` : `Removed offline pack for ${book.title}.`);
    render();
  },
  startChapterTest: (subId, chId) => {
    const paper = buildMockPaper(state.curriculum.questions, { subjectId: subId, chapterId: chId, templateId: "chapter_test" });
    if (paper.actualCount === 0) return showToast("No questions available for this chapter test.", "error");
    window.SP._beginPaper(paper);
  },
  launchMockExam: (e) => {
    e.preventDefault();
    const paper = buildMockPaper(state.curriculum.questions, {
      subjectId: document.getElementById("mockSub").value,
      templateId: document.getElementById("mockTpl").value,
      difficulty: document.getElementById("mockDiff").value
    });
    if (paper.actualCount === 0) return showToast("No questions match this selection yet.", "error");
    window.SP._beginPaper(paper);
  },
  _beginPaper: (paper) => {
    clearInterval(state.examState.timerId);
    state.examState = {
      paper,
      answers: {},
      currentIdx: 0,
      secondsLeft: paper.durationSec,
      lastResult: null,
      timerId: setInterval(() => {
        if (state.examState.secondsLeft > 0) state.examState.secondsLeft--;
        else window.SP.submitActiveExam();
      }, 1000)
    };
    state.view = "mock";
    render();
  },
  jumpExamQ: (i) => { state.examState.currentIdx = i; render(); },
  setExamAnswer: (qId, val) => { state.examState.answers[qId] = val; if (!val || val.length < 30) render(); },
  saveCurrentExamDraft: async () => {
    await saveExamDraft(state.profile.studentId, {
      paper: state.examState.paper,
      answers: state.examState.answers,
      currentIdx: state.examState.currentIdx,
      secondsLeft: state.examState.secondsLeft
    });
    clearInterval(state.examState.timerId);
    state.examState.paper = null;
    showToast("Exam saved! You can resume anytime offline.", "success");
    render();
  },
  resumeExamDraft: async () => {
    const d = await loadExamDraft(state.profile.studentId);
    if (!d) return;
    window.SP._beginPaper(d.paper);
    state.examState.answers = d.answers || {};
    state.examState.currentIdx = d.currentIdx || 0;
    state.examState.secondsLeft = d.secondsLeft || d.paper.durationSec;
    render();
  },
  submitActiveExam: async () => {
    clearInterval(state.examState.timerId);
    const res = await submitMockExam(state.profile, state.examState.paper, state.examState.answers);
    state.examState.paper = null;
    state.examState.lastResult = res;
    showToast("Exam submitted!", "success");
    render();
  },
  clearLastExamResult: () => { state.examState.lastResult = null; render(); },

  // Rough Slate
  openRoughSlate: () => {
    const m = document.getElementById("sp-slate-modal");
    if (!m) return;
    m.style.display = "flex";
    const canvas = document.getElementById("sp-slate-canvas");
    if (canvas && !canvas._init) {
      canvas._init = true;
      const ctx = canvas.getContext("2d");
      let drawing = false;
      const pos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const pt = e.touches ? e.touches[0] : e;
        return { x: pt.clientX - rect.left, y: pt.clientY - rect.top };
      };
      const start = (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
      const move = (e) => { if (!drawing) return; e.preventDefault(); const p = pos(e); ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#1d4ed8"; ctx.lineTo(p.x, p.y); ctx.stroke(); };
      const end = () => { drawing = false; };
      canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move); window.addEventListener("mouseup", end);
      canvas.addEventListener("touchstart", start, { passive: false }); canvas.addEventListener("touchmove", move, { passive: false }); canvas.addEventListener("touchend", end);
    }
  },
  closeRoughSlate: () => { document.getElementById("sp-slate-modal").style.display = "none"; },
  clearRoughSlate: () => { const c = document.getElementById("sp-slate-canvas"); if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height); },

  // CMS Handlers
  setCMSTab: (t) => { state.cmsTab = t; render(); },
  openCMSChapterForm: () => { const el = document.getElementById("cmsChapterFormSlot"); if (el) el.style.display = el.style.display === "none" ? "block" : "none"; },
  saveCMSChapter: async (e) => {
    e.preventDefault();
    const classNum = document.getElementById("cmsChClass").value;
    const board = document.getElementById("cmsChBoard").value;
    const medium = document.getElementById("cmsChMedium").value;
    const subjectId = document.getElementById("cmsChSubject").value;
    const title = document.getElementById("cmsChTitle").value.trim();
    const intro = document.getElementById("cmsChIntro").value.trim();
    const explanation = document.getElementById("cmsChExplanation").value.trim();
    const status = document.getElementById("cmsChStatus").value;

    // Ensure matching textbook exists
    const allBooks = await dbGetAll("textbooks");
    let book = allBooks.find((b) => b.classNum === classNum && b.board === board && b.medium === medium && b.subjectId === subjectId);
    if (!book) {
      book = {
        id: `tb-c${classNum}-${board}-${medium}-${subjectId}`,
        title: `${subjectId.toUpperCase()} (Class ${classNum} ${board})`,
        board, medium, classNum, subjectId,
        subjectName: subjectId.charAt(0).toUpperCase() + subjectId.slice(1),
        subjectIcon: subjectId,
        session: "2026-27",
        publisher: "School / Teacher CMS",
        coverColor: "#2563eb",
        status: "Published",
        offlineDownloaded: true
      };
      await dbPut("textbooks", book);
    }
    const ch = {
      id: `ch-cms-${Date.now()}`,
      bookId: book.id,
      board, medium, classNum, subjectId,
      sequence: 99,
      title, intro, explanation,
      objectives: ["Master core chapter concepts"],
      concepts: [], examples: [], exercises: [], revision: [],
      sourceType: "Teacher CMS Authored Content",
      status
    };
    await dbPut("chapters", ch);
    showToast(`Chapter "${title}" saved as ${status}!`, "success");
    render();
  },
  updateChapterStatus: async (chId, newStatus) => {
    const ch = await dbGet("chapters", chId);
    if (!ch) return;
    ch.status = newStatus;
    await dbPut("chapters", ch);
    showToast(`Chapter status updated to ${newStatus}`, "success");
    render();
  },
  launchTeacherExamPaper: async (id) => {
    const a = await dbGet("assessments", id);
    if (!a || !a.questions.length) return showToast("Exam paper has no questions.", "error");
    window.SP._beginPaper(a);
  },
  saveCMSExamPaper: async (e) => {
    e.preventDefault();
    const classNum = document.getElementById("cmsExClass").value;
    const board = document.getElementById("cmsExBoard").value;
    const medium = document.getElementById("cmsExMedium").value;
    const subjectId = document.getElementById("cmsExSubject").value;
    const title = document.getElementById("cmsExTitle").value.trim();
    const durationMin = Number(document.getElementById("cmsExDuration").value) || 30;
    const count = Number(document.getElementById("cmsExCount").value) || 10;
    const allQs = await dbGetAll("questions");
    const pool = allQs.filter(q => q.classNum === classNum && q.board === board && q.medium === medium && (subjectId === "ALL" || q.subjectId === subjectId));
    if (!pool.length) return showToast("No questions found for that Class/Board/Medium/Subject.", "error");
    const selected = pool.slice(0, count);
    const paper = {
      id: "exam_" + Date.now(),
      paperId: "exam_" + Date.now(),
      title, classNum, board, medium, subjectId,
      durationSec: durationMin * 60,
      requestedCount: count,
      actualCount: selected.length,
      questions: selected,
      status: "Published",
      createdAt: new Date().toISOString()
    };
    await dbPut("assessments", paper);
    showToast(`Exam Paper "${title}" published (${selected.length} Qs)!`, "success");
    render();
  },
  deleteCMSExamPaper: async (id) => {
    await dbDelete("assessments", id);
    showToast("Exam paper deleted.");
    render();
  },
  openCMSExPlayEditor: async (chId) => {
    const ch = await dbGet("chapters", chId);
    if (!ch) return;
    const slot = document.getElementById("cmsExPlayEditorSlot");
    if (!slot) return;
    slot.style.display = "block";
    const exs = ch.exercises || [];
    const pcs = ch.playcards || [];
    slot.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="margin:0;">✏️ Edit Exercises & Playcards — ${ch.title}</h3>
        <button class="sp-btn sp-btn-secondary" style="min-height:32px;font-size:12px;" onclick="document.getElementById('cmsExPlayEditorSlot').style.display='none'">Close</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div>
          <strong>Book Exercises (${exs.length})</strong>
          <div style="max-height:180px;overflow-y:auto;margin:8px 0;display:grid;gap:6px;">
            ${exs.map((ex, i) => `<div style="padding:8px;background:var(--bg-muted);border-radius:8px;font-size:12px;display:flex;justify-content:space-between;gap:6px;"><span><strong>Q${ex.qNo||i+1}:</strong> ${ex.q.slice(0,60)}</span><button class="sp-btn sp-btn-danger" style="min-height:24px;padding:0 8px;font-size:11px;" onclick="window.SP.deleteCMSExercise('${ch.id}',${i})">×</button></div>`).join("")}
          </div>
          <form onsubmit="window.SP.addCMSExercise(event, '${ch.id}')" style="display:grid;gap:6px;">
            <input id="cmsNewExQ" class="sp-input" placeholder="Exercise Question..." required />
            <input id="cmsNewExAns" class="sp-input" placeholder="Answer..." required />
            <input id="cmsNewExHint" class="sp-input" placeholder="Hint (optional)" />
            <button type="submit" class="sp-btn sp-btn-primary" style="min-height:34px;font-size:12px;">+ Add Exercise</button>
          </form>
        </div>
        <div>
          <strong>Custom Playcards (${pcs.length})</strong>
          <div style="max-height:180px;overflow-y:auto;margin:8px 0;display:grid;gap:6px;">
            ${pcs.map((pc, i) => `<div style="padding:8px;background:var(--bg-muted);border-radius:8px;font-size:12px;display:flex;justify-content:space-between;gap:6px;"><span><strong>${pc.front.slice(0,40)}</strong> → ${pc.back.slice(0,30)}</span><button class="sp-btn sp-btn-danger" style="min-height:24px;padding:0 8px;font-size:11px;" onclick="window.SP.deleteCMSPlaycard('${ch.id}',${i})">×</button></div>`).join("")}
          </div>
          <form onsubmit="window.SP.addCMSPlaycard(event, '${ch.id}')" style="display:grid;gap:6px;">
            <input id="cmsNewPcFront" class="sp-input" placeholder="Playcard Front (Term / Small Q)..." required />
            <input id="cmsNewPcBack" class="sp-input" placeholder="Playcard Back (Definition / Answer)..." required />
            <button type="submit" class="sp-btn sp-btn-success" style="min-height:34px;font-size:12px;">+ Add Playcard</button>
          </form>
        </div>
      </div>
    `;
  },
  addCMSExercise: async (e, chId) => {
    e.preventDefault();
    const ch = await dbGet("chapters", chId);
    if (!ch) return;
    ch.exercises = ch.exercises || [];
    ch.exercises.push({
      qNo: String(ch.exercises.length + 1),
      marks: 2,
      q: document.getElementById("cmsNewExQ").value.trim(),
      ans: document.getElementById("cmsNewExAns").value.trim(),
      hint: document.getElementById("cmsNewExHint").value.trim(),
      steps: document.getElementById("cmsNewExAns").value.trim()
    });
    await dbPut("chapters", ch);
    showToast("Exercise added to chapter!", "success");
    window.SP.openCMSExPlayEditor(chId);
  },
  deleteCMSExercise: async (chId, idx) => {
    const ch = await dbGet("chapters", chId);
    if (!ch || !ch.exercises) return;
    ch.exercises.splice(idx, 1);
    await dbPut("chapters", ch);
    window.SP.openCMSExPlayEditor(chId);
  },
  addCMSPlaycard: async (e, chId) => {
    e.preventDefault();
    const ch = await dbGet("chapters", chId);
    if (!ch) return;
    ch.playcards = ch.playcards || [];
    ch.playcards.push({
      front: document.getElementById("cmsNewPcFront").value.trim(),
      back: document.getElementById("cmsNewPcBack").value.trim(),
      tag: "Teacher Card"
    });
    await dbPut("chapters", ch);
    showToast("Playcard added to chapter!", "success");
    window.SP.openCMSExPlayEditor(chId);
  },
  deleteCMSPlaycard: async (chId, idx) => {
    const ch = await dbGet("chapters", chId);
    if (!ch || !ch.playcards) return;
    ch.playcards.splice(idx, 1);
    await dbPut("chapters", ch);
    window.SP.openCMSExPlayEditor(chId);
  },
  openCMSQuestionForm: (chId) => {
    document.getElementById("cmsQChapterId").value = chId;
    document.getElementById("cmsQuestionModalSlot").style.display = "block";
  },
  saveCMSQuestion: async (e) => {
    e.preventDefault();
    const chId = document.getElementById("cmsQChapterId").value;
    const ch = await dbGet("chapters", chId);
    if (!ch) return;
    const optsRaw = document.getElementById("cmsQOptions").value.trim();
    const q = {
      id: `q-cms-${Date.now()}`,
      chapterId: ch.id,
      bookId: ch.bookId,
      board: ch.board,
      medium: ch.medium,
      classNum: ch.classNum,
      subjectId: ch.subjectId,
      topic: "Teacher Added",
      type: document.getElementById("cmsQType").value,
      difficulty: document.getElementById("cmsQDiff").value,
      marks: 1,
      q: document.getElementById("cmsQText").value.trim(),
      options: optsRaw ? optsRaw.split("|").map((s) => s.trim()) : [],
      ans: document.getElementById("cmsQAns").value.trim(),
      explanation: document.getElementById("cmsQSol").value.trim(),
      solution: document.getElementById("cmsQSol").value.trim()
    };
    await dbPut("questions", q);
    showToast("Question added to verified bank!", "success");
    render();
  },
  toggleSelfReg: async (val) => {
    await dbPut("settings", { key: "selfRegistrationEnabled", value: val });
    showToast(`Student self-registration ${val ? "enabled" : "disabled"}.`);
  },
  createStudentFromCMS: async (e) => {
    e.preventDefault();
    try {
      const { profile } = await registerStudent({
        name: document.getElementById("cmsStuName").value,
        username: document.getElementById("cmsStuUser").value,
        pinOrPassword: document.getElementById("cmsStuPin").value,
        classNum: document.getElementById("cmsStuClass").value,
        board: document.getElementById("cmsStuBoard").value,
        medium: document.getElementById("cmsStuMed").value,
        createdBy: state.teacherProfile?.teacherId || "teacher"
      });
      showToast(`Created student ${profile.name} (${profile.studentId})`, "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  resetStudentPinPrompt: async (studentId) => {
    const newPin = prompt(`Enter new PIN/Password (4+ chars) for ${studentId}:`);
    if (!newPin) return;
    try {
      await resetStudentPinByTeacher(state.session, studentId, newPin);
      showToast(`PIN reset successfully for ${studentId}`, "success");
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  runCMSImport: async (fmt) => {
    const raw = document.getElementById("cmsImportBox").value.trim();
    if (!raw) return showToast("Paste JSON or CSV data first.", "error");
    try {
      if (fmt === "json") {
        const parsed = JSON.parse(raw);
        const { validChapters, validQuestions, rejected } = validateImportPayload(parsed);
        if (validChapters.length) await dbBulkPut("chapters", validChapters);
        if (validQuestions.length) await dbBulkPut("questions", validQuestions);
        showToast(`Imported ${validChapters.length} chapters, ${validQuestions.length} questions (${rejected.length} rejected).`, rejected.length ? "info" : "success");
      } else {
        const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
        const qs = [];
        for (const line of lines) {
          if (line.startsWith("chapterId,")) continue;
          const [chapterId, type, difficulty, marks, q, options, ans, explanation] = line.split(",");
          qs.push({ id: `q-csv-${Date.now()}-${qs.length}`, chapterId, type, difficulty, marks: Number(marks) || 1, q, options: options ? options.split("|") : [], ans, explanation, solution: explanation });
        }
        await dbBulkPut("questions", qs);
        showToast(`Imported ${qs.length} CSV questions!`, "success");
      }
      render();
    } catch (err) {
      showToast("Import failed: " + err.message, "error");
    }
  },
  submitDescriptiveGrade: async (attemptId) => {
    const marks = Number(document.getElementById(`gradeMarks_${attemptId}`)?.value || 0);
    const attempt = await dbGet("studentAttempts", attemptId);
    if (!attempt) return;
    attempt.teacherMarksAwarded = marks;
    attempt.evaluationStatus = "evaluated";
    await dbPut("studentAttempts", attempt);
    showToast("Descriptive exam graded and finalized!", "success");
    render();
  },
  switchStudentSession: async (sess) => {
    state.profile.session = sess;
    await dbPut("studentProfiles", state.profile);
    await loadStudentContext();
    render();
  },
  runGlobalSearch: (val) => {
    state.searchQuery = val;
    render();
    const inp = document.getElementById("globalSearchInput");
    if (inp) { inp.focus(); inp.setSelectionRange(val.length, val.length); }
  },
  completeAssignment: async (assignmentId) => {
    const a = await dbGet("assignments", assignmentId);
    if (!a) return;
    a.completedBy = a.completedBy || {};
    a.completedBy[state.profile.studentId] = new Date().toISOString();
    await dbPut("assignments", a);
    await awardActivityReward(state.profile, {
      activityType: "Assignment Completion",
      subjectId: a.subjectId || "",
      xp: 15, coins: 10,
      idempotencyKey: `assign::${state.profile.studentId}::${assignmentId}`,
      note: a.title
    });
    showToast("Assignment completed! +15 XP", "success");
    render();
  },
  markRevisionDone: async (revId) => {
    const rv = await dbGet("revisions", revId);
    if (!rv) return;
    rv.status = "completed";
    rv.completedAt = new Date().toISOString();
    await dbPut("revisions", rv);
    showToast("Revision marked complete!", "success");
    render();
  },
  saveCMSAssignment: async (e) => {
    e.preventDefault();
    const a = {
      assignmentId: "asg_" + Date.now(),
      classNum: document.getElementById("cmsAsClass").value,
      board: document.getElementById("cmsAsBoard").value,
      medium: document.getElementById("cmsAsMedium").value,
      session: document.getElementById("cmsAsSession").value,
      subjectId: document.getElementById("cmsAsSubject").value,
      title: document.getElementById("cmsAsTitle").value.trim(),
      dueDate: document.getElementById("cmsAsDue").value,
      description: document.getElementById("cmsAsDesc").value.trim(),
      completedBy: {},
      createdAt: new Date().toISOString()
    };
    await dbPut("assignments", a);
    showToast("Assignment saved locally!", "success");
    render();
  },
  deleteCMSAssignment: async (id) => {
    await dbDelete("assignments", id);
    showToast("Assignment deleted.");
    render();
  },
  previewBackupFile: (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const check = validateBackupObject(parsed);
        const slot = document.getElementById("cmsBackupPreviewSlot");
        if (!check.valid) {
          slot.innerHTML = `<div style="color:#dc2626;font-weight:700;">Invalid backup: ${escapeHTML(check.errors.join(" "))}</div>`;
          return;
        }
        window.SP._pendingBackup = parsed;
        slot.innerHTML = `
          <div style="padding:12px;border-radius:12px;background:var(--bg-muted);">
            <div><strong>Valid Backup (v${escapeHTML(parsed.backupFormatVersion)})</strong> · Created: ${escapeHTML(parsed.createdAt)}</div>
            <div style="font-size:12px;margin:6px 0;">Students: ${parsed.recordCounts?.studentProfiles || 0} · Chapters: ${parsed.recordCounts?.chapters || 0} · Questions: ${parsed.recordCounts?.questions || 0} · Attempts: ${parsed.recordCounts?.studentAttempts || 0}</div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button class="sp-btn sp-btn-primary" style="min-height:34px;font-size:12px;" onclick="window.SP.runRestore('merge')">Merge Backup</button>
              <button class="sp-btn sp-btn-danger" style="min-height:34px;font-size:12px;" onclick="window.SP.runRestore('replace')">Replace Local Data</button>
            </div>
          </div>`;
      } catch (err) {
        showToast("Invalid JSON file.", "error");
      }
    };
    reader.readAsText(file);
  },
  runRestore: async (mode) => {
    if (!window.SP._pendingBackup) return;
    if (mode === "replace" && !confirm("Replace ALL local data with this backup? A safety backup will be saved first.")) return;
    try {
      const res = await restoreBackup(window.SP._pendingBackup, mode);
      showToast(`Restore (${res.mode}) succeeded! Added ${res.added} records.`, "success");
      render();
    } catch (err) {
      showToast(err.message, "error");
    }
  },
  exportFullJSON: async () => {
    const backup = await createCompleteBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `scholars-point-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("Complete versioned backup exported!", "success");
  }
};

document.addEventListener("DOMContentLoaded", bootstrap);
