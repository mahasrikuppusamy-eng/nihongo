import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameSubmissionResult } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { AchievementBadge } from '../common/AchievementBadge';
import { soundManager } from '../../utils/audio';

interface GameResultModalProps {
  resultData: GameSubmissionResult;
  onPlayAgain: () => void;
  onOtherGames: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  resultData,
  onPlayAgain,
  onOtherGames,
}) => {
  const { setCurrentView } = usePlayer();
  const { player, rankDelta, newRank, newBadges, result } = resultData;

  useEffect(() => {
    soundManager.playVictory();

    // Trigger colorful festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#fbbf24', '#f59e0b', '#ffffff'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-neutral-900 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/80 text-center overflow-hidden">
        {/* Top Decorative Torii bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Celebration Title */}
        <div className="mb-4">
          <div className="text-3xl mb-1">🎌</div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif] tracking-wider">
            GAME COMPLETE!
          </h2>
          <p className="text-rose-400 font-['Shippori_Mincho',serif] text-xs font-semibold">
            修了おめでとうございます — よく頑張りました！
          </p>
        </div>

        {/* Player Snapshot */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-neutral-950/80 border border-neutral-800 mb-6">
          <PlayerAvatar avatar={player.avatar} size="sm" />
          <div className="text-left">
            <div className="text-xs font-bold text-white">{player.nickname}</div>
            <div className="text-[10px] text-neutral-400">Level {player.level} Challenger</div>
          </div>
        </div>

        {/* Stats Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          <div className="p-3 rounded-2xl bg-neutral-950 border border-rose-900/40">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Score Earned</div>
            <div className="text-xl font-black text-rose-400 font-mono mt-0.5">
              +{result.score.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-emerald-900/40">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Accuracy</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {result.accuracy}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-orange-900/40">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Best Streak</div>
            <div className="text-xl font-black text-orange-400 font-mono mt-0.5">
              🔥 {result.streak}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-neutral-950 border border-amber-900/40">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Total Points</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              ⭐ {player.totalPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Leaderboard Rank Delta Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-neutral-950 via-rose-950/40 to-neutral-950 border border-rose-500/40 mb-6 flex items-center justify-around">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-bold">Current Rank</div>
            <div className="text-lg font-black text-white font-mono">#{newRank}</div>
          </div>

          {rankDelta > 0 ? (
            <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-sm bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/50 animate-pulse">
              <span>⬆</span>
              <span>+{rankDelta} Ranks!</span>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 font-medium">Rank Secured</div>
          )}
        </div>

        {/* Newly Unlocked Badges */}
        {newBadges && newBadges.length > 0 && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <span>🏆</span> NEW BADGE UNLOCKED!
            </div>
            <div className="flex items-center justify-center gap-4">
              {newBadges.map((badgeId) => (
                <AchievementBadge key={badgeId} badgeId={badgeId} size="md" showDetails={true} />
              ))}
            </div>
          </div>
        )}

        {/* Action Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-rose-600/30 transition transform active:scale-95"
          >
            ▶ PLAY AGAIN
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOtherGames();
            }}
            className="py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs tracking-wider transition"
          >
            🎮 OTHER GAMES
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentView('leaderboard');
            }}
            className="py-3 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-600/40 text-amber-300 font-bold text-xs tracking-wider transition"
          >
            🏆 LEADERBOARD
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setCurrentView('home');
            }}
            className="py-3 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-bold text-xs tracking-wider transition"
          >
            🏠 HOME
          </button>
        </div>
      </div>
    </div>
  );
};
