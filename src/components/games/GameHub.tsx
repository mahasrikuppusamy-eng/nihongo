import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { GameType } from '../../types';
import { soundManager } from '../../utils/audio';

interface GameCardMeta {
  id: GameType;
  icon: string;
  nameJa: string;
  nameEn: string;
  description: string;
  difficulty: 'Beginner' | 'Multi-Level' | 'Challenger' | 'Explorer' | 'Mystery Master';
  maxPoints: number;
  colorScheme: {
    border: string;
    glow: string;
    badgeBg: string;
    btnGrad: string;
    iconBg: string;
  };
}

const GAME_CARDS: GameCardMeta[] = [
  {
    id: 'hiragana',
    icon: '🈁',
    nameJa: '平仮名道場',
    nameEn: 'HIRAGANA DOJO',
    description: 'Master the fundamental syllabary of Japan across 3 progressive belts with combo streaks and speed multipliers.',
    difficulty: 'Beginner',
    maxPoints: 1200,
    colorScheme: {
      border: 'border-rose-500/40 hover:border-rose-400',
      glow: 'group-hover:shadow-rose-500/20',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      btnGrad: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30',
      iconBg: 'bg-rose-950/80 text-rose-300 border-rose-600/50',
    },
  },
  {
    id: 'vocabulary',
    icon: '📚',
    nameJa: '語彙クエスト',
    nameEn: 'VOCABULARY QUEST',
    description: 'Explore 6 rich categories: Food, Travel, Education, People, Daily Life & Nature in both JP→EN and EN→JP.',
    difficulty: 'Multi-Level',
    maxPoints: 1400,
    colorScheme: {
      border: 'border-blue-500/40 hover:border-blue-400',
      glow: 'group-hover:shadow-blue-500/20',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      btnGrad: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30',
      iconBg: 'bg-blue-950/80 text-blue-300 border-blue-600/50',
    },
  },
  {
    id: 'kanji',
    icon: '🈶',
    nameJa: '漢字マスター',
    nameEn: 'KANJI MASTER',
    description: 'Recognize timeless Chinese-Japanese characters from basic elements (Sun, Moon, Fire) to deep cultural virtues.',
    difficulty: 'Challenger',
    maxPoints: 1600,
    colorScheme: {
      border: 'border-amber-500/40 hover:border-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      btnGrad: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30',
      iconBg: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
    },
  },
  {
    id: 'culture',
    icon: '🎎',
    nameJa: '文化チャレンジ',
    nameEn: 'JAPANESE CULTURE CHALLENGE',
    description: 'Immerse in Japanese heritage: Kimono, tea ceremonies, Shinto torii gates, sumo wrestling, and sacred omotenashi.',
    difficulty: 'Multi-Level',
    maxPoints: 1300,
    colorScheme: {
      border: 'border-purple-500/40 hover:border-purple-400',
      glow: 'group-hover:shadow-purple-500/20',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      btnGrad: 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-600/30',
      iconBg: 'bg-purple-950/80 text-purple-300 border-purple-600/50',
    },
  },
  {
    id: 'explorer',
    icon: '🗾',
    nameJa: '日本探検',
    nameEn: 'JAPAN EXPLORER',
    description: 'Interactive map voyage across Tokyo, Kyoto, Osaka, Mount Fuji, Okinawa, and Hokkaido with local phrases and rewards.',
    difficulty: 'Explorer',
    maxPoints: 800,
    colorScheme: {
      border: 'border-emerald-500/40 hover:border-emerald-400',
      glow: 'group-hover:shadow-emerald-500/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      btnGrad: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30',
      iconBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
    },
  },
  {
    id: 'mystery',
    icon: '🧩',
    nameJa: '暗号の謎解き',
    nameEn: 'MYSTERY CODE',
    description: 'Deconstruct Japanese cryptographic ciphers across stages to unlock the grand vault of "SECRET JAPAN CODE"!',
    difficulty: 'Mystery Master',
    maxPoints: 1800,
    colorScheme: {
      border: 'border-cyan-500/40 hover:border-cyan-400',
      glow: 'group-hover:shadow-cyan-500/20',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      btnGrad: 'from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30',
      iconBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50',
    },
  },
];

export const GameHub: React.FC = () => {
  const { selectGame, openPlayerModal, player } = usePlayer();

  const handlePlayClick = (gameId: GameType) => {
    soundManager.playClick();
    if (!player) {
      openPlayerModal();
    } else {
      selectGame(gameId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <span>🥋</span>
          <span>SELECT YOUR TRAINING DOJO</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] tracking-wide">
          THE SIX INTERACTIVE CHALLENGES
        </h2>
        <p className="text-rose-400 font-['Shippori_Mincho',serif] text-sm mt-1">
          六つの挑戦道場 — 日本語と日本文化の探求
        </p>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
          Every completed session contributes points directly to the live expo leaderboard. Test your language sharpness, uncover cultural lore, and unlock achievement badges!
        </p>
      </div>

      {/* Grid of 6 Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAME_CARDS.map((card) => {
          return (
            <div
              key={card.id}
              className={`group relative rounded-3xl p-6 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950/90 border-2 ${card.colorScheme.border} backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${card.colorScheme.glow} flex flex-col justify-between`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-inner ${card.colorScheme.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${card.colorScheme.badgeBg}`}
                    >
                      {card.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      Max: {card.maxPoints.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                {/* Titles */}
                <div className="text-xs font-bold text-rose-400 font-['Shippori_Mincho',serif] tracking-widest">
                  {card.nameJa}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white font-['Cinzel',serif] tracking-wide mt-0.5">
                  {card.nameEn}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="text-[11px] text-neutral-400">
                  {player ? (
                    <span className="text-neutral-300">
                      Challenger: <strong className="text-white">{player.nickname}</strong>
                    </span>
                  ) : (
                    <span className="text-rose-400/80">Tap to Start</span>
                  )}
                </div>

                <button
                  onClick={() => handlePlayClick(card.id)}
                  className={`py-2 px-5 rounded-xl bg-gradient-to-r ${card.colorScheme.btnGrad} text-white font-bold text-xs tracking-wider shadow-lg transition transform active:scale-95 flex items-center gap-1.5`}
                >
                  <span>PLAY NOW</span>
                  <span>▶</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
