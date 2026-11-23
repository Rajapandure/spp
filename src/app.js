// Scholars Point — Main Application Controller & UI Renderer
import { ACADEMIC_SESSIONS, AVATARS, BOARDS, CLASS_CONFIGS, MEDIUMS } from "./config/classes.js";
import {
  dbBulkPut, dbDelete, dbGet, dbGetAll, dbPut, dbQueryByIndex,
  enqueueSyncRecord, flushPendingSync, getStudentAttempts, getStudentBookmarks,
  getStudentProgressMap, getStudentWrongAnswers
} from "./db/database.js";
import {
  getSavedSession, hasTeacherAccount, loginStudent, loginTeacher,
  logoutSession, registerStudent, resetStudentPinByTeacher, setupTeacherAccount
} from "./auth/auth.js";
import { ensureCurriculumSeeded, getStudentCurriculum } from "./curriculum/curriculumService.js";
import { renderAvatarSVG, renderSubjectSVG } from "./ui/illustrations.js";
import {
  addHighlight, isBookOfflineDownloaded, renderLearnChapterHTML,
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
  quickTest: { answers: {}, submitted: false },
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
  root.style.setProperty("--radius-card", cfg.cardRadius);
  root.style.setProperty("--btn-min-h", cfg.btnMinHeight);
  root.style.setProperty("--font-size-base", cfg.fontSizeBase);
}

async function bootstrap() {
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
  if (navigator.onLine && state.profile) {
    const res = await flushPendingSync(state.profile.studentId);
    if (res.synced > 0) showToast(`Synced ${res.synced} offline record(s) without duplicates!`, "success");
  }
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
  else if (state.view === "progress" || state.view === "profile") bodyHTML = await renderProgressAndProfile();

  app.innerHTML = renderTopBar(false) + bodyHTML + renderMobileBottomNav();
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

function renderTopBar(isTeacher) {
  const p = state.profile;
  const syncBadge = navigator.onLine
    ? `<span class="sp-badge" style="background:#d1fae5;color:#065f46;">● Online</span>`
    : `<span class="sp-badge" style="background:#fef3c7;color:#92400e;">● Offline</span>`;
  return `
    <header class="sp-topbar no-print">
      <div style="max-width:1220px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;cursor:pointer;" onclick="window.SP.goHome()">
          ${isTeacher ? `<div style="width:38px;height:38px;border-radius:12px;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;">CMS</div>` : renderAvatarSVG(p.avatar, 40)}
          <div style="min-width:0;">
            <div style="font-weight:800;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${isTeacher ? "Scholars Point CMS" : p.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${isTeacher ? "Teacher & Admin Studio" : `Class ${p.classNum} · ${BOARDS[p.board]?.name || p.board} · ${MEDIUMS[p.medium]?.name || p.medium}`}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${!isTeacher ? `<span class="sp-badge" style="background:#fef3c7;color:#92400e;">🔥 ${p.streak || 1}d · 🪙 ${p.coins || 0}</span>` : ""}
          ${syncBadge}
          ${!isTeacher ? `<button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 10px;font-size:12px;" onclick="window.SP.openRoughSlate()">✏️ Slate</button>` : ""}
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
  const totalChapters = chapters.length;
  const completionPct = totalChapters ? Math.round((completedCount / totalChapters) * 100) : 0;
  const nextChapter = chapters.find((c) => !state.progressMap[c.id]?.completed) || chapters[0];
  const firstName = (p.name || "Learner").trim().split(/\s+/)[0];

  return `
    <main class="sp-container sp-dashboard">
      <section class="sp-welcome-panel sp-animate-pop">
        <div class="sp-welcome-copy">
          <span class="sp-class-pill">${cfg.label} · ${cfg.labelHi} <span aria-hidden="true">•</span> ${p.session}</span>
          <p class="sp-welcome-eyebrow">YOUR LEARNING SPACE</p>
          <h1>Namaste, ${firstName}! <span aria-hidden="true">👋</span></h1>
          <p class="sp-welcome-subtitle">A new day is a new chance to learn something amazing.</p>
          <div class="sp-welcome-meta">
            <span>Student ID: <strong>${p.studentId}</strong></span>
            <span class="sp-meta-dot" aria-hidden="true">•</span>
            <span>Class ${p.classNum}</span>
          </div>
          ${nextChapter ? `
            <button class="sp-btn sp-btn-primary sp-continue-btn" onclick="window.SP.openChapter('${nextChapter.subjectId}','${nextChapter.id}','LEARN')">
              <span aria-hidden="true">▶</span> Continue learning
              <span class="sp-continue-title">${nextChapter.title.slice(0, 36)}${nextChapter.title.length > 36 ? "…" : ""}</span>
            </button>
          ` : ""}
        </div>
        <div class="sp-welcome-progress" aria-label="${completionPct}% chapter completion">
          <div class="sp-progress-ring" style="--progress:${completionPct};">
            <div class="sp-progress-ring-inner">
              <strong>${completionPct}%</strong>
              <span>Complete</span>
            </div>
          </div>
          <div class="sp-progress-caption"><strong>${completedCount} of ${totalChapters}</strong><span>chapters completed</span></div>
        </div>
        <span class="sp-hero-decoration sp-hero-decoration-one" aria-hidden="true">✦</span>
        <span class="sp-hero-decoration sp-hero-decoration-two" aria-hidden="true">✧</span>
      </section>

      <section class="sp-dashboard-section" aria-labelledby="sp-subjects-title">
        <div class="sp-section-heading">
          <div><p class="sp-section-kicker">PICK UP WHERE YOU LEFT OFF</p><h2 id="sp-subjects-title">My Subjects</h2></div>
          <span class="sp-section-count">${subjects.length} subjects</span>
        </div>
        ${subjects.length === 0 ? `
          <div class="sp-card sp-empty-state">
            <span class="sp-empty-icon" aria-hidden="true">📚</span>
            <strong>Your classroom is getting ready</strong>
            <p>No published textbooks yet for Class ${p.classNum} · ${BOARDS[p.board]?.name} · ${MEDIUMS[p.medium]?.name}. Ask your teacher to publish content in the CMS.</p>
          </div>
        ` : `
          <div class="sp-subject-grid">
            ${subjects.map((sub) => {
              const subChs = chapters.filter((c) => c.subjectId === sub.id);
              const done = subChs.filter((c) => state.progressMap[c.id]?.completed).length;
              const pct = subChs.length ? Math.round((done / subChs.length) * 100) : 0;
              return `
                <button type="button" class="sp-card sp-subject-tile" onclick="window.SP.openSubject('${sub.id}')" aria-label="Open ${sub.name}, ${subChs.length} chapters">
                  <span class="sp-subject-art">${renderSubjectSVG(sub.icon, 54)}</span>
                  <span class="sp-subject-main">
                    <strong>${sub.name}</strong>
                    <span class="sp-subject-books">${sub.books.map((b) => b.title).join(", ") || "Learning book"}</span>
                  </span>
                  <span class="sp-subject-arrow" aria-hidden="true">↗</span>
                  <span class="sp-subject-stats"><span>${subChs.length} chapters</span><strong>${done}/${subChs.length} done</strong></span>
                  <span class="sp-subject-progress"><span style="width:${pct}%;"></span></span>
                </button>
              `;
            }).join("")}
          </div>
        `}
      </section>

      <section class="sp-dashboard-section sp-tools-section" aria-labelledby="sp-tools-title">
        <div class="sp-section-heading">
          <div><p class="sp-section-kicker">LEARN IN YOUR OWN WAY</p><h2 id="sp-tools-title">Learning Hub</h2></div>
        </div>
        <div class="sp-tools-grid">
          <button type="button" class="sp-card sp-tool-tile sp-tool-books" onclick="window.SP.setView('books')"><span class="sp-tool-icon" aria-hidden="true">📚</span><span class="sp-tool-copy"><strong>My Books</strong><small>Read and learn offline</small></span><span class="sp-tool-arrow" aria-hidden="true">→</span></button>
          <button type="button" class="sp-card sp-tool-tile sp-tool-practice" onclick="window.SP.openQuickTab('PRACTICE')"><span class="sp-tool-icon" aria-hidden="true">✍️</span><span class="sp-tool-copy"><strong>Practice</strong><small>Build your skills</small></span><span class="sp-tool-arrow" aria-hidden="true">→</span></button>
          <button type="button" class="sp-card sp-tool-tile sp-tool-play" onclick="window.SP.openQuickTab('PLAY')"><span class="sp-tool-icon" aria-hidden="true">🎮</span><span class="sp-tool-copy"><strong>Play & Learn</strong><small>Learn through games</small></span><span class="sp-tool-arrow" aria-hidden="true">→</span></button>
          <button type="button" class="sp-card sp-tool-tile sp-tool-tests" onclick="window.SP.setView('mock')"><span class="sp-tool-icon" aria-hidden="true">📝</span><span class="sp-tool-copy"><strong>Mock Tests</strong><small>Check what you know</small></span><span class="sp-tool-arrow" aria-hidden="true">→</span></button>
          <button type="button" class="sp-card sp-tool-tile sp-tool-progress" onclick="window.SP.setView('progress')"><span class="sp-tool-icon" aria-hidden="true">🏆</span><span class="sp-tool-copy"><strong>My Progress</strong><small>Celebrate your growth</small></span><span class="sp-tool-arrow" aria-hidden="true">→</span></button>
        </div>
      </section>
    </main>
  `;
}
async function renderSubjectChapterWorkspace() {
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
  
  } else if (state.chapterTab === "PLAY") {
    tabBody = renderGamesTab(activeChapter, chGames, chQuestions);
  } else if (state.chapterTab === "TEST") {
    tabBody = renderQuickChapterTestTab(sub, activeChapter, chQuestions);
  }

  return `
    <div class="sp-container">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button class="sp-btn sp-btn-secondary" style="min-height:36px;padding:0 12px;" onclick="window.SP.setView('home')">← Dashboard</button>
        ${subjects.map((s) => `<button class="sp-btn ${s.id === sub.id ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:36px;padding:0 12px;" onclick="window.SP.openSubject('${s.id}')">${s.name}</button>`).join("")}
      </div>

      <div style="display:grid;grid-template-columns:minmax(220px,280px) 1fr;gap:16px;align-items:start;" class="sp-workspace-grid">
        <aside class="sp-card" style="padding:14px;">
          <div style="font-weight:800;font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Chapters</div>
          <div style="display:grid;gap:6px;">
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

        <main class="sp-card" style="padding:18px;min-width:0;">
          ${activeChapter ? `
            <h2 class="sp-chapter-head" style="margin:0 0 12px;font-size:1.28rem;">${activeChapter.title}</h2>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid var(--border-subtle);padding-bottom:12px;">
              ${["LEARN", "PRACTICE", "PLAY", "TEST"].map((t) => `
                <button class="sp-btn ${state.chapterTab === t ? "sp-btn-primary" : "sp-btn-secondary"}" style="min-height:38px;padding:0 14px;font-size:0.82rem;" onclick="window.SP.setChapterTab('${t}')">${t}</button>
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
  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Practice contains only the exercises supplied with this textbook chapter.
  const exercises = Array.isArray(chapter.exercises)
    ? chapter.exercises.filter(ex =>
        ex && typeof ex.q === "string" && ex.q.trim()
      )
    : [];

  if (!exercises.length) {
    return `
      <div class="sp-card" style="padding:24px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:8px;">📖</div>
        <h3>No Textbook Exercises Available</h3>
        <p style="color:var(--text-secondary);">
          Verified exercises have not been added for
          <strong>${escapeHTML(chapter.title)}</strong> yet.
        </p>
        <p style="font-size:.82rem;color:var(--text-muted);">
          This section will display the actual textbook exercises when your
          teacher adds them. Unrelated questions will not be shown.
        </p>
      </div>
    `;
  }

  return `
    <div style="display:grid;gap:14px;">

      <div class="sp-card" style="padding:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="font-size:2rem;">📚</div>
          <div>
            <h3 style="margin:0;">Textbook Practice</h3>
            <div style="font-size:.83rem;color:var(--text-muted);">
              ${exercises.length} exercise(s) · Original textbook order
            </div>
          </div>
        </div>
        <p style="font-size:.84rem;color:var(--text-secondary);margin:10px 0 0;">
          Attempt each question yourself before opening its hint or solution.
        </p>
      </div>

      ${exercises.map((ex, i) => {
        const questionNo = escapeHTML(ex.qNo || i + 1);
        const hasAnswer = Boolean(
          String(ex.ans ?? "").trim() ||
          String(ex.steps ?? "").trim()
        );

        return `
          <article class="sp-card" style="padding:16px;">

            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
              <span class="sp-badge"
                style="background:var(--accent-primary);color:#fff;">
                Question ${questionNo}
              </span>

              ${ex.marks ? `
                <span class="sp-badge"
                  style="background:var(--bg-muted);color:var(--text-secondary);">
                  ${escapeHTML(ex.marks)} Mark(s)
                </span>
              ` : ""}
            </div>

            <div style="font-weight:700;line-height:1.6;margin-bottom:12px;white-space:pre-wrap;">
              ${escapeHTML(ex.q)}
            </div>

            <label style="display:block;font-size:.82rem;font-weight:700;margin-bottom:6px;">
              Your Answer
            </label>

            <textarea
              class="sp-textarea"
              rows="3"
              placeholder="Write your answer or working here..."
              aria-label="Answer for question ${questionNo}">
            </textarea>

            ${ex.hint ? `
              <details style="margin-top:12px;padding:10px;border-radius:10px;background:var(--bg-muted);">
                <summary style="cursor:pointer;font-weight:700;">
                  💡 Show Hint
                </summary>
                <div style="margin-top:8px;white-space:pre-wrap;font-size:.9rem;">
                  ${escapeHTML(ex.hint)}
                </div>
              </details>
            ` : ""}

            ${hasAnswer ? `
              <details style="margin-top:10px;padding:10px;border-radius:10px;background:var(--bg-muted);">
                <summary style="cursor:pointer;font-weight:700;">
                  ✓ Show Answer & Solution
                </summary>

                ${ex.ans ? `
                  <div style="margin-top:10px;">
                    <strong>Answer:</strong>
                    <div style="white-space:pre-wrap;margin-top:4px;">
                      ${escapeHTML(ex.ans)}
                    </div>
                  </div>
                ` : ""}

                ${ex.steps ? `
                  <div style="margin-top:10px;">
                    <strong>Step-by-Step Solution:</strong>
                    <div style="white-space:pre-wrap;margin-top:4px;">
                      ${escapeHTML(ex.steps)}
                    </div>
                  </div>
                ` : ""}
              </details>
            ` : `
              <div style="margin-top:10px;font-size:.82rem;color:var(--text-muted);">
                The answer or solution has not been supplied yet.
              </div>
            `}

          </article>
        `;
      }).join("")}

    </div>
  `;
}
function renderGamesTab(chapter, chGames, chQuestions) {
  const gs = state.gameState;

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  // Build activities only from actual content belonging to this chapter.
  const cards = [];

  if (Array.isArray(chapter.playcards)) {
    chapter.playcards.forEach((card) => {
      if (
        card &&
        String(card.front ?? "").trim() &&
        String(card.back ?? "").trim()
      ) {
        cards.push({
          front: card.front,
          back: card.back,
          tag: card.tag || "Chapter Concept"
        });
      }
    });
  }

  if (Array.isArray(chapter.concepts)) {
    chapter.concepts.forEach((concept) => {
      if (
        concept &&
        String(concept.term ?? "").trim() &&
        String(concept.def ?? "").trim()
      ) {
        cards.push({
          front: concept.term,
          back: concept.def,
          tag: "Important Concept"
        });
      }
    });
  }

  if (Array.isArray(chapter.examples)) {
    chapter.examples.forEach((example) => {
      if (
        example &&
        String(example.q ?? "").trim() &&
        String(example.a ?? "").trim()
      ) {
        cards.push({
          front: example.q,
          back: example.a,
          tag: "Chapter Example"
        });
      }
    });
  }

  if (Array.isArray(chapter.exercises)) {
    chapter.exercises.forEach((exercise) => {
      if (
        exercise &&
        String(exercise.q ?? "").trim() &&
        String(exercise.ans ?? "").trim()
      ) {
        cards.push({
          front: exercise.q,
          back: exercise.ans,
          tag: "Textbook Question"
        });
      }
    });
  }

  // Create matching pairs from chapter-specific content.
  const pairs = [];

  cards.forEach((card, index) => {
    if (card.front && card.back) {
      pairs.push({
        id: `chapter-pair-${index}`,
        left: card.front,
        right: card.back
      });
    }
  });

  if (!cards.length) {
    return `
      <div class="sp-card" style="padding:24px;text-align:center;">
        <div style="font-size:2rem;">🎮</div>
        <h3>Chapter Games Coming Soon</h3>
        <p style="color:var(--text-secondary);">
          Learning activities have not been added for
          <strong>${escapeHTML(chapter.title)}</strong> yet.
        </p>
        <p style="font-size:.82rem;color:var(--text-muted);">
          Your teacher can add chapter playcards, concepts, examples
          and solved exercises through the CMS.
        </p>
      </div>
    `;
  }

  // Prepare matching data once for this chapter.
  if (!gs.matchData) {
    gs.matchData = {
      pairs,
      rightOptions: [...pairs]
        .sort(() => Math.random() - 0.5)
        .map(pair => ({
          id: pair.id,
          text: pair.right
        }))
    };

    gs.matchedIds = [];
    gs.matchLeft = null;
    gs.matchFeedback = "";
  }

  const activePairs = gs.matchData.pairs || [];
  const activeRightOptions = gs.matchData.rightOptions || [];

  let modeHTML = "";

  if (gs.mode === "playcard") {
    const idx = ((gs.cardIdx % cards.length) + cards.length) % cards.length;
    const card = cards[idx];

    modeHTML = `
      <div class="sp-card" style="padding:18px;">

        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
          <span class="sp-badge">
            Card ${idx + 1} of ${cards.length}
          </span>
          <span class="sp-badge" style="background:var(--bg-muted);color:var(--text-secondary);">
            ${escapeHTML(card.tag)}
          </span>
        </div>

        <div
          onclick="window.SP.flipPlaycard()"
          role="button"
          tabindex="0"
          style="
            cursor:pointer;
            min-height:190px;
            padding:24px;
            border-radius:18px;
            border:2px solid var(--accent-primary);
            background:var(--bg-muted);
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            text-align:center;
            gap:14px;
          ">

          <div style="font-size:.76rem;font-weight:800;color:var(--text-muted);text-transform:uppercase;">
            ${gs.flipped ? "Answer / Explanation" : "Question / Concept"}
          </div>

          <div style="font-size:1.1rem;font-weight:800;line-height:1.6;white-space:pre-wrap;">
            ${escapeHTML(gs.flipped ? card.back : card.front)}
          </div>

          <div style="font-size:.78rem;color:var(--text-muted);">
            Tap the card to ${gs.flipped ? "see the question" : "reveal the answer"}
          </div>
        </div>

        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px;">
          <button class="sp-btn sp-btn-secondary"
            onclick="window.SP.flipPlaycard()">
            🔄 ${gs.flipped ? "Show Question" : "Reveal Answer"}
          </button>

          <button class="sp-btn sp-btn-primary"
            onclick="window.SP.nextPlaycard()">
            Next Card →
          </button>
        </div>

      </div>
    `;
  } else {
    const allDone =
      activePairs.length > 0 &&
      gs.matchedIds.length === activePairs.length;

    modeHTML = `
      <div class="sp-card" style="padding:16px;">

        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
          <div>
            <strong>Match the Correct Answers</strong>
            <div style="font-size:.8rem;color:var(--text-muted);">
              Matched ${gs.matchedIds.length} of ${activePairs.length}
            </div>
          </div>

          <button class="sp-btn sp-btn-secondary"
            style="min-height:34px;font-size:12px;"
            onclick="window.SP.resetMatchGame()">
            ↻ Restart
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

          <div style="display:grid;gap:8px;min-width:0;">
            <div style="font-size:.76rem;font-weight:800;color:var(--text-muted);">
              COLUMN A · QUESTIONS
            </div>

            ${activePairs.map(pair => {
              const matched = gs.matchedIds.includes(pair.id);
              const selected = gs.matchLeft === pair.id;

              return `
                <button
                  class="sp-btn ${matched ? "sp-btn-success" : selected ? "sp-btn-primary" : "sp-btn-secondary"}"
                  style="height:auto;min-height:48px;padding:10px;justify-content:flex-start;text-align:left;white-space:normal;"
                  ${matched ? "disabled" : ""}
                  onclick="window.SP.pickMatchLeft('${pair.id}')">
                  ${escapeHTML(pair.left)}
                </button>
              `;
            }).join("")}
          </div>

          <div style="display:grid;gap:8px;min-width:0;">
            <div style="font-size:.76rem;font-weight:800;color:var(--text-muted);">
              COLUMN B · ANSWERS
            </div>

            ${activeRightOptions.map(option => {
              const matched = gs.matchedIds.includes(option.id);

              return `
                <button
                  class="sp-btn ${matched ? "sp-btn-success" : "sp-btn-secondary"}"
                  style="height:auto;min-height:48px;padding:10px;justify-content:flex-start;text-align:left;white-space:normal;"
                  ${matched ? "disabled" : ""}
                  onclick="window.SP.pickMatchRight('${option.id}')">
                  ${escapeHTML(option.text)}
                </button>
              `;
            }).join("")}
          </div>

        </div>

        ${gs.matchFeedback ? `
          <div style="margin-top:14px;font-weight:700;">
            ${escapeHTML(gs.matchFeedback)}
          </div>
        ` : ""}

        ${allDone ? `
          <div style="margin-top:14px;padding:14px;border-radius:12px;background:#d1fae5;color:#065f46;font-weight:800;text-align:center;">
            🎉 Excellent! You matched every item correctly!
            <div style="font-size:.82rem;font-weight:500;margin-top:4px;">
              You have completed this chapter activity.
            </div>
          </div>
        ` : ""}

      </div>
    `;
  }

  return `
    <div style="display:grid;gap:14px;">

      <div class="sp-card" style="padding:14px;">
        <div style="font-weight:800;">🎮 ${escapeHTML(chapter.title)} — Learning Games</div>
        <div style="font-size:.82rem;color:var(--text-muted);margin-top:4px;">
          Activities are created from this chapter's supplied learning content.
        </div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button
          class="sp-btn ${gs.mode === "playcard" ? "sp-btn-primary" : "sp-btn-secondary"}"
          style="min-height:38px;font-size:12px;"
          onclick="window.SP.setPlayMode('playcard')">
          🃏 Question & Answer Cards
        </button>

        <button
          class="sp-btn ${gs.mode === "match" ? "sp-btn-primary" : "sp-btn-secondary"}"
          style="min-height:38px;font-size:12px;"
          onclick="window.SP.setPlayMode('match')">
          🔗 Match the Column
        </button>
      </div>

      ${modeHTML}

    </div>
  `;
}
function renderQuickChapterTestTab(sub, chapter, chQuestions) {
  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const testQs = Array.isArray(chapter.exercises)
    ? chapter.exercises.filter(ex =>
        ex && typeof ex.q === "string" && ex.q.trim()
      )
    : [];

  const qt = state.quickTest;

  const getQuestionKey = (index) =>
    `booktest-${chapter.id}-${index}`;

  const gradableQs = testQs.filter(ex =>
    String(ex.ans ?? "").trim()
  );

  let score = 0;

  if (qt.submitted) {
    testQs.forEach((ex, index) => {
      if (!String(ex.ans ?? "").trim()) return;

      const given = qt.answers[getQuestionKey(index)] || "";

      if (normalizeAns(given) === normalizeAns(ex.ans)) {
        score++;
      }
    });
  }

  if (!testQs.length) {
    return `
      <div class="sp-card" style="padding:24px;text-align:center;">
        <div style="font-size:2rem;">📝</div>
        <h3>Chapter Test Not Available</h3>
        <p style="color:var(--text-secondary);">
          No textbook exercises have been added for
          <strong>${escapeHTML(chapter.title)}</strong> yet.
        </p>
        <p style="font-size:.82rem;color:var(--text-muted);">
          A chapter test will appear when verified textbook questions
          are available.
        </p>
      </div>
    `;
  }

  return `
    <div style="display:grid;gap:14px;">

      <div class="sp-card" style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
          <div>
            <h3 style="margin:0;">📝 ${escapeHTML(chapter.title)} — Chapter Test</h3>
            <div style="font-size:.83rem;color:var(--text-muted);margin-top:4px;">
              ${testQs.length} textbook question(s)
            </div>
          </div>

          <span class="sp-badge">
            ${qt.submitted ? "Test Submitted" : "Not Submitted"}
          </span>
        </div>

        <p style="font-size:.85rem;color:var(--text-secondary);margin:12px 0 0;">
          Answer the questions below. Your test uses the exercises supplied
          for this chapter.
        </p>
      </div>

      ${testQs.map((ex, i) => {
        const key = getQuestionKey(i);
        const given = qt.answers[key] || "";
        const hasAnswer = Boolean(String(ex.ans ?? "").trim());

        const isRight = hasAnswer &&
          normalizeAns(given) === normalizeAns(ex.ans);

        return `
          <article class="sp-card" style="padding:16px;">

            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
              <span class="sp-badge"
                style="background:var(--accent-primary);color:#fff;">
                Question ${i + 1}
              </span>

              ${ex.marks ? `
                <span class="sp-badge"
                  style="background:var(--bg-muted);color:var(--text-secondary);">
                  ${escapeHTML(ex.marks)} Mark(s)
                </span>
              ` : ""}
            </div>

            <div style="font-weight:700;line-height:1.6;margin-bottom:12px;white-space:pre-wrap;">
              ${escapeHTML(ex.q)}
            </div>

            ${Array.isArray(ex.options) && ex.options.length ? `
              <div style="display:grid;gap:8px;">
                ${ex.options.map(option => `
                  <button
                    class="sp-btn ${
                      given === option
                        ? (qt.submitted
                            ? (normalizeAns(option) === normalizeAns(ex.ans)
                                ? "sp-btn-success"
                                : "sp-btn-danger")
                            : "sp-btn-primary")
                        : "sp-btn-secondary"
                    }"
                    style="justify-content:flex-start;text-align:left;height:auto;min-height:42px;white-space:normal;"
                    ${qt.submitted ? "disabled" : ""}
                    onclick="window.SP.setQuickTestAns('${key}','${String(option).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')">
                    ${escapeHTML(option)}
                  </button>
                `).join("")}
              </div>
            ` : `
              <textarea
                class="sp-textarea"
                rows="3"
                placeholder="Write your answer here..."
                ${qt.submitted ? "disabled" : ""}
                onchange="window.SP.setQuickTestAns('${key}', this.value)"
              >${escapeHTML(given)}</textarea>
            `}

            ${qt.submitted ? `
              <div style="margin-top:12px;padding:10px;border-radius:10px;background:var(--bg-muted);">

                ${!hasAnswer ? `
                  <div style="font-size:.84rem;color:var(--text-muted);">
                    Answer key not supplied. This question requires teacher review.
                  </div>
                ` : `
                  <div style="font-weight:800;color:${isRight ? "#059669" : "#dc2626"};">
                    ${isRight ? "✓ Correct Answer" : "✗ Incorrect Answer"}
                  </div>

                  ${!isRight ? `
                    <div style="font-size:.88rem;margin-top:6px;">
                      <strong>Correct Answer:</strong>
                      ${escapeHTML(ex.ans)}
                    </div>
                  ` : ""}
                `}

                ${ex.steps ? `
                  <details style="margin-top:10px;">
                    <summary style="cursor:pointer;font-weight:700;">
                      View Solution
                    </summary>
                    <div style="margin-top:8px;white-space:pre-wrap;font-size:.88rem;">
                      ${escapeHTML(ex.steps)}
                    </div>
                  </details>
                ` : ""}

              </div>
            ` : ""}

          </article>
        `;
      }).join("")}

      <div class="sp-card" style="padding:16px;">

        ${!qt.submitted ? `
          <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:12px;">
            Review your answers before submitting.
          </div>

          <button
            class="sp-btn sp-btn-success"
            style="width:100%;"
            onclick="window.SP.submitQuickTest()">
            ✓ Submit Chapter Test
          </button>

        ` : `
          <div style="text-align:center;padding:8px 0;">
            <div style="font-size:2rem;">${gradableQs.length && score === gradableQs.length ? "🏆" : "📊"}</div>

            <h3 style="margin:8px 0;">
              Test Completed
            </h3>

            ${gradableQs.length ? `
              <div style="font-size:1.8rem;font-weight:900;color:var(--accent-primary);">
                ${score} / ${gradableQs.length}
              </div>
              <div style="font-size:.85rem;color:var(--text-muted);">
                Auto-gradable questions
              </div>
            ` : `
              <div style="font-size:.9rem;color:var(--text-muted);">
                No supplied answer keys were available for automatic grading.
              </div>
            `}

            <div style="font-size:.82rem;color:var(--text-secondary);margin-top:8px;">
              ${testQs.length - gradableQs.length} question(s) may require teacher review.
            </div>
          </div>

          <button
            class="sp-btn sp-btn-primary"
            style="width:100%;margin-top:12px;"
            onclick="window.SP.resetQuickTest()">
            ↻ Retake Chapter Test
          </button>
        `}

      </div>

    </div>
  `;
}
async function renderBooksManager() {
  const { books, chapters } = state.curriculum;
  const items = await Promise.all(books.map(async (b) => {
    const dl = await isBookOfflineDownloaded(b);
    const chCount = chapters.filter((c) => c.bookId === b.id).length;
    return { b, dl, chCount };
  }));
  return `
    <div class="sp-container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h2 style="margin:0;">📥 My Textbooks & Offline Download Manager</h2>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.setView('home')">← Dashboard</button>
      </div>
      <div class="sp-grid-auto">
        ${items.map(({ b, dl, chCount }) => `
          <div class="sp-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
            <div style="display:flex;gap:12px;align-items:center;">
              ${renderSubjectSVG(b.subjectIcon, 48)}
              <div>
                <div style="font-weight:800;">${b.title}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${b.publisher} · ${chCount} Chapter(s)</div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="sp-badge" style="background:${dl ? "#d1fae5" : "#f1f5f9"};color:${dl ? "#065f46" : "#475569"};">${dl ? "✓ Available Offline" : "Not Downloaded"}</span>
              <div style="display:flex;gap:6px;"><button class="sp-btn sp-btn-primary" style="min-height:36px;padding:0 12px;font-size:12px;" onclick="window.SP.openSubject('${b.subjectId}')">Read Book</button><button class="sp-btn ${dl ? "sp-btn-secondary" : "sp-btn-success"}" style="min-height:36px;padding:0 12px;font-size:12px;" onclick="window.SP.toggleOfflineBook('${b.id}')">${dl ? "Offline ✓" : "Download"}</button></div>
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
            <select id="mockSub" class="sp-select"><option value="ALL">All Subjects (${questions.length} Qs)</option>${subjects.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select>
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
          <h3 style="margin-top:0;">📈 Exam & Game History (${attempts.length})</h3>
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
  openSubject: (subId) => {
    state.selectedSubjectId = subId;
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
    state.quickTest = { answers: {}, submitted: false };
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
      state.profile.xp = (state.profile.xp || 0) + 20;
      state.profile.coins = (state.profile.coins || 0) + 10;
      await dbPut("studentProfiles", state.profile);
      await enqueueSyncRecord(state.profile.studentId, "lesson_complete", rec, progressId);
      showToast("Lesson completed! +20 XP & +10 Coins", "success");
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
      state.profile.xp = (state.profile.xp || 0) + 5;
      await dbPut("studentProfiles", state.profile);
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
        state.profile.xp = (state.profile.xp || 0) + 15;
        state.profile.coins = (state.profile.coins || 0) + 10;
        await dbPut("studentProfiles", state.profile);
      }
    } else {
      gs.matchFeedback = "❌ Not a match — try again!";
    }
    render();
  },
  setQuickTestAns: (qId, val) => { state.quickTest.answers[qId] = val; render(); },
  submitQuickTest: () => { state.quickTest.submitted = true; render(); },
  resetQuickTest: () => { state.quickTest = { answers: {}, submitted: false }; render(); },
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
      gs.round = generateGameRound(gs.activeGame.gameType, gs.level);
    } else {
      const { earnedCoins } = await recordGameCompletion(state.profile, gs.activeGame, gs.score, 3);
      showToast(`Game finished! Score ${gs.score}/3 · +${earnedCoins} Coins!`, "success");
      gs.level = 1;
      gs.score = 0;
      gs.round = generateGameRound(gs.activeGame.gameType, 1);
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
        if (parsed.chapters?.length) await dbBulkPut("chapters", parsed.chapters);
        if (parsed.questions?.length) await dbBulkPut("questions", parsed.questions);
        showToast("JSON curriculum pack imported!", "success");
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
  exportFullJSON: async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      textbooks: await dbGetAll("textbooks"),
      chapters: await dbGetAll("chapters"),
      questions: await dbGetAll("questions"),
      studentProfiles: await dbGetAll("studentProfiles")
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `scholars-point-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }
};

document.addEventListener("DOMContentLoaded", bootstrap);
