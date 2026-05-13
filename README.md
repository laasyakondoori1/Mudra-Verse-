# MudraVerse 🌸

**AI-Powered Indian Classical Dance Learning Platform**

MudraVerse is a museum-grade web application for learning and practising Indian classical dance mudras. It features a **real-time camera-based practice room** that uses MediaPipe Hands to detect and correct your hand gestures — live in the browser, with no ML server needed.

---

## ✨ Features

- **Mudra Archive** — 60+ annotated mudras from Bharatanatyam with classical text references
- **Live Practice Room** — Camera integration with real-time hand tracking (21 landmarks via MediaPipe)
- **Gesture Detection** — Classifies 10 mudras (Pathaka, Alapadmam, Mushti, Suchi, Sikharam, Hamsasyam, Mayura, Kangulam, Ardhachandran, Aralam)
- **Targeted Feedback** — Per-finger corrections, confidence score, guru notes
- **Adi Tāla Metronome** — 8-beat rhythm cycle synced to practice
- **Heritage & Philosophy** — Deep-dive editorial pages on the tradition

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (SSR) + React 19 |
| Styling | Tailwind CSS v4 + Vanilla CSS design tokens |
| Routing | TanStack Router (file-based) |
| ML / Vision | MediaPipe Hands (CDN, no install) |
| Runtime | Cloudflare Workers |
| Build | Vite 7 |

---

## 🚀 Deploy to Cloudflare Pages (Recommended — Free)

### Prerequisites
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- `wrangler` CLI: already in `node_modules`

### Option A: GitHub Auto-Deploy (Recommended)

1. **Fork / push** this repo to your GitHub account
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
3. Connect to **GitHub** and select `Mudra-Verse-`
4. Set these build settings:

   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Build output directory | `dist/client` |
   | Node.js version | `20` |

5. Click **Save and Deploy** — done! ✅

Every push to `main` auto-deploys via the GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Option B: Manual Deploy via CLI

```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy (will prompt for Cloudflare login)
npm run deploy
```

---

## 🌐 Deploy to Vercel (SPA mode)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-reads `vercel.json` — no extra config needed
3. Set **Build Command**: `npm run build` and **Output Directory**: `dist/client`
4. Click **Deploy** ✅

> **Note:** Vercel deploys in SPA (static) mode — all routes are rewritten to `index.html`. SSR features are not active in this mode, but all camera/detection features work perfectly since MediaPipe runs fully client-side.

---

## 💻 Local Development

```bash
# Clone
git clone https://github.com/laasyakondoori1/Mudra-Verse-.git
cd Mudra-Verse-

# Install
npm install

# Start dev server
npm run dev
# → http://localhost:8080

# Navigate to the practice room
# → http://localhost:8080/practice
```

### Camera / MediaPipe
The practice room loads [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) from `cdn.jsdelivr.net` on first visit (~8 MB WASM download). No API keys or server setup required.

**Browser requirements:** Chrome, Edge, or Firefox with webcam access. Allow camera permissions when prompted.

---

## 📁 Project Structure

```
src/
├── routes/
│   ├── index.tsx         # Home page
│   ├── practice.tsx      # 🎥 Live camera practice room
│   ├── library.tsx       # Mudra archive
│   ├── heritage.tsx      # Heritage editorial
│   └── philosophy.tsx    # Philosophy page
├── components/
│   └── site/
│       ├── MudraCamera.tsx    # Camera + hand skeleton overlay
│       ├── SiteHeader.tsx
│       └── SiteShell.tsx
├── hooks/
│   └── useMudraDetection.ts  # MediaPipe hand tracking + classification
├── lib/
│   └── mudras.ts              # All 60+ mudra definitions
└── styles.css                 # Design tokens (gold / ivory / charcoal)
```

---

## 🎥 How the Camera Integration Works

```
Webcam → MediaPipe Hands (CDN WASM)
       → 21 hand landmarks (x, y, z)
       → Finger extension algorithm
       → Mudra classifier (10 mudras)
       → Confidence score + targeted corrections
       → Canvas skeleton overlay (gold)
```

**Finger detection** uses landmark geometry:
- **Extension**: `dist(wrist, tip) > dist(wrist, pip) × 1.08`
- **Pinch**: `dist(thumb_tip, index_tip) < hand_size × 0.28`
- **Spread**: average adjacent fingertip distance `> hand_size × 0.32`

---

## 🔑 Environment Variables (GitHub Actions)

For CI/CD deployment, add these secrets to your GitHub repo (`Settings → Secrets → Actions`):

| Secret | Where to find |
|--------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token (use "Edit Cloudflare Workers" template) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar of any page |

---

## 📜 License

MIT — built for educational purposes. Classical references from Natya Shastra and Abhinaya Darpana are in the public domain.
