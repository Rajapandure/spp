import { initRoughSlate } from "./components/roughSlate.js";
import {
  savePack,
  getPack,
  listPacks,
  deletePack,
  getStudentState,
  saveStudentState,
  addMistake,
  listMistakes
} from "./db/indexedDb.js";

let student = null;
let activePack = null;

function showToast(msg, bg = "#2563eb") {
  const el = document.getElementById("sp-toast");
  if (!el) return;
  el.textContent = msg;
  el.style.background = bg;
  el.style.display = "block";
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.display = "none"; }, 2800);
}

async function ensureStarterPack() {
  let pack = await getPack("class-6-ncert-mp-starter");
  if (!pack) {
    try {
      const res = await fetch("./data/packs/class6-starter.json");
      if (res.ok) {
        pack = await res.json();
        await savePack(pack);
      }
    } catch (e) {
      console.warn("Offline fallback: starter pack not fetched yet", e);
    }
  }
  activePack = pack;
}

function updateHeroAndHeader() {
  if (!student) return;
  const hour = new Date().getHours();
  const greetWord = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greetEl = document.getElementById("sp-greeting");
  const pillEl = document.getElementById("sp-class-pill");
  const xpEl = document.getElementById("sp-xp-value");
  const levelEl = document.getElementById("sp-level-badge");
  const nextEl = document.getElementById("sp-next-level");
  const remEl = document.getElementById("sp-xp-remaining");
  const fillEl = document.getElementById("sp-xp-fill");
  const streakEl = document.getElementById("sp-streak-label");

  if (greetEl) greetEl.textContent = `${greetWord}, ${student.name}! 👋`;
  if (pillEl) pillEl.textContent = `Class ${student.grade} • ${student.board} • ${student.medium} • 2026-27`;

  const level = Math.floor(student.xp / 200) + 1;
  const nextLevelXp = level * 200;
  const rem = nextLevelXp - student.xp;
  const pct = Math.min(100, Math.round(((student.xp % 200) / 200) * 100));

  if (xpEl) xpEl.innerHTML = `${student.xp} <span>XP</span>`;
  if (levelEl) levelEl.textContent = `⭐ Level ${level}`;
  if (nextEl) nextEl.textContent = `Next Level: ${nextLevelXp} XP`;
  if (remEl) remEl.textContent = `⭐ ${rem} XP to next level`;
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (streakEl) streakEl.textContent = `🔥 ${student.streak}-day streak`;
}

function switchView(viewName) {
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
  });

  const homeView = document.getElementById("sp-view-home");
  const dynView = document.getElementById("sp-view-dynamic");

  if (viewName === "home") {
    homeView.style.display = "block";
    dynView.style.display = "none";
    return;
  }

  homeView.style.display = "none";
  dynView.style.display = "block";

  if (viewName === "subjects") renderSubjectsView();
  else if (viewName === "tasks") renderTasksView();
  else if (viewName === "progress") renderProgressView();
  else if (viewName === "profile") renderProfileView();
}

function renderSubjectsView(selectedSubjectId = null) {
  const dynView = document.getElementById("sp-view-dynamic");
  const subjects = activePack?.subjects || [];

  if (selectedSubjectId) {
    const subj = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
    if (!subj) return;
    dynView.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
        <button class="sp-btn sp-btn-secondary" id="sp-back-subjects">← Back to Subjects</button>
        <button class="sp-btn sp-btn-warm" onclick="window.SP.openRoughSlate()">✏️ Open Rough Slate</button>
      </div>
      <div class="sp-card" style="padding:20px;margin-bottom:16px;">
        <h2 class="sp-chapter-head" style="margin:0 0 4px;">${subj.icon} ${subj.name} — Class ${student.grade}</h2>
        <p style="margin:0;color:var(--text-muted);font-size:0.86rem;">Offline-ready chapters, worked examples, and interactive quizzes.</p>
      </div>
      <div style="display:grid;gap:14px;">
        ${subj.chapters.map((ch) => `
          <div class="sp-card" style="padding:18px;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <h3 class="sp-chapter-head" style="margin:0;font-size:1.05rem;">Chapter ${ch.number}: ${ch.title}</h3>
              <span class="sp-badge" style="background:#dbeafe;color:#1e40af;">${ch.quiz.length} Practice Qs</span>
            </div>
            <p style="color:var(--text-secondary);font-size:0.88rem;margin:8px 0 12px;">${ch.summary}</p>
            <div style="background:var(--bg-muted);padding:12px 14px;border-radius:12px;margin-bottom:12px;">
              <strong style="font-size:0.82rem;display:block;margin-bottom:6px;">📌 Key Concepts:</strong>
              <ul style="margin:0;padding-left:18px;font-size:0.84rem;color:var(--text-secondary);">
                ${ch.keyPoints.map((kp) => `<li style="margin-bottom:4px;">${kp}</li>`).join("")}
              </ul>
            </div>
            <div style="background:#fffbeb;border:1px solid #fde68a;color:#1e293b;padding:12px 14px;border-radius:12px;margin-bottom:14px;">
              <strong style="font-size:0.82rem;display:block;margin-bottom:4px;">💡 Worked Example: ${ch.workedExample.question}</strong>
              <ol style="margin:4px 0 0;padding-left:18px;font-size:0.83rem;">
                ${ch.workedExample.steps.map((st) => `<li>${st}</li>`).join("")}
              </ol>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <button class="sp-btn sp-btn-primary" data-start-quiz="${subj.id}:${ch.id}">🎯 Practice Quiz (+25 XP)</button>
              <button class="sp-btn sp-btn-secondary" onclick="window.SP.openRoughSlate()">✏️ Solve on Slate</button>
            </div>
            <div id="quiz-box-${ch.id}" style="margin-top:12px;"></div>
          </div>
        `).join("")}
      </div>
    `;

    document.getElementById("sp-back-subjects")?.addEventListener("click", () => renderSubjectsView(null));
    dynView.querySelectorAll("[data-start-quiz]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [sId, cId] = btn.getAttribute("data-start-quiz").split(":");
        renderChapterQuiz(sId, cId);
      });
    });
    return;
  }

  dynView.innerHTML = `
    <div class="sp-section-head" style="margin-top:0;">
      <h2 class="sp-section-title">📚 All Subjects (Class ${student.grade} • ${student.board})</h2>
      <button class="sp-btn sp-btn-secondary" style="min-height:36px;font-size:0.8rem;" onclick="window.SP.openPacksModal()">📥 Manage Offline Packs</button>
    </div>
    <div class="sp-subject-grid">
      ${subjects.map((s) => `
        <article class="sp-subject-card ${s.tint}">
          <div class="sp-subject-icon" style="font-size:1.5rem;">${s.icon}</div>
          <h3>${s.name}</h3>
          <div class="sp-subject-meta">${s.chapters.length} Offline Chapters Ready</div>
          <button class="sp-btn sp-btn-subject" data-open-subject="${s.id}">Open Chapters →</button>
        </article>
      `).join("")}
    </div>
  `;

  dynView.querySelectorAll("[data-open-subject]").forEach((btn) => {
    btn.addEventListener("click", () => renderSubjectsView(btn.getAttribute("data-open-subject")));
  });
}

function renderChapterQuiz(subjectId, chapterId) {
  const subj = activePack?.subjects.find((s) => s.id === subjectId);
  const ch = subj?.chapters.find((c) => c.id === chapterId);
  const box = document.getElementById(`quiz-box-${chapterId}`);
  if (!ch || !box) return;

  box.innerHTML = `
    <div style="border-top:1px solid var(--border-subtle);padding-top:12px;">
      ${ch.quiz.map((q, idx) => `
        <div style="margin-bottom:12px;padding:12px;border-radius:12px;background:var(--bg-muted);">
          <strong style="font-size:0.88rem;display:block;margin-bottom:8px;">Q${idx + 1}. ${q.q}</strong>
          <div style="display:grid;gap:6px;">
            ${q.options.map((opt, oIdx) => `
              <button class="sp-btn sp-btn-secondary" style="justify-content:flex-start;min-height:36px;font-size:0.82rem;" data-q-ans="${idx}:${oIdx}">
                ${String.fromCharCode(65 + oIdx)}. ${opt}
              </button>
            `).join("")}
          </div>
          <div id="q-feedback-${chapterId}-${idx}" style="margin-top:6px;font-size:0.8rem;font-weight:700;"></div>
        </div>
      `).join("")}
    </div>
  `;

  box.querySelectorAll("[data-q-ans]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const [qIdx, oIdx] = btn.getAttribute("data-q-ans").split(":").map(Number);
      const question = ch.quiz[qIdx];
      const fb = document.getElementById(`q-feedback-${chapterId}-${qIdx}`);
      if (oIdx === question.answer) {
        fb.style.color = "#10b981";
        fb.textContent = `✅ Correct! (+25 XP) — ${question.explanation}`;
        student.xp += 25;
        await saveStudentState(student);
        updateHeroAndHeader();
        showToast("+25 XP Earned!", "#10b981");
      } else {
        fb.style.color = "#f43f5e";
        fb.textContent = `❌ Incorrect. Saved to Mistake Notebook. — ${question.explanation}`;
        await addMistake({
          subject: subj.name,
          chapter: ch.title,
          question: question.q,
          correctAnswer: question.options[question.answer],
          explanation: question.explanation
        });
        showToast("Added to Mistake Notebook", "#f43f5e");
      }
    });
  });
}

async function renderTasksView() {
  const dynView = document.getElementById("sp-view-dynamic");
  const mistakes = await listMistakes();
  dynView.innerHTML = `
    <div class="sp-card" style="padding:20px;margin-bottom:16px;">
      <h2 class="sp-chapter-head" style="margin:0 0 10px;">📝 Daily Study Tasks & Revision</h2>
      <div class="sp-task-card">
        <span style="font-size:1.5rem;">🧮</span>
        <div style="flex:1;">
          <strong>Complete Whole Numbers Quiz</strong>
          <small>Mathematics • Chapter 2 • +25 XP</small>
        </div>
        <button class="sp-btn sp-btn-primary" style="min-height:36px;font-size:0.8rem;" data-jump-subj="math">Start</button>
      </div>
      <div class="sp-task-card">
        <span style="font-size:1.5rem;">🧪</span>
        <div style="flex:1;">
          <strong>Revise Components of Food</strong>
          <small>Science • Chapter 1 • +25 XP</small>
        </div>
        <button class="sp-btn sp-btn-primary" style="min-height:36px;font-size:0.8rem;" data-jump-subj="science">Start</button>
      </div>
    </div>
    <div class="sp-card" style="padding:20px;">
      <h3 class="sp-chapter-head" style="margin:0 0 10px;">📕 Mistake Notebook (${mistakes.length})</h3>
      ${mistakes.length === 0 ? `<p style="color:var(--text-muted);font-size:0.86rem;margin:0;">No mistakes recorded yet. Wrong quiz answers automatically appear here for smart revision!</p>` : `
        <div style="display:grid;gap:10px;">
          ${mistakes.map((m) => `
            <div style="padding:12px;border-radius:12px;background:var(--bg-muted);">
              <span class="sp-badge" style="background:#fee2e2;color:#b91c1c;margin-bottom:4px;">${m.subject} • ${m.chapter}</span>
              <strong style="display:block;font-size:0.86rem;">${m.question}</strong>
              <small style="color:#10b981;font-weight:700;">Correct Answer: ${m.correctAnswer}</small>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `;
  dynView.querySelectorAll("[data-jump-subj]").forEach((b) => {
    b.addEventListener("click", () => {
      switchView("subjects");
      renderSubjectsView(b.getAttribute("data-jump-subj"));
    });
  });
}

function renderProgressView() {
  const dynView = document.getElementById("sp-view-dynamic");
  dynView.innerHTML = `
    <div class="sp-card" style="padding:20px;margin-bottom:16px;">
      <h2 class="sp-chapter-head" style="margin:0 0 8px;">📊 Student Mastery & XP Progress</h2>
      <p style="margin:0 0 14px;color:var(--text-muted);font-size:0.86rem;">Total XP: <strong>${student.xp} XP</strong> • Active Streak: <strong>${student.streak} Days 🔥</strong></p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
        <div class="sp-badge-card"><span style="font-size:1.8rem;">🔥</span><strong>5-Day Streak</strong><small>Studied 5 days in a row</small></div>
        <div class="sp-badge-card"><span style="font-size:1.8rem;">🥇</span><strong>Quiz Champion</strong><small>Scored 100% in Maths</small></div>
        <div class="sp-badge-card"><span style="font-size:1.8rem;">🎯</span><strong>Perfect Score</strong><small>Zero mistakes in Science</small></div>
        <div class="sp-badge-card locked"><span style="font-size:1.8rem;">🚀</span><strong>1000 XP Club</strong><small>Reach 1000 XP to unlock</small></div>
      </div>
    </div>
  `;
}

function renderProfileView() {
  const dynView = document.getElementById("sp-view-dynamic");
  dynView.innerHTML = `
    <div class="sp-card" style="padding:20px;max-width:540px;">
      <h2 class="sp-chapter-head" style="margin:0 0 14px;">👤 Student Profile Settings</h2>
      <div style="display:grid;gap:12px;">
        <div>
          <label style="font-size:0.8rem;font-weight:700;display:block;margin-bottom:4px;">Student Name</label>
          <input class="sp-input" id="prof-name" value="${student.name}" />
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:700;display:block;margin-bottom:4px;">Class (1 to 10)</label>
          <select class="sp-select" id="prof-grade">
            ${[1,2,3,4,5,6,7,8,9,10].map((g) => `<option value="${g}" ${Number(student.grade) === g ? "selected" : ""}>Class ${g}</option>`).join("")}
          </select>
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:700;display:block;margin-bottom:4px;">Board</label>
          <select class="sp-select" id="prof-board">
            <option ${student.board === "MP Board" ? "selected" : ""}>MP Board</option>
            <option ${student.board === "CBSE" ? "selected" : ""}>CBSE</option>
            <option ${student.board === "NCERT" ? "selected" : ""}>NCERT</option>
          </select>
        </div>
        <button class="sp-btn sp-btn-primary" id="prof-save-btn">Save Profile</button>
      </div>
    </div>
  `;
  document.getElementById("prof-save-btn")?.addEventListener("click", async () => {
    student.name = document.getElementById("prof-name").value.trim() || "Aarav";
    student.grade = Number(document.getElementById("prof-grade").value);
    student.board = document.getElementById("prof-board").value;
    await saveStudentState(student);
    updateHeroAndHeader();
    showToast("Profile updated!", "#10b981");
  });
}

async function openPacksModal() {
  const modal = document.getElementById("sp-packs-modal");
  const listEl = document.getElementById("sp-packs-list");
  if (!modal || !listEl) return;

  const installed = await listPacks();
  const isStarterInstalled = installed.some((p) => p.packId === "class-6-ncert-mp-starter");

  listEl.innerHTML = `
    <div class="sp-card" style="padding:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
      <div>
        <strong style="display:block;font-size:0.9rem;">Class 6 Core Pack (NCERT & MP Board)</strong>
        <small style="color:var(--text-muted);">Maths, Science, English & Hindi • Offline IndexedDB Storage</small>
      </div>
      <div style="display:flex;gap:8px;">
        ${isStarterInstalled
          ? `<span class="sp-badge" style="background:#d1fae5;color:#065f46;">✓ Downloaded</span>
             <button class="sp-btn sp-btn-danger" style="min-height:34px;font-size:0.78rem;" id="sp-del-pack">Remove</button>`
          : `<button class="sp-btn sp-btn-primary" style="min-height:34px;font-size:0.78rem;" id="sp-dl-pack">Download Pack</button>`}
      </div>
    </div>
  `;

  document.getElementById("sp-dl-pack")?.addEventListener("click", async () => {
    await ensureStarterPack();
    showToast("Offline pack saved to IndexedDB!", "#10b981");
    openPacksModal();
  });

  document.getElementById("sp-del-pack")?.addEventListener("click", async () => {
    await deletePack("class-6-ncert-mp-starter");
    activePack = null;
    showToast("Offline pack removed.", "#f59e0b");
    openPacksModal();
  });

  modal.style.display = "flex";
}

window.SP = window.SP || {};
window.SP.openPacksModal = openPacksModal;
window.SP.closePacksModal = () => {
  const modal = document.getElementById("sp-packs-modal");
  if (modal) modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", async () => {
  initRoughSlate();
  student = await getStudentState();
  await ensureStarterPack();
  updateHeroAndHeader();

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", () => switchView(el.getAttribute("data-view")));
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(el.getAttribute("data-nav"));
    });
  });

  document.querySelectorAll("[data-open-subject]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const subjId = el.getAttribute("data-open-subject");
      switchView("subjects");
      renderSubjectsView(subjId);
    });
  });

  document.getElementById("sp-continue-btn")?.addEventListener("click", () => {
    switchView("subjects");
    renderSubjectsView("math");
  });

  document.getElementById("sp-open-slate-btn")?.addEventListener("click", () => window.SP.openRoughSlate());
  document.getElementById("sp-slate-top-btn")?.addEventListener("click", () => window.SP.openRoughSlate());
  document.getElementById("sp-open-packs-btn")?.addEventListener("click", () => openPacksModal());

  document.querySelectorAll("[data-shortcut]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const action = tile.getAttribute("data-shortcut");
      if (action === "slate") window.SP.openRoughSlate();
      else if (action === "packs") openPacksModal();
      else if (action === "mistakes" || action === "mock") switchView("tasks");
    });
  });
});
