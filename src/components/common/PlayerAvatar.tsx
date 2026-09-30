import React from 'react';
import { AvatarType } from '../../types';

interface PlayerAvatarProps {
  avatar: AvatarType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBorder?: boolean;
  className?: string;
  rankBadge?: number;
}

const AVATAR_CONFIG: Record<string, { icon: string; nameJa: string; color: string; border: string; bg: string }> = {
  samurai: {
    icon: '⚔️',
    nameJa: '侍',
    color: 'text-amber-400',
    border: 'border-amber-500/70',
    bg: 'from-amber-950/80 via-rose-950/60 to-black',
  },
  ninja: {
    icon: '🥷',
    nameJa: '忍',
    color: 'text-purple-300',
    border: 'border-purple-500/70',
    bg: 'from-purple-950/80 via-slate-950/80 to-black',
  },
  sakura: {
    icon: '🌸',
    nameJa: '桜',
    color: 'text-rose-300',
    border: 'border-rose-400/80',
    bg: 'from-rose-950/80 via-pink-950/60 to-black',
  },
  kitsune: {
    icon: '🦊',
    nameJa: '狐',
    color: 'text-orange-400',
    border: 'border-orange-500/70',
    bg: 'from-orange-950/80 via-red-950/60 to-black',
  },
  tanuki: {
    icon: '🦝',
    nameJa: '狸',
    color: 'text-emerald-400',
    border: 'border-emerald-500/70',
    bg: 'from-emerald-950/80 via-teal-950/60 to-black',
  },
  fuji: {
    icon: '🗻',
    nameJa: '富士',
    color: 'text-sky-300',
    border: 'border-sky-400/70',
    bg: 'from-sky-950/80 via-blue-950/60 to-black',
  },
  cat: {
    icon: '🐱',
    nameJa: '招猫',
    color: 'text-yellow-300',
    border: 'border-yellow-400/70',
    bg: 'from-yellow-950/80 via-amber-950/60 to-black',
  },
};

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  avatar,
  size = 'md',
  showBorder = true,
  className = '',
  rankBadge,
}) => {
  const config = AVATAR_CONFIG[avatar] || AVATAR_CONFIG.kitsune;

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
    '2xl': 'w-32 h-32 text-6xl',
  }[size];

  const rankBadgeSize = {
    sm: 'w-4 h-4 text-[9px] -top-1 -right-1',
    md: 'w-5 h-5 text-[11px] -top-1.5 -right-1.5',
    lg: 'w-7 h-7 text-xs -top-2 -right-2',
    xl: 'w-8 h-8 text-sm -top-2 -right-2',
    '2xl': 'w-10 h-10 text-base -top-2.5 -right-2.5',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`rounded-full flex items-center justify-center bg-gradient-to-br ${config.bg} shadow-lg shadow-black/50 select-none transition-transform duration-300 hover:scale-105 ${
          showBorder ? `border-2 ${config.border}` : ''
        } ${sizeClasses}`}
      >
        <span className="drop-shadow-md">{config.icon}</span>
      </div>

      {rankBadge !== undefined && (
        <span
          className={`absolute rounded-full font-bold flex items-center justify-center shadow-md border ${rankBadgeSize} ${
            rankBadge === 1
              ? 'bg-amber-400 text-black border-amber-200 animate-pulse'
              : rankBadge === 2
              ? 'bg-slate-300 text-black border-white'
              : rankBadge === 3
              ? 'bg-amber-700 text-white border-amber-500'
              : 'bg-neutral-800 text-neutral-300 border-neutral-600'
          }`}
        >
          {rankBadge <= 3 ? ['🥇', '🥈', '🥉'][rankBadge - 1] : `#${rankBadge}`}
        </span>
      )}
    </div>
  );
};
