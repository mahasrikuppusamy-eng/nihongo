import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { AchievementBadge } from '../common/AchievementBadge';
import { BADGES_LIST } from '../../utils/badges';
import { soundManager } from '../../utils/audio';

export const PlayerProfile: React.FC = () => {
  const { player, openPlayerModal, setCurrentView, logout } = usePlayer();

  if (!player) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🥋</div>
        <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">NO ACTIVE CHALLENGER</h2>
        <p className="text-xs text-neutral-400 mt-2 mb-6">
          Step forward, pick an avatar, and track your accomplishments on the live board!
        </p>
        <button
          onClick={() => {
            soundManager.playClick();
            openPlayerModal();
          }}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-600/30"
        >
          ⛩️ REGISTER CHALLENGER
        </button>
      </div>
    );
  }

  const unlockedCount = player.badges?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Profile Card */}
      <div className="relative rounded-3xl bg-neutral-900/90 border-2 border-rose-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <PlayerAvatar avatar={player.avatar} size="xl" />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif]">
                {player.nickname}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-600/20 text-rose-300 border border-rose-500/40">
                Level {player.level}
              </span>
            </div>

            <p className="text-xs text-rose-400 font-['Shippori_Mincho',serif] mb-4">
              日本武者・言語と文化の挑戦者
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Total Points</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  ⭐ {player.totalPoints.toLocaleString()}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Games Played</div>
                <div className="text-lg font-black text-rose-300 font-mono">
                  🎮 {player.gamesPlayed}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Accuracy</div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {player.accuracy}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Best Streak</div>
                <div className="text-lg font-black text-orange-400 font-mono">
                  🔥 {player.bestStreak}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                openPlayerModal();
              }}
              className="py-2 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 transition border border-neutral-700"
            >
              Switch Challenger
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                logout();
              }}
              className="py-2 px-3.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Collectible Badges Showcase */}
      <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 shadow-xl backdrop-blur-md mb-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-white font-['Cinzel',serif] flex items-center gap-2">
              <span>🏆</span> ACHIEVEMENTS & MEDALS
            </h3>
            <div className="text-[11px] text-rose-400 font-['Shippori_Mincho',serif]">
              獲得バッジ一覧
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800">
            {unlockedCount} / {BADGES_LIST.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = player.badges?.includes(badge.id);
            return (
              <AchievementBadge
                key={badge.id}
                badgeId={badge.id}
                isUnlocked={isUnlocked}
                size="md"
                showDetails={true}
              />
            );
          })}
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            soundManager.playClick();
            setCurrentView('games');
          }}
          className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition transform active:scale-95"
        >
          ▶ RESUME TRAINING
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setCurrentView('leaderboard');
          }}
          className="py-3.5 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-sm border border-neutral-700 transition"
        >
          🏆 VIEW STANDINGS
        </button>
      </div>
    </div>
  );
};
