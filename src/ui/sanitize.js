// Security Utilities: XSS Escaping, Safe URL Checking & Imported Content Validation

export function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stripDangerousMarkup(str) {
  return String(str ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export function sanitizeURL(url) {
  const raw = String(url ?? "").trim();
  if (!raw) return "";
  if (/^(https?:\/\/|\/|\.\/)/i.test(raw)) return raw;
  return "";
}

export function validateImportPayload(parsed) {
  const validChapters = [];
  const validQuestions = [];
  const rejected = [];
  const allowedTypes = new Set(["MCQ", "TF", "FILL", "SHORT", "LONG", "MULTI", "MATCH", "ONE_WORD", "NUMERICAL", "DIAGRAM"]);
  const allowedDiffs = new Set(["Easy", "Medium", "Hard"]);

  if (!parsed || typeof parsed !== "object") {
    return { validChapters, validQuestions, rejected: [{ reason: "Root payload must be a JSON object" }] };
  }

  for (const ch of Array.isArray(parsed.chapters) ? parsed.chapters : []) {
    if (!ch || typeof ch.id !== "string" || typeof ch.title !== "string" || !ch.title.trim()) {
      rejected.push({ id: ch?.id || "unknown", reason: "Invalid chapter: missing id or title" });
      continue;
    }
    validChapters.push({
      ...ch,
      title: stripDangerousMarkup(ch.title).trim(),
      intro: stripDangerousMarkup(ch.intro || "").trim(),
      explanation: stripDangerousMarkup(ch.explanation || "").trim(),
      verificationStatus: ch.verificationStatus || "Under Review"
    });
  }

  for (const q of Array.isArray(parsed.questions) ? parsed.questions : []) {
    if (!q || typeof q.chapterId !== "string" || typeof q.q !== "string" || !q.q.trim() || !q.ans || !String(q.ans).trim()) {
      rejected.push({ id: q?.id || "unknown", reason: "Invalid question: missing chapterId, text, or answer" });
      continue;
    }
    const type = allowedTypes.has(q.type) ? q.type : "MCQ";
    const difficulty = allowedDiffs.has(q.difficulty) ? q.difficulty : "Medium";
    validQuestions.push({
      ...q,
      id: q.id || `q-imp-${Date.now()}-${validQuestions.length}`,
      type,
      difficulty,
      q: stripDangerousMarkup(q.q).trim(),
      ans: stripDangerousMarkup(String(q.ans)).trim(),
      explanation: stripDangerousMarkup(q.explanation || "").trim(),
      solution: stripDangerousMarkup(q.solution || q.explanation || "").trim(),
      options: Array.isArray(q.options) ? q.options.map((o) => stripDangerousMarkup(String(o)).trim()) : [],
      verificationStatus: q.verificationStatus || "Under Review"
    });
  }

  return { validChapters, validQuestions, rejected };
}
