# 🇯🇵 NIHONGO AI LAB (日本語 AI ラボ)
### Discover Japan Through Language & Culture

A full-stack interactive Japanese learning & culture gaming application designed for college project expos, interactive kiosks, and cultural showcases.

---

## 🌟 Key Features

1. **⛩️ Six Interactive Game Dojos**:
   - **🈁 Hiragana Dojo**: 3 progressive belts (vowels, mixed, combinations) with streak multipliers (1.5x / 2.0x), countdown timers, and accuracy tracking.
   - **📚 Vocabulary Quest**: 6 categories (🍜 Food, 🏫 Education, 🚄 Travel, 👨👩👧 People, 🏠 Daily Life, 🌸 Nature) testing Japanese ⇄ English.
   - **🈶 Kanji Master**: Character recognition across Beginner (N5), Intermediate (N4), and Advanced levels with meanings and stroke details.
   - **🎎 Japanese Culture Challenge**: Rich visual quiz covering Kimono, tea ceremonies, Shinto torii gates, sumo, festivals, and omotenashi.
   - **🗾 Japan Explorer**: Interactive stylized map of Japan with 10 iconic cities (Tokyo, Kyoto, Osaka, Mount Fuji, Hiroshima, Hokkaido, Okinawa, Nara, Kanazawa, Hakone). Awards **+25 points** per discovery!
   - **🧩 Mystery Code**: Multi-stage cryptographic decoding puzzle (Hiragana → Romaji → Meaning) culminating in the **Secret Japan Code** (+500 pts).

2. **🏆 Dynamic Global Leaderboard**:
   - Filter by **Today**, **This Week**, and **All-Time**.
   - Top 3 Podium featuring **Gold Crown**, **Silver Medal**, and **Bronze Medal** animated treatments.
   - Live database synchronization with rank delta celebration (⬆ +X ranks!).

3. **🎖️ Collectible Achievement Badges**:
   - 🌸 Sakura Starter (Complete first game)
   - 🈁 Hiragana Hero (Conquer Hiragana Dojo)
   - 📚 Word Warrior (Answer vocabulary questions)
   - 🈶 Kanji Master (Complete Kanji challenge)
   - 🗾 Japan Explorer (Explore 5 or more destinations)
   - 🧩 Mystery Solver (Solve Mystery Code)
   - 🔥 Streak Samurai (10+ question streak)
   - 🏆 Expo Champion (Top leaderboard standing)

4. **🎪 Expo Kiosk Mode**:
   - Large display typography and touch targets.
   - 50-second inactivity countdown timer for automatic return to home screen, allowing continuous expo visitors to play back-to-back without manual reset.

5. **⚙️ Protected Admin Console**:
   - Access with default passcode: `sakura2025`
   - Real-time player logs and deletion of test runs.
   - One-click Leaderboard Reset before the expo starts.
   - One-click Re-seed of demo players and syllabus.

6. **🎨 Authentic Japanese Aesthetics & Web Audio**:
   - Falling sakura cherry blossom physics canvas.
   - Mount Fuji and Torii gate silhouette horizon.
   - Synthetic Web Audio arcade sound effects (Koto bells, taiko drums, victory fanfare) with global mute switch.

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── package.json              # Full-stack dependencies and scripts
├── server.ts                 # Full-stack Express entry point with Vite middleware
├── server/
│   ├── db.ts                 # Database manager (Dual-mode: MongoDB Mongoose + JSON fallback)
│   ├── types.ts              # Server interface definitions
│   ├── seedData.ts           # 50+ Hiragana, 50+ Vocab, 40+ Kanji, 30+ Culture, 10 Cities, 10 Mysteries
│   └── models/
│       ├── Player.ts         # Mongoose schema for Players
│       ├── GameResult.ts     # Mongoose schema for Game Results
│       ├── Question.ts       # Mongoose schema for Questions
│       └── Destination.ts    # Mongoose schema for Japan Explorer destinations
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root app and route coordinator
│   ├── index.css             # Tailwind CSS & Japanese typography styles
│   ├── context/
│   │   └── PlayerContext.tsx # Active player session, audio, expo mode, toasts
│   ├── types/
│   │   └── index.ts          # Frontend TypeScript types
│   ├── utils/
│   │   ├── audio.ts          # Web Audio synthesizer (zero external sound dependencies)
│   │   └── badges.ts         # Badge definitions and icons
│   ├── services/
│   │   └── api.ts            # Client REST API communication
│   └── components/
│       ├── common/
│       │   ├── Navbar.tsx             # Torii-themed header with player capsule
│       │   ├── SakuraBackground.tsx   # Canvas petal physics + Mount Fuji backdrop
│       │   ├── PlayerAvatar.tsx       # 7 Japanese avatars (Samurai, Ninja, Kitsune, etc.)
│       │   ├── AchievementBadge.tsx   # Badge unlocked/locked rendering
│       │   └── Toast.tsx              # Expo notification banners
│       ├── home/
│       │   └── HeroSection.tsx        # Hero banner & live database statistics
│       ├── auth/
│       │   └── PlayerLoginModal.tsx   # Fast player name & avatar selection
│       ├── games/
│       │   ├── GameHub.tsx            # The 6 Dojo training cards
│       │   ├── HiraganaDojo.tsx       # Game 1: 3-belt syllabary trainer
│       │   ├── VocabularyQuest.tsx    # Game 2: 6-category vocabulary quiz
│       │   ├── KanjiMaster.tsx        # Game 3: Kanji character decoding
│       │   ├── CultureChallenge.tsx   # Game 4: Japanese traditions & artifacts
│       │   ├── JapanExplorer.tsx      # Game 5: Interactive map with +25 pts
│       │   ├── MysteryCode.tsx        # Game 6: Cryptographic cipher puzzle
│       │   └── GameResultModal.tsx    # Rank change, confetti, celebration
│       ├── leaderboard/
│       │   └── Leaderboard.tsx        # Top 3 Podium and scrollable rankings
│       ├── profile/
│       │   └── PlayerProfile.tsx      # Badges & game breakdown
│       └── admin/
│           └── AdminDashboard.tsx     # Passcode-protected expo management
└── tsconfig.json             # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **MongoDB** (Optional! The app automatically uses its persistent local file engine if MongoDB is not running, ensuring 100% zero-config uptime at the expo).

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd nihongo-ai-lab

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
# Optional MongoDB connection (Leave empty to use built-in zero-config persistent storage)
MONGODB_URI="mongodb://localhost:27017/nihongo_lab"

# Server Port
PORT=3000

# Admin Passcode for College Expo Team
ADMIN_PASSCODE="sakura2025"
```

### 4. Running the Application
```bash
# Start both Backend and Frontend together in dev mode
npm run dev
```
Open your browser to:
👉 `http://localhost:3000`

---

## 🗄️ Database & Dual-Mode Engine

The application features a resilient **Dual-Mode Database Architecture** (`server/db.ts`):
1. **MongoDB Mode**: When `MONGODB_URI` is supplied in `.env` and reachable, Mongoose models (`PlayerModel`, `GameResultModel`, `QuestionModel`, `DestinationModel`) manage all persistence.
2. **Zero-Config Persistent Engine**: If MongoDB is not yet started, the server seamlessly falls back to file-backed JSON persistence in `data/storage.json`. This guarantees your college expo demo will **never fail** even if the internet drops or local MongoDB services halt!

---

## 🛠️ Expo Management Guide

### 🎪 How to Enable Expo Mode
1. Click the **🎪 EXPO MODE** button in the top navigation bar.
2. The UI expands with large touch-friendly targets, high contrast, and starts an automatic 50-second inactivity timer.
3. When a visitor finishes playing and walks away, the app resets cleanly back to the home screen after 50 seconds for the next visitor.

### ⚙️ How to Access the Admin Dashboard
1. Click the **⚙️** icon in the top right of the navigation bar.
2. Enter the admin passcode: `sakura2025` (configurable in `.env`).
3. From the Admin console you can:
   - View all registered visitor scores and records.
   - Delete test accounts before opening to visitors.
   - Click **⚠️ Reset Leaderboard** for a clean opening slate.
   - Click **🔄 Re-Seed Demo Data** to repopulate demonstration players (Haruto, Sakura, Kishore, etc.).

### ✏️ How to Modify Questions & Japanese Curriculum
- All questions are organized cleanly in `server/seedData.ts`:
  - `HIRAGANA_QUESTIONS`: Hiragana characters, Romaji readings, and explanations.
  - `VOCABULARY_QUESTIONS`: Words categorized by Food, Travel, Education, People, Daily Life, and Nature.
  - `KANJI_QUESTIONS`: Kanji characters, stroke meanings, and cultural nuances.
  - `CULTURE_QUESTIONS`: Cultural trivia questions and answers.
  - `DESTINATIONS_DATA`: Landmarks, foods, regional facts, and Japanese phrases for the map.
  - `MYSTERY_CHALLENGES`: Cryptographic decoding clues.

---

## 📄 License
MIT License. Built for the College Project Expo 2025.
