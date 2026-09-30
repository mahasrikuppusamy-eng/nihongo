import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Player } from '../../types';
import { fetchLeaderboard } from '../../services/api';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { soundManager } from '../../utils/audio';

export const Leaderboard: React.FC = () => {
  const { player } = usePlayer();
  const [period, setPeriod] = useState<'all' | 'today' | 'week'>('all');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async (selectedPeriod: 'all' | 'today' | 'week') => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboard(selectedPeriod);
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(period);
  }, [period]);

  const top3 = players.slice(0, 3);
  const remaining = players.slice(3);

  // Top 3 Podium order: [Rank 2 (Silver), Rank 1 (Gold), Rank 3 (Bronze)]
  const podiumOrder = [
    { rank: 2, player: top3[1], medal: '🥈', border: 'border-slate-300', bg: 'from-slate-900 via-neutral-900 to-black', h: 'h-64 sm:h-72' },
    { rank: 1, player: top3[0], medal: '🥇', border: 'border-amber-400', bg: 'from-amber-950/60 via-yellow-950/30 to-black', h: 'h-76 sm:h-84' },
    { rank: 3, player: top3[2], medal: '🥉', border: 'border-amber-700', bg: 'from-amber-950/40 via-neutral-900 to-black', h: 'h-56 sm:h-64' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Japanese Subtitle */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <span>🏆</span>
          <span>HALL OF MASTERS • LIVE EXPO STANDINGS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] tracking-wider">
          JAPAN CHALLENGERS
        </h2>
        <div className="text-amber-400 font-['Shippori_Mincho',serif] text-sm mt-1 tracking-widest">
          日本挑戦者番付 — 栄光の殿堂
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
          Updated live from the database as challengers complete games and solve mysteries across the expo.
        </p>
      </div>

      {/* Period Selection Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <div className="bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800 flex items-center gap-1 shadow-lg">
          {(
            [
              { id: 'today', label: 'TODAY', ja: '本日', icon: '🥇' },
              { id: 'week', label: 'THIS WEEK', ja: '今週', icon: '🥈' },
              { id: 'all', label: 'ALL TIME', ja: '歴代', icon: '🥉' },
            ] as const
          ).map((tab) => {
            const isActive = period === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setPeriod(tab.id);
                }}
                className={`flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-neutral-950 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-70 font-['Shippori_Mincho',serif] hidden sm:inline">
                  ({tab.ja})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
          <p className="text-amber-300 font-['Cinzel',serif] tracking-wider text-xs">
            SUMMONING LEADERBOARD DATA...
          </p>
        </div>
      ) : players.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-neutral-900/60 border border-neutral-800">
          <div className="text-4xl mb-3">⛩️</div>
          <h3 className="text-lg font-bold text-white">No Challengers Yet</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Be the first champion to step up and claim the #1 spot on the expo stage!
          </p>
        </div>
      ) : (
        <>
          {/* TOP 3 PODIUM SECTION */}
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-6 items-end max-w-3xl mx-auto mb-12 px-2">
              {podiumOrder.map((slot) => {
                const p = slot.player;
                if (!p) {
                  return <div key={slot.rank} className="opacity-0" />;
                }

                const isFirst = slot.rank === 1;

                return (
                  <div
                    key={slot.rank}
                    className={`relative rounded-3xl p-3 sm:p-5 border-2 ${slot.border} bg-gradient-to-t ${slot.bg} shadow-2xl flex flex-col items-center justify-between backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 ${slot.h}`}
                  >
                    {/* Crown or Rank Ribbon */}
                    <div className="absolute -top-5 flex flex-col items-center">
                      {isFirst ? (
                        <div className="text-2xl sm:text-3xl animate-bounce drop-shadow-[0_2px_12px_rgba(251,191,36,0.8)]">
                          👑
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-sm shadow">
                          {slot.medal}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="mt-4 sm:mt-5 flex flex-col items-center">
                      <PlayerAvatar
                        avatar={p.avatar}
                        size={isFirst ? 'xl' : 'lg'}
                        rankBadge={slot.rank}
                        className={isFirst ? 'ring-4 ring-amber-400/40' : ''}
                      />
                      <h4 className="text-xs sm:text-sm font-extrabold text-white mt-2 truncate max-w-[90px] sm:max-w-[130px] font-['Cinzel',serif]">
                        {p.nickname}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Lv.{p.level} • {p.gamesPlayed} games
                      </span>
                    </div>

                    {/* Podium Bottom Points Block */}
                    <div className="w-full text-center mt-2 pt-2 border-t border-neutral-800/80">
                      <div className="text-sm sm:text-lg font-black text-amber-300 font-mono tracking-wide">
                        ⭐ {p.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400">
                        {p.bestStreak > 0 ? `Streak 🔥 ${p.bestStreak}` : 'Challenger'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* REMAINING PLAYERS RANKING LIST (Rank 4+) */}
          {remaining.length > 0 && (
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
              <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
                <div className="flex items-center gap-6">
                  <span className="w-8 text-center">Rank</span>
                  <span>Challenger</span>
                </div>
                <div className="flex items-center gap-6 sm:gap-12">
                  <span className="hidden sm:inline">Accuracy</span>
                  <span className="hidden sm:inline">Streak</span>
                  <span className="w-24 text-right">Points</span>
                </div>
              </div>

              <div className="divide-y divide-neutral-800/60 max-h-[420px] overflow-y-auto">
                {remaining.map((p, idx) => {
                  const rankNum = idx + 4;
                  const isCurrent = player?.id === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`px-6 py-3.5 flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-rose-950/40 border-l-4 border-rose-500'
                          : 'hover:bg-neutral-800/40'
                      }`}
                    >
                      {/* Left: Rank & Avatar & Name */}
                      <div className="flex items-center gap-4">
                        <span className="w-8 text-center font-mono font-bold text-neutral-400 text-sm">
                          #{rankNum}
                        </span>
                        <PlayerAvatar avatar={p.avatar} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {p.nickname}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Level {p.level} • {p.gamesPlayed} games played
                          </div>
                        </div>
                      </div>

                      {/* Right: Accuracy, Streak, Points */}
                      <div className="flex items-center gap-6 sm:gap-12 text-xs">
                        <span className="hidden sm:inline text-neutral-300 font-mono">
                          {p.accuracy}%
                        </span>
                        <span className="hidden sm:inline text-orange-400 font-mono font-semibold">
                          🔥 {p.bestStreak}
                        </span>
                        <div className="w-24 text-right font-mono font-black text-amber-400 text-sm">
                          ⭐ {p.totalPoints.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
