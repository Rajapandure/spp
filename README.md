# Scholars Point — Offline-First Digital Learning Platform (Classes 1–10)

## Overview
Scholars Point is an offline-first PWA learning platform for Indian school students across **Classes 1 to 10** (each independently configured — never grouped into age bands), supporting **NCERT**, **CBSE**, and **MP Board (MPBSE)** in **English** and **Hindi** mediums for the **2026–27** academic session.

## Architecture
- `src/config/classes.js`: Independent UI, typography, animation, and curriculum configurations for Classes 1–10.
- `src/db/database.js`: IndexedDB (`ScholarsPointDB_v7`) with 18 object stores, strict `studentId` data isolation, offline pack tracking, and idempotent `syncQueue`.
- `src/auth/auth.js`: Salted SHA-256 authentication, student self-registration & teacher-created accounts, Student ID + PIN login, offline cached PIN unlock, and teacher-authorized PIN resets (no hard-coded PINs).
- `src/curriculum/`: Verified 2026–27 NCERT/CBSE/MP Board textbook & chapter seeds (`seed_part1.js`, `seed_part2.js`, `curriculumService.js`).
- `src/reader/textbookReader.js`: Digital textbook reader with bookmarks, highlights, font scaling, Hindi/English typography, Web Speech narration, and offline download manager.
- `src/games/gameEngine.js`: Chapter-linked educational games.
- `src/assessment/examEngine.js`: 20-question configurable Mock Paper engine with timer, save/resume, objective auto-scoring, pending teacher review for descriptive answers, and weak-topic analysis.
- `src/cms/cmsModule.js`: Functional Teacher & Admin CMS with `Draft → Review → Approved → Published` workflow, completeness tracker, JSON/CSV import, and descriptive grading.

## Installation & Deployment
1. **Local / Static Host**: Serve the `scholars-point/` folder over any static HTTP server (e.g. `npx serve .` or `python3 -m http.server 8080`) or deploy directly to **Netlify Drop** / **Vercel** / **GitHub Pages**.
2. **Standalone Offline HTML**: Open `scholars-point-app.html` directly in Chrome/Safari/Edge — zero external CDN dependencies required.
3. **Install as PWA**: Open the hosted URL on Android Chrome or iOS Safari and tap **"Add to Home Screen"** / **"Install App"**.
