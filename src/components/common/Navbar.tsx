import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayerAvatar } from './PlayerAvatar';
import { soundManager } from '../../utils/audio';

export const Navbar: React.FC = () => {
  const {
    player,
    currentView,
    setCurrentView,
    openPlayerModal,
    isSoundMuted,
    toggleSound,
    isExpoMode,
    toggleExpoMode,
    inactivityRemaining,
  } = usePlayer();

  const navItems: Array<{ id: 'home' | 'games' | 'leaderboard' | 'explorer' | 'profile'; label: string; labelJa: string; icon: string }> = [
    { id: 'home', label: 'Home', labelJa: 'ホーム', icon: '⛩️' },
    { id: 'games', label: 'Games Hub', labelJa: '道場', icon: '🎮' },
    { id: 'leaderboard', label: 'Leaderboard', labelJa: '順位表', icon: '🏆' },
    { id: 'explorer', label: 'Explore Japan', labelJa: '日本探検', icon: '🗾' },
    { id: 'profile', label: 'Profile', labelJa: '記録', icon: '📜' },
  ];

  const handleNavClick = (view: 'home' | 'games' | 'leaderboard' | 'explorer' | 'profile') => {
    soundManager.playClick();
    setCurrentView(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-rose-950/40">
      {/* Expo Mode Notice Banner if active */}
      {isExpoMode && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-neutral-950 py-1 px-4 text-xs font-bold text-center tracking-wider flex items-center justify-between shadow-inner">
          <span className="flex items-center gap-1.5">
            <span className="animate-spin text-sm">🎪</span>
            EXPO INTERACTIVE KIOSK MODE ACTIVE — TOUCH TO PLAY!
          </span>
          <div className="flex items-center gap-3">
            <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-mono">
              Auto-Reset: {inactivityRemaining}s
            </span>
            <button
              onClick={toggleExpoMode}
              className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded hover:bg-neutral-800 transition"
            >
              Exit Expo
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-xl shadow-lg shadow-rose-600/30 border border-rose-400/40 group-hover:scale-105 transition-transform duration-300">
            🇯🇵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider bg-gradient-to-r from-white via-rose-100 to-neutral-300 bg-clip-text text-transparent font-['Cinzel',serif]">
                NIHONGO AI LAB
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-widest px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                EXPO
              </span>
            </div>
            <div className="text-[11px] text-rose-400/80 font-['Shippori_Mincho',serif] font-medium tracking-widest">
              日本語 AI ラボ
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/80">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-900/40 font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <span className="text-[10px] opacity-70 font-['Shippori_Mincho',serif] hidden lg:inline">
                  {item.labelJa}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              toggleSound();
            }}
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
          >
            {isSoundMuted ? '🔇' : '🔊'}
          </button>

          {/* Expo Mode Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              toggleExpoMode();
            }}
            title="Toggle Large Display Expo Mode"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
              isExpoMode
                ? 'bg-amber-500 text-neutral-950 border-amber-300 shadow-lg shadow-amber-500/30'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-amber-300/90 border-amber-500/30'
            }`}
          >
            <span className="text-sm">🎪</span>
            <span>EXPO MODE</span>
          </button>

          {/* Admin Dashboard Access */}
          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentView('admin');
            }}
            title="Expo Team Admin Dashboard"
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors border ${
              currentView === 'admin'
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
            }`}
          >
            ⚙️
          </button>

          {/* Player Badge / Session Action */}
          {player ? (
            <div
              onClick={() => {
                soundManager.playClick();
                setCurrentView('profile');
              }}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-gradient-to-r from-neutral-900/90 to-rose-950/40 hover:to-rose-900/50 rounded-2xl border border-rose-500/30 cursor-pointer transition shadow-md group"
            >
              <PlayerAvatar avatar={player.avatar} size="sm" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-rose-200 transition">
                    {player.nickname}
                  </span>
                  <span className="text-[10px] font-mono px-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    Lv.{player.level}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-amber-400 font-mono flex items-center gap-1">
                  ⭐ {player.totalPoints.toLocaleString()} <span className="text-[9px] text-neutral-400">pts</span>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                soundManager.playClick();
                openPlayerModal();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition transform active:scale-95 border border-rose-400/40"
            >
              <span>⛩️</span>
              <span>START PLAYING</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex md:hidden items-center justify-around py-2 px-2 bg-neutral-950/95 border-t border-neutral-900 text-xs">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg ${
                isActive ? 'text-rose-400 font-bold' : 'text-neutral-400'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
