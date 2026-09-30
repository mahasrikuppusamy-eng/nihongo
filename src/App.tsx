import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { SakuraBackground } from './components/common/SakuraBackground';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
import { PlayerLoginModal } from './components/auth/PlayerLoginModal';
import { HeroSection } from './components/home/HeroSection';
import { GameHub } from './components/games/GameHub';
import { HiraganaDojo } from './components/games/HiraganaDojo';
import { VocabularyQuest } from './components/games/VocabularyQuest';
import { KanjiMaster } from './components/games/KanjiMaster';
import { CultureChallenge } from './components/games/CultureChallenge';
import { JapanExplorer } from './components/games/JapanExplorer';
import { MysteryCode } from './components/games/MysteryCode';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { PlayerProfile } from './components/profile/PlayerProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { soundManager } from './utils/audio';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView, selectedGame, selectGame, isExpoMode } = usePlayer();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection />
            <div className="border-t border-rose-950/40 mt-6 pt-10">
              <GameHub />
            </div>
          </>
        );

      case 'games':
        if (selectedGame === 'hiragana') {
          return <HiraganaDojo onBack={() => selectGame(null)} />;
        }
        if (selectedGame === 'vocabulary') {
          return <VocabularyQuest onBack={() => selectGame(null)} />;
        }
        if (selectedGame === 'kanji') {
          return <KanjiMaster onBack={() => selectGame(null)} />;
        }
        if (selectedGame === 'culture') {
          return <CultureChallenge onBack={() => selectGame(null)} />;
        }
        if (selectedGame === 'explorer') {
          return <JapanExplorer onBack={() => selectGame(null)} />;
        }
        if (selectedGame === 'mystery') {
          return <MysteryCode onBack={() => selectGame(null)} />;
        }
        return <GameHub />;

      case 'leaderboard':
        return <Leaderboard />;

      case 'explorer':
        return <JapanExplorer onBack={() => setCurrentView('games')} />;

      case 'profile':
        return <PlayerProfile />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return <HeroSection />;
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col justify-between selection:bg-rose-600 selection:text-white ${isExpoMode ? 'text-lg' : ''}`}>
      {/* Background Petal Physics Canvas & Mount Fuji Silhouette */}
      <SakuraBackground />

      {/* Main Foreground Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 pb-16">
          {renderView()}
        </main>

        {/* Japanese Aesthetic Footer */}
        <footer className="border-t border-rose-950/50 bg-neutral-950/90 py-8 px-4 text-center backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇯🇵</span>
              <span className="font-bold text-white font-['Cinzel',serif]">NIHONGO AI LAB</span>
              <span className="text-rose-400/80 font-['Shippori_Mincho',serif]">日本語 AI ラボ</span>
            </div>

            <div className="text-[11px] text-neutral-500 font-mono">
              College Project-Expo Edition • Language, Culture, Exploration & Mystery
            </div>

            <div className="flex items-center gap-4 text-neutral-400">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentView('leaderboard');
                }}
                className="hover:text-amber-300 transition"
              >
                Leaderboard
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentView('explorer');
                }}
                className="hover:text-sky-300 transition"
              >
                Japan Map
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentView('admin');
                }}
                className="hover:text-rose-400 transition"
              >
                Admin ⚙️
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals & Notifications */}
      <PlayerLoginModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}
