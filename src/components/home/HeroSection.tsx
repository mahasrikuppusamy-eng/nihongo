import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { fetchStats } from '../../services/api';
import { OverallStats } from '../../types';
import { soundManager } from '../../utils/audio';

export const HeroSection: React.FC = () => {
  const { setCurrentView, openPlayerModal, player, selectGame } = usePlayer();
  const [stats, setStats] = useState<OverallStats>({
    totalPlayers: 16,
    totalGames: 88,
    totalPoints: 48500,
    highestScore: 8450,
    todayPlayers: 12,
    todayGames: 34,
  });
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  const handleStart = () => {
    soundManager.playClick();
    if (!player) {
      openPlayerModal();
    } else {
      setCurrentView('games');
    }
  };

  return (
    <div className="relative pt-6 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Top Festival Torii Ribbon */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold tracking-wider mb-6 shadow-md backdrop-blur-md animate-bounce">
        <span>🌸</span>
        <span>COLLEGE PROJECT EXPO 2025 • INTERACTIVE EXPERIENCE</span>
        <span>⛩️</span>
      </div>

      {/* Main Title Badge */}
      <div className="relative mb-3">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-['Cinzel',serif] drop-shadow-lg">
          <span className="bg-gradient-to-r from-red-500 via-rose-200 to-amber-200 bg-clip-text text-transparent">
            NIHONGO AI LAB
          </span>
        </h1>
        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-400 font-['Shippori_Mincho',serif] mt-2 tracking-widest drop-shadow-md">
          日本語 AI ラボ
        </div>
      </div>

      {/* Primary Motto */}
      <div className="text-base sm:text-xl font-bold tracking-wide text-neutral-200 uppercase font-['Cinzel',serif] mt-1 mb-2">
        "Discover Japan Through Language & Culture"
      </div>

      {/* Subtitles: 3 pillars */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-300 mb-8 max-w-xl">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-rose-400 font-bold">学</span>
          <span>Learn Japanese</span>
        </div>
        <span className="text-neutral-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-amber-400 font-bold">旅</span>
          <span>Explore Japan</span>
        </div>
        <span className="text-neutral-600 hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-purple-400 font-bold">挑</span>
          <span>Challenge Yourself</span>
        </div>
      </div>

      {/* Spectacular Animated Mount Fuji / Torii Scene Capsule */}
      <div className="relative w-full max-w-2xl h-52 sm:h-64 rounded-3xl overflow-hidden border-2 border-rose-500/30 bg-gradient-to-b from-indigo-950/40 via-purple-950/30 to-black/80 backdrop-blur-md shadow-2xl mb-10 flex items-center justify-center group">
        {/* Subtle rising crimson sun background */}
        <div className="absolute top-6 w-32 h-32 rounded-full bg-rose-600/30 blur-2xl group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute top-10 w-24 h-24 rounded-full bg-red-600/80 border-4 border-rose-400/40 shadow-xl shadow-red-600/50" />

        {/* Mount Fuji Vector */}
        <svg
          viewBox="0 0 500 220"
          className="absolute bottom-0 w-full h-full text-indigo-950/80 fill-current drop-shadow-2xl"
        >
          <path d="M 0,220 L 0,180 Q 150,180 210,60 L 250,30 L 290,60 Q 350,180 500,180 L 500,220 Z" />
          {/* Snow cap */}
          <path
            d="M 220,50 L 250,30 L 280,50 Q 265,58 250,52 Q 235,58 220,50 Z"
            fill="#ffffff"
            opacity="0.85"
          />
        </svg>

        {/* Torii Gate in Foreground */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-40 sm:w-48 h-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-full shadow-lg shadow-red-600/50 border-t border-rose-300" />
          <div className="w-32 sm:w-36 h-2 bg-red-700 rounded-full mt-1.5 shadow" />
          <div className="w-24 sm:w-28 flex justify-between px-2 mt-1">
            <div className="w-2 sm:w-2.5 h-24 sm:h-28 bg-gradient-to-b from-red-600 to-red-900 rounded-sm shadow-md" />
            <div className="w-2 sm:w-2.5 h-24 sm:h-28 bg-gradient-to-b from-red-600 to-red-900 rounded-sm shadow-md" />
          </div>
          <div className="absolute top-14 text-center">
            <span className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-['Shippori_Mincho',serif]">
              日本
            </span>
          </div>
        </div>

        {/* Floating Tag */}
        <div className="absolute bottom-3 inset-x-0 text-center">
          <span className="text-[11px] font-mono tracking-widest text-rose-300/80 bg-black/60 px-3 py-1 rounded-full border border-rose-500/20">
            6 INTERACTIVE ARCADE DOJO CHALLENGES AWAIT
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-lg mb-12">
        <button
          onClick={handleStart}
          className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm sm:text-base tracking-wider shadow-xl shadow-rose-600/40 hover:shadow-rose-600/60 transition-all duration-300 transform active:scale-95 border border-rose-300/50 flex items-center justify-center gap-2 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">▶</span>
          <span>START YOUR JOURNEY</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setCurrentView('leaderboard');
          }}
          className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold text-xs sm:text-sm tracking-wide border border-amber-500/30 hover:border-amber-400 transition shadow-lg flex items-center justify-center gap-2"
        >
          <span>🏆</span>
          <span>LEADERBOARD</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setCurrentView('explorer');
          }}
          className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-sky-300 font-bold text-xs sm:text-sm tracking-wide border border-sky-500/30 hover:border-sky-400 transition shadow-lg flex items-center justify-center gap-2"
        >
          <span>🗾</span>
          <span>EXPLORE JAPAN</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowHowToPlay(true);
          }}
          className="w-full sm:w-auto py-4 px-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 font-medium text-xs sm:text-sm border border-neutral-800 transition flex items-center justify-center gap-1.5"
        >
          <span>📖</span>
          <span>HOW TO PLAY</span>
        </button>
      </div>

      {/* Statistics Section (from Database) */}
      <div className="w-full max-w-4xl bg-neutral-900/70 border border-rose-950/60 rounded-3xl p-5 sm:p-7 backdrop-blur-md shadow-xl">
        <div className="text-xs uppercase font-bold tracking-widest text-rose-400 mb-4 font-mono flex items-center justify-center gap-2">
          <span>●</span> LIVE EXPO STATISTICS <span>●</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl mb-1">👥</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.totalPlayers.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              Total Players
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl mb-1">🎮</span>
            <div className="text-xl sm:text-2xl font-black text-rose-300 font-mono">
              {stats.totalGames.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              Games Played
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl mb-1">⭐</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              Total Points
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl mb-1">🏆</span>
            <div className="text-xl sm:text-2xl font-black text-yellow-300 font-mono">
              {stats.highestScore.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              Highest Score
            </div>
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-neutral-900 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl text-left">
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📖</span>
              <div>
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif]">
                  HOW TO PLAY & SCORING SYSTEM
                </h3>
                <p className="text-xs text-rose-300 font-['Shippori_Mincho',serif]">
                  遊び方と得点システム
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                  <span>⛩️</span> 1. Quick Start
                </h4>
                <p>
                  Enter your name or nickname and pick your favorite Japanese avatar (Samurai, Ninja, Kitsune, Sakura, Tanuki, Fuji, or Cat). No registration required.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <span>🔥</span> 2. Scoring & Streaks
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Correct Answer:</strong> +100 points</li>
                  <li><strong>Speed Bonus:</strong> Up to +25 points for swift answering</li>
                  <li><strong>3-Streak:</strong> 🔥 1.5x Multiplier (+50 bonus)</li>
                  <li><strong>5-Streak & Beyond:</strong> 🔥 2.0x Multiplier (+100 bonus)</li>
                  <li><strong>Dojo Completion:</strong> +200 bonus points</li>
                  <li><strong>Mystery Code Seal:</strong> +500 mystery grand points</li>
                  <li><strong>Japan Explorer:</strong> +25 points per visited landmark</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <h4 className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <span>🎖️</span> 3. Collectible Badges & Global Leaderboard
                </h4>
                <p>
                  Every game you complete automatically syncs with the live expo leaderboard. Rise through ranks to achieve the prestigious Top 3 Gold, Silver, and Bronze podium seats!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHowToPlay(false);
                handleStart();
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition hover:from-rose-500 hover:to-red-500 text-center"
            >
              GOT IT, LET'S PLAY! ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
