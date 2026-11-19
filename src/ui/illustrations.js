// Original Offline SVG Illustration & Diagram System (Zero External Assets)

export function renderAvatarSVG(avatarId, size = 44) {
  const map = {
    owl: { bg: "#dbeafe", accent: "#1d4ed8", face: `<circle cx="24" cy="24" r="14" fill="#93c5fd"/><circle cx="19" cy="22" r="4.5" fill="#fff"/><circle cx="29" cy="22" r="4.5" fill="#fff"/><circle cx="19" cy="22" r="2" fill="#1e293b"/><circle cx="29" cy="22" r="2" fill="#1e293b"/><polygon points="24,24 21,28 27,28" fill="#f59e0b"/><path d="M12 14 L18 17 L14 21 Z" fill="#1d4ed8"/><path d="M36 14 L30 17 L34 21 Z" fill="#1d4ed8"/>` },
    tiger: { bg: "#ffedd5", accent: "#c2410c", face: `<circle cx="24" cy="25" r="13" fill="#fb923c"/><circle cx="15" cy="14" r="4" fill="#ea580c"/><circle cx="33" cy="14" r="4" fill="#ea580c"/><circle cx="19" cy="23" r="2.2" fill="#1e293b"/><circle cx="29" cy="23" r="2.2" fill="#1e293b"/><ellipse cx="24" cy="28" rx="4" ry="3" fill="#fff7ed"/><polygon points="24,26 22,29 26,29" fill="#1e293b"/><path d="M16 19 L19 20 M32 19 L29 20" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>` },
    peacock: { bg: "#d1fae5", accent: "#047857", face: `<circle cx="24" cy="26" r="12" fill="#10b981"/><path d="M14 14 Q24 6 34 14" stroke="#059669" stroke-width="3" fill="none"/><circle cx="17" cy="11" r="2.5" fill="#f59e0b"/><circle cx="24" cy="9" r="2.5" fill="#3b82f6"/><circle cx="31" cy="11" r="2.5" fill="#f59e0b"/><circle cx="20" cy="24" r="2" fill="#fff"/><circle cx="28" cy="24" r="2" fill="#fff"/><polygon points="24,26 22,30 26,30" fill="#fbbf24"/>` },
    panda: { bg: "#f3e8ff", accent: "#7e22ce", face: `<circle cx="14" cy="15" r="5" fill="#1e293b"/><circle cx="34" cy="15" r="5" fill="#1e293b"/><circle cx="24" cy="25" r="13" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/><ellipse cx="19" cy="23" rx="3.5" ry="4" fill="#1e293b"/><ellipse cx="29" cy="23" rx="3.5" ry="4" fill="#1e293b"/><circle cx="19" cy="23" r="1.3" fill="#fff"/><circle cx="29" cy="23" r="1.3" fill="#fff"/><ellipse cx="24" cy="28" rx="2.5" ry="1.8" fill="#1e293b"/>` },
    rocket: { bg: "#e0e7ff", accent: "#4338ca", face: `<path d="M24 9 C30 16 32 25 30 33 L18 33 C16 25 18 16 24 9 Z" fill="#6366f1"/><circle cx="24" cy="21" r="4" fill="#e0f2fe" stroke="#312e81" stroke-width="1.5"/><path d="M18 28 L13 34 L18 33 Z" fill="#f43f5e"/><path d="M30 28 L35 34 L30 33 Z" fill="#f43f5e"/><path d="M21 33 L24 39 L27 33 Z" fill="#f59e0b"/>` },
    lotus: { bg: "#fce7f3", accent: "#be185d", face: `<path d="M24 11 C28 18 28 28 24 34 C20 28 20 18 24 11 Z" fill="#ec4899"/><path d="M24 34 C17 31 13 24 15 17 C20 20 23 26 24 34 Z" fill="#f472b6"/><path d="M24 34 C31 31 35 24 33 17 C28 20 25 26 24 34 Z" fill="#f472b6"/><path d="M14 35 Q24 38 34 35" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round"/>` }
  };
  const cfg = map[avatarId] || map.owl;
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" style="border-radius:50%;flex-shrink:0;" aria-hidden="true"><rect width="48" height="48" rx="24" fill="${cfg.bg}"/>${cfg.face}</svg>`;
}

export function renderSubjectSVG(subjectKey, size = 48) {
  const icons = {
    maths: `<rect width="48" height="48" rx="14" fill="#dbeafe"/><rect x="11" y="11" width="26" height="26" rx="6" fill="#2563eb"/><text x="17" y="23" fill="#fff" font-size="11" font-weight="800">+</text><text x="27" y="23" fill="#fff" font-size="11" font-weight="800">÷</text><text x="17" y="33" fill="#93c5fd" font-size="11" font-weight="800">×</text><text x="27" y="33" fill="#93c5fd" font-size="11" font-weight="800">=</text>`,
    english: `<rect width="48" height="48" rx="14" fill="#fce7f3"/><path d="M12 14 C12 12 20 12 24 15 C28 12 36 12 36 14 L36 34 C36 34 28 32 24 35 C20 32 12 34 12 34 Z" fill="#db2777"/><line x1="24" y1="15" x2="24" y2="35" stroke="#fbcfe8" stroke-width="2"/><text x="15" y="26" fill="#fff" font-size="9" font-weight="800">A</text><text x="27" y="26" fill="#fff" font-size="9" font-weight="800">Z</text>`,
    hindi: `<rect width="48" height="48" rx="14" fill="#ffedd5"/><rect x="11" y="12" width="26" height="24" rx="5" fill="#ea580c"/><text x="24" y="29" text-anchor="middle" fill="#fff" font-size="16" font-weight="800">अ</text>`,
    evs: `<rect width="48" height="48" rx="14" fill="#d1fae5"/><circle cx="24" cy="24" r="13" fill="#059669"/><path d="M24 14 C28 19 30 25 24 32 C18 25 20 19 24 14 Z" fill="#a7f3d0"/>`,
    science: `<rect width="48" height="48" rx="14" fill="#e0e7ff"/><path d="M20 12 L28 12 L28 19 L35 33 C36 35 34 37 32 37 L16 37 C14 37 12 35 13 33 L20 19 Z" fill="#4f46e5"/><circle cx="22" cy="30" r="2" fill="#a5b4fc"/><circle cx="27" cy="27" r="1.5" fill="#a5b4fc"/>`,
    social: `<rect width="48" height="48" rx="14" fill="#fef3c7"/><circle cx="24" cy="24" r="13" fill="#d97706"/><path d="M15 21 Q24 17 33 21 M15 27 Q24 31 33 27 M24 11 L24 37" stroke="#fef3c7" stroke-width="1.8" fill="none"/>`,
    sanskrit: `<rect width="48" height="48" rx="14" fill="#f3e8ff"/><rect x="11" y="12" width="26" height="24" rx="5" fill="#7c3aed"/><text x="24" y="29" text-anchor="middle" fill="#fff" font-size="15" font-weight="800">ॐ</text>`,
    grammar: `<rect width="48" height="48" rx="14" fill="#ede9fe"/><rect x="11" y="11" width="26" height="26" rx="6" fill="#6d28d9"/><text x="24" y="28" text-anchor="middle" fill="#fff" font-size="12" font-weight="800">Aa</text>`
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" style="flex-shrink:0;" aria-hidden="true">${icons[subjectKey] || icons.maths}</svg>`;
}

export function renderConceptDiagramSVG(diagramType) {
  if (diagramType === "shapes_c1") {
    return `<svg viewBox="0 0 360 120" class="w-full" style="max-width:420px;background:#fff7ed;border-radius:16px;padding:8px;">
      <circle cx="55" cy="55" r="30" fill="#f97316"/><text x="55" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Circle (गोल)</text>
      <rect x="115" y="25" width="58" height="58" rx="4" fill="#2563eb"/><text x="144" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Square (वर्ग)</text>
      <polygon points="235,25 200,83 270,83" fill="#10b981"/><text x="235" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Triangle (त्रिभुज)</text>
      <rect x="290" y="34" width="56" height="40" rx="4" fill="#8b5cf6"/><text x="318" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Rectangle</text>
    </svg>`;
  }
  if (diagramType === "fractions_c5") {
    return `<svg viewBox="0 0 360 130" class="w-full" style="max-width:420px;background:#f0f9ff;border-radius:16px;padding:8px;">
      <circle cx="65" cy="58" r="36" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/><path d="M65,58 L65,22 A36,36 0 0,1 65,94 Z" fill="#0284c7"/><text x="65" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">1/2 (Half)</text>
      <circle cx="180" cy="58" r="36" fill="#fde68a" stroke="#d97706" stroke-width="2"/><path d="M180,58 L180,22 A36,36 0 0,1 216,58 Z" fill="#d97706"/><text x="180" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">1/4 (Quarter)</text>
      <circle cx="295" cy="58" r="36" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/><path d="M295,58 L295,22 A36,36 0 1,1 259,58 Z" fill="#16a34a"/><text x="295" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">3/4 (Three-Fourths)</text>
    </svg>`;
  }
  if (diagramType === "trigonometry_c10") {
    return `<svg viewBox="0 0 360 160" class="w-full" style="max-width:420px;background:#f8fafc;border-radius:16px;border:1px solid #cbd5e1;">
      <polygon points="70,130 260,130 260,30" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/>
      <rect x="244" y="114" width="16" height="16" fill="none" stroke="#1d4ed8" stroke-width="2"/>
      <text x="58" y="138" font-size="13" font-weight="800" fill="#0f172a">A (θ)</text>
      <text x="266" y="138" font-size="13" font-weight="800" fill="#0f172a">B (90°)</text>
      <text x="266" y="30" font-size="13" font-weight="800" fill="#0f172a">C</text>
      <text x="165" y="148" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Base (Adjacent = AB)</text>
      <text x="308" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Perp (BC)</text>
      <text x="148" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8" transform="rotate(-28 148 72)">Hypotenuse (AC)</text>
    </svg>`;
  }
  if (diagramType === "ohms_law_c10") {
    return `<svg viewBox="0 0 360 150" class="w-full" style="max-width:420px;background:#f8fafc;border-radius:16px;border:1px solid #cbd5e1;">
      <rect x="60" y="30" width="240" height="90" rx="8" fill="none" stroke="#334155" stroke-width="2.5"/>
      <rect x="145" y="18" width="70" height="24" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/><text x="180" y="34" text-anchor="middle" font-size="12" font-weight="800" fill="#854d0e">R (Ω)</text>
      <circle cx="180" cy="120" r="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="180" y="124" text-anchor="middle" font-size="12" font-weight="800" fill="#1d4ed8">V</text>
      <circle cx="60" cy="75" r="14" fill="#d1fae5" stroke="#059669" stroke-width="2"/><text x="60" y="79" text-anchor="middle" font-size="12" font-weight="800" fill="#047857">A</text>
      <text x="180" y="79" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">V = I × R</text>
    </svg>`;
  }
  return "";
}
