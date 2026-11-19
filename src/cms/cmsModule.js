// Teacher & Admin CMS Module: Student Management, Content Workflow (Draft -> Review -> Approved -> Published), JSON/CSV Import, Completeness Tracker
import { dbGet, dbGetAll, dbPut } from "../db/database.js";
import { listAllStudentsForCMS, registerStudent, resetStudentPinByTeacher } from "../auth/auth.js";
import { computeChapterCompleteness, CONTENT_STATUSES, validateCurriculumIntegrity } from "../curriculum/curriculumService.js";
import { escapeHTML } from "../ui/sanitize.js";
import { ACADEMIC_SESSIONS, BOARDS, MEDIUMS } from "../config/classes.js";

export async function renderCMSDashboardHTML(teacherProfile, activeTab = "content") {
  const [students, books, chapters, questions, attempts, assessments, assignments, selfRegSetting] = await Promise.all([
    listAllStudentsForCMS(),
    dbGetAll("textbooks"),
    dbGetAll("chapters"),
    dbGetAll("questions"),
    dbGetAll("studentAttempts"),
    dbGetAll("assessments"),
    dbGetAll("assignments"),
    dbGet("settings", "selfRegistrationEnabled")
  ]);

  const selfReg = selfRegSetting ? Boolean(selfRegSetting.value) : true;
  const pendingExams = attempts.filter((a) => a.type === "mock_exam" && a.evaluationStatus === "pending_teacher_review");

  return `
    <div class="sp-container">
      <div class="sp-card" style="padding:20px;margin-bottom:16px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <span class="sp-badge" style="background:#fef3c7;color:#92400e;">🛡️ Teacher & Admin CMS</span>
          <h2 style="margin:6px 0 2px;font-size:1.25rem;">Welcome, ${teacherProfile ? teacherProfile.name : "Admin"}</h2>
          <div style="font-size:0.85rem;color:var(--text-muted);">Manage student accounts, curriculum workflow (Draft → Review → Approved → Published), JSON/CSV import & descriptive exam grading.</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="sp-btn sp-btn-secondary" onclick="window.SP.exportFullJSON()">⬇️ Complete Backup JSON</button>
          <button class="sp-btn sp-btn-danger" onclick="window.SP.logout()">Logout</button>
        </div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <button class="sp-btn ${activeTab === "content" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('content')">📚 Curriculum & Workflow (${chapters.length})</button>
        <button class="sp-btn ${activeTab === "students" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('students')">👩‍🎓 Students (${students.length})</button>
        <button class="sp-btn ${activeTab === "assignments" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('assignments')">📋 Assignments (${assignments.length})</button>
        <button class="sp-btn ${activeTab === "import" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('import')">📥 Import / Restore</button>
        <button class="sp-btn ${activeTab === "exams" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('exams')">📄 Exam Papers (${assessments.length})</button>
        <button class="sp-btn ${activeTab === "grading" ? "sp-btn-primary" : "sp-btn-secondary"}" onclick="window.SP.setCMSTab('grading')">📝 Descriptive Grading (${pendingExams.length})</button>
      </div>

      ${activeTab === "content" ? renderCMSContentTab(books, chapters, questions) : ""}
      ${activeTab === "students" ? renderCMSStudentsTab(students, selfReg) : ""}
      ${activeTab === "assignments" ? renderCMSAssignmentsTab(assignments) : ""}
      ${activeTab === "import" ? renderCMSImportTab() : ""}
      ${activeTab === "exams" ? renderCMSExamsTab(assessments, questions) : ""}
      ${activeTab === "grading" ? renderCMSGradingTab(pendingExams) : ""}
    </div>
  `;
}

function renderCMSContentTab(books, chapters, questions) {
  const valReport = validateCurriculumIntegrity(chapters, questions);
  return `
    <div style="display:grid;gap:16px;">
      <div class="sp-card" style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <strong>🛡️ Curriculum Validation Report</strong>
          <span class="sp-badge" style="background:${valReport.issues.length === 0 ? "#d1fae5" : "#fef3c7"};color:${valReport.issues.length === 0 ? "#065f46" : "#92400e"};">${valReport.issues.length} Issue(s) Detected</span>
        </div>
        <div style="font-size:0.84rem;color:var(--text-secondary);margin-top:6px;">
          Chapters: <strong>${valReport.verifiedChapters}</strong> Verified · <strong>${valReport.generatedChapters}</strong> Generated Supplementary | Questions: <strong>${valReport.verifiedQuestions}</strong> Verified · <strong>${valReport.generatedQuestions}</strong> Generated Supplementary
        </div>
      </div>
      <div class="sp-card" style="padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
          <h3 style="margin:0;">Create / Publish Chapter</h3>
          <button class="sp-btn sp-btn-primary" onclick="window.SP.openCMSChapterForm()">+ New Chapter</button>
        </div>
        <div id="cmsChapterFormSlot" style="display:none;margin-bottom:16px;padding:14px;background:var(--bg-muted);border-radius:14px;">
          <form onsubmit="window.SP.saveCMSChapter(event)" style="display:grid;gap:10px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
              <div>
                <label style="font-size:12px;font-weight:700;">Class (1–10)</label>
                <select id="cmsChClass" class="sp-select">${Array.from({length:10},(_,i)=>`<option value="${i+1}">Class ${i+1}</option>`).join("")}</select>
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Board</label>
                <select id="cmsChBoard" class="sp-select">${Object.values(BOARDS).map(b=>`<option value="${b.id}">${b.name}</option>`).join("")}</select>
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Medium</label>
                <select id="cmsChMedium" class="sp-select">${Object.values(MEDIUMS).map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}</select>
              </div>
              <div>
                <label style="font-size:12px;font-weight:700;">Subject</label>
                <select id="cmsChSubject" class="sp-select">
                  <option value="maths">Mathematics</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="evs">EVS</option>
                  <option value="science">Science</option>
                  <option value="social">Social Science</option>
                </select>
              </div>
            </div>
            <input id="cmsChTitle" class="sp-input" placeholder="Chapter Title (e.g. Chapter 2: Polynomials)" required />
            <input id="cmsChIntro" class="sp-input" placeholder="Short Introduction" required />
            <textarea id="cmsChExplanation" class="sp-textarea" rows="3" placeholder="Complete Chapter Explanation..." required></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <select id="cmsChStatus" class="sp-select">
                <option value="Draft">Draft</option>
                <option value="Review">Review</option>
                <option value="Approved">Approved</option>
                <option value="Published">Published</option>
              </select>
              <button type="submit" class="sp-btn sp-btn-success">Save Chapter</button>
            </div>
          </form>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.86rem;">
            <thead>
              <tr style="text-align:left;border-bottom:2px solid var(--border-subtle);color:var(--text-muted);">
                <th style="padding:8px;">Class / Board / Med</th>
                <th style="padding:8px;">Chapter Title</th>
                <th style="padding:8px;">Completeness</th>
                <th style="padding:8px;">Workflow Status</th>
                <th style="padding:8px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${chapters.map((c) => {
                const cQs = questions.filter((q) => q.chapterId === c.id);
                const comp = computeChapterCompleteness(c, cQs);
                const badgeBg = c.status === "Published" ? "#d1fae5" : c.status === "Approved" ? "#dbeafe" : "#fef3c7";
                const badgeCol = c.status === "Published" ? "#065f46" : c.status === "Approved" ? "#1e40af" : "#92400e";
                return `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:8px;">Class ${c.classNum} · ${c.board} · ${c.medium}</td>
                    <td style="padding:8px;font-weight:700;">${escapeHTML(c.title)} <div style="font-size:11px;color:var(--text-muted);">${escapeHTML(c.verificationStatus || c.status)}</div></td>
                    <td style="padding:8px;">
                      <span style="font-weight:700;color:${comp.score >= 75 ? "#059669" : "#d97706"};">${comp.score}%</span>
                      <div style="font-size:11px;color:var(--text-muted);">${cQs.length} Qs ${comp.missing.length ? "· Missing: " + comp.missing.join(", ") : ""}</div>
                    </td>
                    <td style="padding:8px;"><span class="sp-badge" style="background:${badgeBg};color:${badgeCol};">${c.status}</span></td>
                    <td style="padding:8px;display:flex;gap:6px;flex-wrap:wrap;">
                      <select onchange="window.SP.updateChapterStatus('${c.id}', this.value)" class="sp-select" style="width:auto;padding:4px 8px;font-size:12px;">
                        ${CONTENT_STATUSES.map((st) => `<option value="${st}" ${(c.verificationStatus || c.status) === st ? "selected" : ""}>${st}</option>`).join("")}
                      </select>
                      <button class="sp-btn sp-btn-secondary" style="min-height:30px;padding:0 10px;font-size:12px;" onclick="window.SP.openCMSQuestionForm('${c.id}')">+ Q</button>
                      <button class="sp-btn sp-btn-secondary" style="min-height:30px;padding:0 10px;font-size:12px;" onclick="window.SP.openCMSExPlayEditor('${c.id}')">✏️ Ex/Playcards</button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div id="cmsExPlayEditorSlot" class="sp-card" style="display:none;padding:18px;"></div>
      <div id="cmsQuestionModalSlot" class="sp-card" style="display:none;padding:18px;">
        <h3 style="margin-top:0;">Add Question to Chapter</h3>
        <form onsubmit="window.SP.saveCMSQuestion(event)" style="display:grid;gap:10px;">
          <input type="hidden" id="cmsQChapterId" />
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <select id="cmsQType" class="sp-select"><option value="MCQ">MCQ</option><option value="TF">True/False</option><option value="FILL">Fill in the Blank</option><option value="SHORT">Short Answer (2 Marks)</option></select>
            <select id="cmsQDiff" class="sp-select"><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
          </div>
          <textarea id="cmsQText" class="sp-textarea" rows="2" placeholder="Question text..." required></textarea>
          <input id="cmsQOptions" class="sp-input" placeholder="Options separated by | (for MCQ, e.g. 2|4|6|8)" />
          <input id="cmsQAns" class="sp-input" placeholder="Correct Answer" required />
          <textarea id="cmsQSol" class="sp-textarea" rows="2" placeholder="Step-by-step Solution & Explanation" required></textarea>
          <button type="submit" class="sp-btn sp-btn-success">Save Question to Bank</button>
        </form>
      </div>
    </div>
  `;
}

function renderCMSStudentsTab(students, selfReg) {
  return `
    <div class="sp-card" style="padding:18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <h3 style="margin:0;">Student Accounts</h3>
          <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;margin-top:4px;cursor:pointer;">
            <input type="checkbox" ${selfReg ? "checked" : ""} onchange="window.SP.toggleSelfReg(this.checked)" />
            Allow Student Self-Registration
          </label>
        </div>
        <button class="sp-btn sp-btn-primary" onclick="document.getElementById('cmsNewStudentForm').style.display='grid'">+ Create Student Account</button>
      </div>

      <form id="cmsNewStudentForm" onsubmit="window.SP.createStudentFromCMS(event)" style="display:none;gap:10px;padding:14px;background:var(--bg-muted);border-radius:14px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">
          <input id="cmsStuName" class="sp-input" placeholder="Student Full Name" required />
          <input id="cmsStuUser" class="sp-input" placeholder="Username" required />
          <input id="cmsStuPin" class="sp-input" placeholder="PIN/Password (min 4)" minlength="4" required />
          <select id="cmsStuClass" class="sp-select">${Array.from({length:10},(_,i)=>`<option value="${i+1}">Class ${i+1}</option>`).join("")}</select>
          <select id="cmsStuBoard" class="sp-select">${Object.values(BOARDS).map(b=>`<option value="${b.id}">${b.name}</option>`).join("")}</select>
          <select id="cmsStuMed" class="sp-select">${Object.values(MEDIUMS).map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}</select>
        </div>
        <button type="submit" class="sp-btn sp-btn-success">Create Student</button>
      </form>

      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.86rem;">
          <thead>
            <tr style="text-align:left;border-bottom:2px solid var(--border-subtle);color:var(--text-muted);">
              <th style="padding:8px;">Student ID</th>
              <th style="padding:8px;">Name & Username</th>
              <th style="padding:8px;">Class / Board / Med</th>
              <th style="padding:8px;">XP / Coins</th>
              <th style="padding:8px;">Reset PIN</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((s) => `
              <tr style="border-bottom:1px solid var(--border-subtle);">
                <td style="padding:8px;font-family:monospace;font-weight:700;">${s.studentId}</td>
                <td style="padding:8px;"><strong>${s.name}</strong> <span style="color:var(--text-muted);">(@${s.username})</span></td>
                <td style="padding:8px;">Class ${s.classNum} · ${s.board} · ${s.medium}</td>
                <td style="padding:8px;">${s.xp || 0} XP · 🪙 ${s.coins || 0}</td>
                <td style="padding:8px;">
                  <button class="sp-btn sp-btn-secondary" style="min-height:30px;padding:0 10px;font-size:12px;" onclick="window.SP.resetStudentPinPrompt('${s.studentId}')">🔑 Reset PIN</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCMSImportTab() {
  return `
    <div class="sp-card" style="padding:18px;">
      <h3 style="margin-top:0;">Structured JSON / CSV Curriculum Import</h3>
      <p style="font-size:0.88rem;color:var(--text-muted);">Paste JSON (<code>{"chapters":[...],"questions":[...]}</code>) or CSV questions (<code>chapterId,type,difficulty,marks,q,options,ans,explanation</code>) to import offline content packs.</p>
      <textarea id="cmsImportBox" class="sp-textarea" rows="8" placeholder='{"questions":[{"id":"q-custom-1","chapterId":"ch-c10-mp-en-math-1","type":"MCQ","difficulty":"Easy","marks":1,"q":"HCF of 8 and 12 is:","options":["2","4","8","12"],"ans":"4","explanation":"Common factors are 1,2,4; highest is 4."}]}'></textarea>
      <div style="margin-top:10px;display:flex;gap:10px;">
        <button class="sp-btn sp-btn-primary" onclick="window.SP.runCMSImport('json')">Import JSON</button>
        <button class="sp-btn sp-btn-secondary" onclick="window.SP.runCMSImport('csv')">Import CSV Questions</button>
      </div>
    </div>
    <div class="sp-card" style="padding:18px;margin-top:16px;">
      <h3 style="margin-top:0;">🔄 Complete Backup & Restore</h3>
      <p style="font-size:0.86rem;color:var(--text-muted);">Select a <code>scholars-point-backup-*.json</code> file to preview, merge, or replace local data (creates an automatic safety backup before replacing).</p>
      <input type="file" id="cmsBackupFileInput" accept=".json" class="sp-input" onchange="window.SP.previewBackupFile(event)" />
      <div id="cmsBackupPreviewSlot" style="margin-top:12px;"></div>
    </div>
  `;
}

function renderCMSGradingTab(pendingExams) {
  if (!pendingExams.length) {
    return `<div class="sp-card" style="padding:24px;text-align:center;color:var(--text-muted);">No descriptive exam answers pending evaluation.</div>`;
  }
  return `
    <div style="display:grid;gap:12px;">
      ${pendingExams.map((ex) => `
        <div class="sp-card" style="padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${ex.studentName} (${ex.studentId}) — ${ex.title}</strong>
            <span class="sp-badge" style="background:#fef3c7;color:#92400e;">Objective: ${ex.earnedObjectiveMarks}/${ex.objectiveMarks} · ${ex.descriptiveCount} Descriptive Pending</span>
          </div>
          <div style="margin-top:10px;display:grid;gap:8px;">
            ${ex.breakdown.filter((b) => !b.isObjective).map((b) => `
              <div style="padding:10px;background:var(--bg-muted);border-radius:10px;">
                <div style="font-weight:700;">Q (${b.q.marks} Marks): ${b.q.q}</div>
                <div style="margin-top:4px;font-size:0.88rem;"><strong>Student Answer:</strong> ${b.given || "(Blank)"}</div>
                <div style="margin-top:4px;font-size:0.85rem;color:#059669;"><strong>Model Key:</strong> ${b.q.ans}</div>
              </div>
            `).join("")}
          </div>
          <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
            <input type="number" id="gradeMarks_${ex.attemptId}" class="sp-input" style="max-width:140px;" placeholder="Marks" min="0" />
            <button class="sp-btn sp-btn-success" onclick="window.SP.submitDescriptiveGrade('${ex.attemptId}')">Approve & Finalize Score</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCMSExamsTab(assessments, questions) {
  return `
    <div style="display:grid;gap:16px;">
      <div class="sp-card" style="padding:18px;">
        <h3 style="margin-top:0;">📄 Create Custom Exam / Mock Paper</h3>
        <form onsubmit="window.SP.saveCMSExamPaper(event)" style="display:grid;gap:10px;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">
            <select id="cmsExClass" class="sp-select">${Array.from({length:10},(_,i)=>`<option value="${i+1}">Class ${i+1}</option>`).join("")}</select>
            <select id="cmsExBoard" class="sp-select">${Object.values(BOARDS).map(b=>`<option value="${b.id}">${b.name}</option>`).join("")}</select>
            <select id="cmsExMedium" class="sp-select">${Object.values(MEDIUMS).map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}</select>
            <select id="cmsExSubject" class="sp-select">
              <option value="maths">Mathematics</option><option value="english">English</option><option value="grammar">English Grammar</option>
              <option value="hindi">Hindi</option><option value="evs">EVS</option><option value="science">Science</option><option value="social">Social Science</option>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;">
            <input id="cmsExTitle" class="sp-input" placeholder="Exam Title (e.g. Unit Test 1 — Real Numbers)" required />
            <input id="cmsExDuration" type="number" class="sp-input" value="30" min="5" max="180" placeholder="Mins" required />
            <input id="cmsExCount" type="number" class="sp-input" value="10" min="1" max="50" placeholder="# Questions" required />
          </div>
          <button type="submit" class="sp-btn sp-btn-success">✓ Publish Exam Paper to Students</button>
        </form>
      </div>
      <div class="sp-card" style="padding:18px;">
        <h3 style="margin-top:0;">Published Exam Papers (${assessments.length})</h3>
        ${assessments.length === 0 ? `<p style="color:var(--text-muted);">No custom exam papers created yet.</p>` : assessments.map(a => `
          <div style="padding:10px 12px;border-radius:10px;background:var(--bg-muted);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${a.title}</strong> · Class ${a.classNum} · ${a.board} · ${a.medium} (${a.questions.length} Qs · ${Math.round(a.durationSec/60)} mins)</div>
            <button class="sp-btn sp-btn-danger" style="min-height:30px;font-size:12px;" onclick="window.SP.deleteCMSExamPaper('${a.id}')">Delete</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderCMSAssignmentsTab(assignments) {
  return `
    <div style="display:grid;gap:16px;">
      <div class="sp-card" style="padding:18px;">
        <h3 style="margin-top:0;">📋 Create Local Assignment / Homework</h3>
        <p style="font-size:0.84rem;color:var(--text-muted);">Offline note: Assignments are stored locally on this device. Use Backup/Export to share across devices.</p>
        <form onsubmit="window.SP.saveCMSAssignment(event)" style="display:grid;gap:10px;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
            <select id="cmsAsClass" class="sp-select">${Array.from({length:10},(_,i)=>`<option value="${i+1}">Class ${i+1}</option>`).join("")}</select>
            <select id="cmsAsBoard" class="sp-select">${Object.values(BOARDS).map(b=>`<option value="${b.id}">${b.name}</option>`).join("")}</select>
            <select id="cmsAsMedium" class="sp-select">${Object.values(MEDIUMS).map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}</select>
            <select id="cmsAsSession" class="sp-select">${ACADEMIC_SESSIONS.map(ss=>`<option value="${ss}">${ss}</option>`).join("")}</select>
            <select id="cmsAsSubject" class="sp-select">
              <option value="maths">Mathematics</option><option value="english">English</option><option value="grammar">English Grammar</option>
              <option value="hindi">Hindi</option><option value="evs">EVS</option><option value="science">Science</option><option value="social">Social Science</option>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px;">
            <input id="cmsAsTitle" class="sp-input" placeholder="Assignment Title (e.g. Solve Ex 1.1 Questions 1-5)" required />
            <input id="cmsAsDue" type="date" class="sp-input" required />
          </div>
          <textarea id="cmsAsDesc" class="sp-textarea" rows="2" placeholder="Instructions for students..." required></textarea>
          <button type="submit" class="sp-btn sp-btn-success">✓ Save Assignment Locally</button>
        </form>
      </div>
      <div class="sp-card" style="padding:18px;">
        <h3 style="margin-top:0;">Saved Assignments (${assignments.length})</h3>
        ${assignments.length === 0 ? `<p style="color:var(--text-muted);">No assignments created yet.</p>` : assignments.map(a => `
          <div style="padding:10px 12px;border-radius:10px;background:var(--bg-muted);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${escapeHTML(a.title)}</strong> · Class ${a.classNum} · ${a.board} · ${a.medium} · Due: ${a.dueDate}</div>
            <button class="sp-btn sp-btn-danger" style="min-height:30px;font-size:12px;" onclick="window.SP.deleteCMSAssignment('${a.assignmentId}')">Delete</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
