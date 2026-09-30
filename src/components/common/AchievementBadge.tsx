import React from 'react';
import { getBadgeDetails } from '../../utils/badges';

interface AchievementBadgeProps {
  badgeId: string;
  isUnlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  badgeId,
  isUnlocked = true,
  size = 'md',
  showDetails = false,
}) => {
  const badge = getBadgeDetails(badgeId);

  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  }[size];

  return (
    <div className="flex flex-col items-center text-center group">
      <div
        className={`relative rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${sizeClasses} ${
          isUnlocked
            ? 'bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-400/80 shadow-amber-500/20 group-hover:scale-110 group-hover:shadow-amber-500/40'
            : 'bg-neutral-900/60 border border-neutral-800 text-neutral-600 grayscale opacity-60'
        }`}
      >
        <span className={`select-none ${isUnlocked ? 'filter drop-shadow-md' : ''}`}>{badge.icon}</span>

        {!isUnlocked && (
          <span className="absolute -bottom-1 -right-1 text-xs bg-neutral-950 px-1 py-0.5 rounded border border-neutral-700">
            🔒
          </span>
        )}
      </div>

      <div className="mt-2">
        <div className={`text-xs font-semibold ${isUnlocked ? 'text-neutral-200' : 'text-neutral-500'}`}>
          {badge.title}
        </div>
        <div className="text-[10px] text-rose-400/80 font-serif">{badge.titleJa}</div>

        {showDetails && (
          <p className="text-[11px] text-neutral-400 mt-1 max-w-[140px] leading-tight">
            {badge.description}
          </p>
        )}
      </div>
    </div>
  );
};
