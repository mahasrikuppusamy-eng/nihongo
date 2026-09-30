import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { AvatarType } from '../../types';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { soundManager } from '../../utils/audio';

const AVATAR_OPTIONS: Array<{ id: AvatarType; nameEn: string; nameJa: string; description: string }> = [
  { id: 'samurai', nameEn: 'Samurai', nameJa: '侍', description: 'Master of discipline and honor' },
  { id: 'ninja', nameEn: 'Ninja', nameJa: '忍', description: 'Swift shadow operative' },
  { id: 'sakura', nameEn: 'Sakura', nameJa: '桜', description: 'Spring blossom spirit' },
  { id: 'kitsune', nameEn: 'Kitsune', nameJa: '狐', description: 'Sacred celestial fox' },
  { id: 'tanuki', nameEn: 'Tanuki', nameJa: '狸', description: 'Playful forest trickster' },
  { id: 'fuji', nameEn: 'Mount Fuji', nameJa: '富士', description: 'Majestic eternal peak' },
  { id: 'cat', nameEn: 'Maneki-Neko', nameJa: '招猫', description: 'Bringer of fortune and luck' },
];

export const PlayerLoginModal: React.FC = () => {
  const { isPlayerModalOpen, closePlayerModal, login, player, logout } = usePlayer();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('kitsune');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isPlayerModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMessage('Please enter your name or nickname to step forward.');
      soundManager.playWrong();
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      soundManager.playClick();
      await login(nickname.trim(), selectedAvatar);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating player session. Please retry.');
      soundManager.playWrong();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/60 overflow-hidden">
        {/* Decorative Torii header bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
        
        {/* Close Button */}
        <button
          onClick={closePlayerModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-3xl mb-3 shadow-lg shadow-rose-600/20">
            ⛩️
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white font-['Cinzel',serif]">
            {player ? 'SWITCH CHALLENGER' : 'JOIN THE EXPEDITION'}
          </h2>
          <p className="text-xs text-rose-300 font-['Shippori_Mincho',serif] mt-0.5">
            挑戦者の登録 — 日本語 AI ラボ
          </p>
          <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto">
            Step up to the interactive console, choose your avatar, and stamp your name on the college expo leaderboard!
          </p>
        </div>

        {player && (
          <div className="mb-6 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlayerAvatar avatar={player.avatar} size="sm" />
              <div>
                <div className="text-xs font-bold text-white">Current: {player.nickname}</div>
                <div className="text-[11px] text-amber-400 font-mono">⭐ {player.totalPoints.toLocaleString()} points</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-rose-950 hover:text-rose-300 text-neutral-300 border border-neutral-700 transition"
            >
              Sign Out
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-2">
              What's your name? / お名前
            </label>
            <input
              type="text"
              maxLength={24}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setErrorMessage('');
              }}
              placeholder="e.g., Haruto, Sakura, Kishore..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-rose-900/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-white placeholder-neutral-600 text-sm font-medium transition"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-2">
              Select Your Avatar / アバター選択
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedAvatar === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAvatar(opt.id);
                    }}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-rose-600/30 border-rose-400 scale-105 shadow-md shadow-rose-600/30 ring-2 ring-rose-500/40'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <PlayerAvatar avatar={opt.id} size="sm" showBorder={false} />
                    <span className="text-[10px] font-bold text-neutral-200 mt-1 truncate max-w-full">
                      {opt.nameEn}
                    </span>
                    <span className="text-[8px] text-rose-400/80 font-['Shippori_Mincho',serif]">
                      {opt.nameJa}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closePlayerModal}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white text-xs font-extrabold tracking-wider shadow-lg shadow-rose-600/30 disabled:opacity-50 transition transform active:scale-95 border border-rose-400/50 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'CONNECTING...' : 'ENTER THE LAB ▶'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
