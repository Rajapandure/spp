import { SP_ASSETS } from "./assets.js";
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
  const imgMap = {
    maths: SP_ASSETS.sub_maths,
    science: SP_ASSETS.sub_science,
    evs: SP_ASSETS.sub_science,
    english: SP_ASSETS.sub_english,
    grammar: SP_ASSETS.sub_english,
    hindi: SP_ASSETS.sub_hindi,
    sanskrit: SP_ASSETS.sub_hindi,
    social: SP_ASSETS.sub_social
  };
  if (imgMap[subjectKey]) {
    return `<img src="${imgMap[subjectKey]}" alt="${subjectKey}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:12px;flex-shrink:0;" />`;
  }
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

export function renderAchievementBadgeSVG(badgeId, unlocked = true, size = 48) {
  const bImg = {
    welcome_scholar: SP_ASSETS.badge_star,
    lesson_starter: SP_ASSETS.badge_medal,
    streak_hero: SP_ASSETS.badge_crown,
    quiz_master: SP_ASSETS.badge_trophy,
    book_explorer: SP_ASSETS.badge_rocket
  }[badgeId];
  if (bImg) return `<img src="${bImg}" alt="${badgeId}" style="width:${size}px;height:${size}px;object-fit:contain;${unlocked ? "" : "opacity:0.4;filter:grayscale(1);"}" />`;
  const badges = {
    welcome_scholar: { bg: "#dbeafe", ring: "#2563eb", icon: `<polygon points="24,10 28,19 38,20 30,27 32,37 24,32 16,37 18,27 10,20 20,19" fill="#f59e0b"/>` },
    lesson_starter: { bg: "#d1fae5", ring: "#059669", icon: `<path d="M15 16 H33 V32 H15 Z" fill="#10b981" rx="3"/><path d="M19 24 L23 28 L30 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
    streak_hero: { bg: "#ffedd5", ring: "#ea580c", icon: `<path d="M24 10 C29 17 33 22 31 30 C29 35 19 35 17 30 C15 24 20 19 24 10 Z" fill="#f97316"/><circle cx="24" cy="27" r="3.5" fill="#fef08a"/>` },
    quiz_master: { bg: "#ede9fe", ring: "#7c3aed", icon: `<circle cx="24" cy="22" r="9" fill="#8b5cf6"/><path d="M18 30 L16 39 L24 35 L32 39 L30 30" fill="#a78bfa"/>` },
    book_explorer: { bg: "#fce7f3", ring: "#db2777", icon: `<path d="M14 15 C18 14 22 15 24 17 C26 15 30 14 34 15 V33 C30 32 26 33 24 35 C22 33 18 32 14 33 Z" fill="#ec4899"/>` }
  };
  const b = badges[badgeId] || badges.welcome_scholar;
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="${b.bg}" stroke="${unlocked ? b.ring : "#94a3b8"}" stroke-width="2.5"/>${b.icon}</svg>`;
}

export function renderGradCapSVG(size = 34) {
  if (SP_ASSETS.logo) return `<img src="${SP_ASSETS.logo}" alt="Scholars Point" style="width:${Math.round(size*1.45)}px;height:${size}px;object-fit:contain;flex-shrink:0;" />`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><polygon points="24,8 44,18 24,28 4,18" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/><path d="M12 22 V32 C12 36 36 36 36 32 V22 L24 28 Z" fill="#f59e0b"/><line x1="40" y1="20" x2="40" y2="32" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/><circle cx="40" cy="33" r="2.5" fill="#fef08a"/></svg>`;
}

export function renderScholarHeroSVG(size = 110) {
  if (SP_ASSETS.scholar_boy) return `<img src="${SP_ASSETS.scholar_boy}" alt="Scholar" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:16px;flex-shrink:0;" />`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="54" fill="#fde68a" opacity="0.45"/>
    <path d="M36 96 C36 74 84 74 84 96 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M46 78 L60 92 L74 78" fill="#2563eb"/>
    <circle cx="60" cy="48" r="24" fill="#fed7aa"/>
    <path d="M36 44 C36 24 84 24 84 44 C80 34 68 30 60 32 C50 30 40 34 36 44 Z" fill="#33180c"/>
    <circle cx="51" cy="48" r="3" fill="#1e293b"/><circle cx="69" cy="48" r="3" fill="#1e293b"/>
    <circle cx="52" cy="47" r="1" fill="#fff"/><circle cx="70" cy="47" r="1" fill="#fff"/>
    <path d="M52 57 Q60 65 68 57" stroke="#9a3412" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="54" r="3.5" fill="#fb7185" opacity="0.45"/><circle cx="76" cy="54" r="3.5" fill="#fb7185" opacity="0.45"/>
    <path d="M30 82 L22 58" stroke="#fed7aa" stroke-width="8" stroke-linecap="round"/>
    <circle cx="21" cy="54" r="6" fill="#fed7aa"/>
  </svg>`;
}

export function renderTrophySVG(size = 86) {
  if (SP_ASSETS.badge_trophy) return `<img src="${SP_ASSETS.badge_trophy}" alt="Trophy" style="width:${size}px;height:${size}px;object-fit:contain;flex-shrink:0;" />`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" aria-hidden="true">
    <path d="M26 22 H70 V42 C70 56 58 64 48 64 C38 64 26 56 26 42 Z" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
    <path d="M26 26 H16 C14 26 14 44 26 44" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 26 H80 C82 26 82 44 70 44" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <rect x="43" y="64" width="10" height="12" fill="#d97706"/>
    <rect x="30" y="76" width="36" height="8" rx="4" fill="#b45309"/>
    <polygon points="48,30 51,38 59,38 53,43 55,51 48,46 41,51 43,43 37,38 45,38" fill="#fef08a"/>
    <circle cx="20" cy="18" r="2.5" fill="#fef08a"/><circle cx="78" cy="16" r="3" fill="#fef08a"/><circle cx="82" cy="58" r="2" fill="#fde68a"/>
  </svg>`;
}

export function renderOpenBookSVG(size = 44) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><path d="M6 12 C12 10 20 12 24 16 C28 12 36 10 42 12 V36 C36 34 28 36 24 39 C20 36 12 34 6 36 Z" fill="#ffffff" stroke="#3b82f6" stroke-width="2"/><line x1="24" y1="16" x2="24" y2="39" stroke="#3b82f6" stroke-width="2"/><line x1="11" y1="19" x2="19" y2="20" stroke="#93c5fd" stroke-width="2"/><line x1="11" y1="25" x2="19" y2="26" stroke="#93c5fd" stroke-width="2"/><line x1="29" y1="20" x2="37" y2="19" stroke="#93c5fd" stroke-width="2"/><line x1="29" y1="26" x2="37" y2="25" stroke="#93c5fd" stroke-width="2"/></svg>`;
}

export function renderClipboardSVG(size = 44) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="8" width="28" height="34" rx="5" fill="#ffffff" stroke="#64748b" stroke-width="2"/><rect x="18" y="4" width="12" height="7" rx="3" fill="#3b82f6"/><line x1="16" y1="19" x2="32" y2="19" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="26" x2="32" y2="26" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="33" x2="25" y2="33" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/><path d="M31 31 L39 23 L42 26 L34 34 Z" fill="#f59e0b"/></svg>`;
}
