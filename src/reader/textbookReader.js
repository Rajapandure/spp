// Digital Textbook Reader, Bookmarks, Highlights, Audio Narration & Honest Offline Availability
import { dbDelete, dbGet, dbPut, getStudentBookmarks, getStudentHighlights } from "../db/database.js";
import { renderConceptDiagramSVG } from "../ui/illustrations.js";

// Honest availability: built-in structured chapters are "Available Offline (Built-in)".
// We never claim a remote PDF was downloaded unless a real local blob/pack was saved.
export async function getBookOfflineStatus(book, chaptersForBook = []) {
  const pack = await dbGet("offlinePacks", `pack::${book.id}`);
  if (pack && pack.status === "Downloaded" && pack.blobSizeBytes > 0) {
    return { status: "Downloaded", label: `Downloaded (${Math.round(pack.blobSizeBytes / 1024)} KB)`, isAvailable: true };
  }
  if (chaptersForBook.length > 0) {
    return { status: "Available Offline", label: `Available Offline (${chaptersForBook.length} structured chapters)`, isAvailable: true };
  }
  return { status: "Not Downloaded", label: "No offline chapters available", isAvailable: false };
}

export async function isBookOfflineDownloaded(book) {
  const pack = await dbGet("offlinePacks", `pack::${book.id}`);
  if (pack) return pack.status === "Downloaded" || pack.downloaded === true;
  return Boolean(book.offlineDownloaded);
}

export async function saveBookLocalPack(book, chapters) {
  const packData = JSON.stringify({ book, chapters, savedAt: new Date().toISOString() });
  const sizeBytes = new Blob([packData]).size;
  const packId = `pack::${book.id}`;
  await dbPut("offlinePacks", {
    packId,
    bookId: book.id,
    title: book.title,
    chapterCount: chapters.length,
    blobSizeBytes: sizeBytes,
    payloadJson: packData,
    status: "Downloaded",
    downloaded: true,
    updatedAt: new Date().toISOString()
  });
  return sizeBytes;
}

export async function removeBookLocalPack(bookId) {
  await dbDelete("offlinePacks", `pack::${bookId}`);
  return true;
}

export async function toggleBookOfflinePack(book, chapters) {
  const pack = await dbGet("offlinePacks", `pack::${book.id}`);
  if (pack && (pack.status === "Downloaded" || pack.downloaded)) {
    await removeBookLocalPack(book.id);
    return false;
  }
  await saveBookLocalPack(book, chapters);
  return true;
}

export async function getStorageUsageSummary() {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const est = await navigator.storage.estimate();
      return {
        supported: true,
        usageKB: Math.round((est.usage || 0) / 1024),
        quotaMB: Math.round((est.quota || 0) / (1024 * 1024))
      };
    } catch {
      return { supported: false };
    }
  }
  return { supported: false };
}

export function speakChapterText(text, medium = "EN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = medium === "HI" ? "hi-IN" : "en-IN";
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
  return true;
}

export function stopChapterSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function toggleBookmark(studentId, chapter) {
  const id = `${studentId}::${chapter.id}`;
  const existing = await dbGet("bookmarks", id);
  if (existing) {
    await dbDelete("bookmarks", id);
    return false;
  }
  await dbPut("bookmarks", {
    id,
    studentId,
    chapterId: chapter.id,
    bookId: chapter.bookId,
    title: chapter.title,
    createdAt: new Date().toISOString()
  });
  return true;
}

export async function addHighlight(studentId, chapterId, textSnippet) {
  const clean = (textSnippet || "").trim();
  if (!clean) return null;
  const record = {
    id: `${studentId}::${chapterId}::${Date.now()}`,
    studentId,
    chapterId,
    text: clean,
    createdAt: new Date().toISOString()
  };
  await dbPut("highlights", record);
  return record;
}

export async function renderLearnChapterHTML(chapter, studentProfile, fontSizePx = 16) {
  const bookmarks = await getStudentBookmarks(studentProfile.studentId);
  const isBookmarked = bookmarks.some((b) => b.chapterId === chapter.id);
  const highlights = await getStudentHighlights(studentProfile.studentId, chapter.id);
  const isHindi = studentProfile.medium === "HI" || /[\u0900-\u097F]/.test(chapter.title);
  const diagramHTML = chapter.diagramType ? `<div style="margin:14px 0;">${renderConceptDiagramSVG(chapter.diagramType)}</div>` : "";

  const esc = (str) => String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let explanationHTML = esc(chapter.explanation || "");
  for (const h of highlights) {
    const safeH = esc(h.text);
    if (safeH && explanationHTML.includes(safeH)) {
      explanationHTML = explanationHTML.replace(safeH, `<mark class="sp-highlight">${safeH}</mark>`);
    }
  }

  const verStatus = chapter.verificationStatus || (chapter.isSupplementary ? "Generated" : "Verified");
  const verColor = verStatus === "Verified" ? "#065f46" : "#92400e";
  const verBg = verStatus === "Verified" ? "#d1fae5" : "#fef3c7";

  return `
    <div class="sp-reader-body ${isHindi ? "sp-hindi" : ""}" style="font-size:${fontSizePx}px;">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          <span class="sp-badge" style="background:${verBg};color:${verColor};">${verStatus === "Verified" ? "✓ Verified" : "Generated Supplementary"}</span>
          <span class="sp-badge" style="background:var(--bg-muted);color:var(--text-secondary);">📘 ${esc(chapter.sourceType || "Curriculum")}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.changeReaderFont(-1)">A-</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.changeReaderFont(1)">A+</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.readChapterAloud('${chapter.id}')">🔊 Listen</button>
          <button class="sp-btn ${isBookmarked ? "sp-btn-warm" : "sp-btn-secondary"}" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.toggleChapterBookmark('${chapter.id}')">${isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}</button>
          <button class="sp-btn sp-btn-secondary" style="min-height:34px;padding:0 10px;font-size:12px;" onclick="window.SP.highlightSelection('${chapter.id}')">🖍️ Highlight</button>
        </div>
      </div>

      <div style="background:var(--bg-muted);padding:14px;border-radius:14px;margin-bottom:14px;">
        <div style="font-weight:800;font-size:0.9rem;margin-bottom:4px;">Introduction</div>
        <div>${esc(chapter.intro)}</div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-weight:800;font-size:0.95rem;margin-bottom:6px;">🎯 Learning Objectives</div>
        <ul style="margin:0;padding-left:20px;">
          ${(chapter.objectives || []).map((o) => `<li>${esc(o)}</li>`).join("")}
        </ul>
      </div>

      <div style="margin-bottom:16px;">
        <div style="font-weight:800;font-size:0.95rem;margin-bottom:6px;">📖 Chapter Explanation</div>
        <p style="margin:0;white-space:pre-line;">${explanationHTML}</p>
        ${diagramHTML}
      </div>

      ${(chapter.concepts || []).length ? `
        <div style="margin-bottom:16px;">
          <div style="font-weight:800;font-size:0.95rem;margin-bottom:8px;">🔑 Important Concepts & Definitions</div>
          <div style="display:grid;gap:8px;">
            ${chapter.concepts.map((c) => `<div style="padding:10px 14px;border-radius:12px;border:1px solid var(--border-subtle);background:var(--bg-card);"><strong>${esc(c.term)}:</strong> ${esc(c.def)}</div>`).join("")}
          </div>
        </div>
      ` : ""}

      ${(chapter.examples || []).length ? `
        <div style="margin-bottom:16px;">
          <div style="font-weight:800;font-size:0.95rem;margin-bottom:8px;">✏️ Worked Examples</div>
          ${chapter.examples.map((ex, i) => `<div style="padding:12px;border-radius:12px;background:#eff6ff;color:#1e293b;margin-bottom:8px;"><strong>Example ${i + 1}:</strong> ${esc(ex.q)}<div style="margin-top:4px;color:#047857;font-weight:600;">Solution: ${esc(ex.a)}</div></div>`).join("")}
        </div>
      ` : ""}

      ${(chapter.revision || []).length ? `
        <div style="padding:14px;border-radius:14px;background:#fefce8;color:#713f12;margin-bottom:16px;">
          <div style="font-weight:800;margin-bottom:4px;">⚡ Quick Chapter Revision</div>
          <ul style="margin:0;padding-left:20px;">${chapter.revision.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>
      ` : ""}

      <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <button class="sp-btn sp-btn-success" onclick="window.SP.markLessonComplete('${chapter.id}')">✓ Mark Chapter Lesson Completed (+20 XP)</button>
      </div>
    </div>
  `;
}
