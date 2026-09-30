import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Player, OverallStats } from '../../types';
import {
  verifyAdminPasscode,
  fetchAdminPlayers,
  deleteAdminPlayer,
  resetLeaderboardAdmin,
  reseedDemoAdmin,
  fetchStats,
} from '../../services/api';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { soundManager } from '../../utils/audio';

export const AdminDashboard: React.FC = () => {
  const { setCurrentView, showToast } = usePlayer();
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    setIsLoading(true);

    try {
      const ok = await verifyAdminPasscode(passcode);
      if (ok) {
        setIsAuthenticated(true);
        soundManager.playCorrect();
        showToast('Admin Authenticated', 'Access granted to Expo Controls', 'success');
        loadAdminData(passcode);
      } else {
        setPasscodeError('Invalid passcode. (Default: sakura2025)');
        soundManager.playWrong();
      }
    } catch {
      setPasscodeError('Verification failed. Try again.');
      soundManager.playWrong();
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async (adminCode: string) => {
    try {
      const [s, p] = await Promise.all([fetchStats(), fetchAdminPlayers(adminCode)]);
      setStats(s);
      setPlayers(p);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlayer = async (id: string, name: string) => {
    if (!window.confirm(`Delete test player "${name}"?`)) return;
    setIsActionLoading(true);
    try {
      const ok = await deleteAdminPlayer(id, passcode);
      if (ok) {
        showToast('Player Deleted', `${name} removed from database`, 'info');
        setPlayers((prev) => prev.filter((p) => p.id !== id));
        fetchStats().then(setStats);
      }
    } catch {
      showToast('Error', 'Failed to delete player', 'info');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResetLeaderboard = async () => {
    if (!window.confirm('⚠️ ARE YOU SURE? This will wipe all player leaderboard scores to start fresh for the live expo!')) return;
    setIsActionLoading(true);
    try {
      const ok = await resetLeaderboardAdmin(passcode);
      if (ok) {
        showToast('Leaderboard Reset', 'Clean slate ready for expo visitors!', 'success');
        setPlayers([]);
        fetchStats().then(setStats);
      }
    } catch {
      showToast('Error', 'Failed to reset leaderboard', 'info');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReseed = async () => {
    if (!window.confirm('Restore demo leaderboard players (Haruto, Sakura, Kishore, etc.) and full Japanese syllabus?')) return;
    setIsActionLoading(true);
    try {
      const ok = await reseedDemoAdmin(passcode);
      if (ok) {
        showToast('Data Restored', 'Seeded demo challengers and curriculum successfully!', 'success');
        loadAdminData(passcode);
      }
    } catch {
      showToast('Error', 'Failed to re-seed demo data', 'info');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Passcode gate view
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-neutral-900 border-2 border-rose-500/40 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-600/50 flex items-center justify-center text-3xl mx-auto mb-4">
            ⚙️
          </div>
          <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">EXPO TEAM ADMIN</h2>
          <p className="text-xs text-rose-300 font-['Shippori_Mincho',serif] mt-0.5">
            プロジェクト展示会・管理者ダッシュボード
          </p>
          <p className="text-xs text-neutral-400 mt-2 mb-6">
            Enter the expo team passcode to manage leaderboard scores, reset test data, and monitor expo stats.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Admin Passcode (default: sakura2025)"
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm text-center focus:border-rose-500 focus:outline-none"
              autoFocus
            />

            {passcodeError && (
              <div className="text-xs text-red-400 font-medium">{passcodeError}</div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition"
              >
                Back to Home
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
              >
                {isLoading ? 'Verifying...' : 'Unlock Console ▶'}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
            Passcode configured in <code>.env</code> as <code>ADMIN_PASSCODE="sakura2025"</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-2xl">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif]">
              PROJECT-EXPO CONTROL CENTER
            </h2>
            <div className="text-xs text-rose-400 font-['Shippori_Mincho',serif]">
              展示会管理コンソール • リアルタイム・データベース
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReseed}
            disabled={isActionLoading}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition"
          >
            🔄 Re-Seed Demo Data
          </button>

          <button
            onClick={handleResetLeaderboard}
            disabled={isActionLoading}
            className="px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-800 transition"
          >
            ⚠️ Reset Leaderboard
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition"
          >
            Lock Admin
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Total Players</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {stats.totalPlayers}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Total Games</div>
            <div className="text-xl font-black text-rose-300 font-mono mt-1">
              {stats.totalGames}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Total Points</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-1">
              ⭐ {stats.totalPoints.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Highest Score</div>
            <div className="text-xl font-black text-yellow-300 font-mono mt-1">
              {stats.highestScore.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Today's Players</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {stats.todayPlayers}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[10px] uppercase font-bold text-neutral-400">Today's Games</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-1">
              {stats.todayGames}
            </div>
          </div>
        </div>
      )}

      {/* Players Management Table */}
      <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-['Cinzel',serif]">
              EXPO CHALLENGERS DATABASE ({players.length} Records)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Review visitor records, inspect performance, or remove invalid test runs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Avatar & Name</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Games</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {players.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <PlayerAvatar avatar={p.avatar} size="sm" />
                      <span className="font-bold text-white font-sans text-xs">{p.nickname}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">Lv.{p.level}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">
                    ⭐ {p.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">{p.gamesPlayed}</td>
                  <td className="py-3 px-4 text-orange-400">🔥 {p.bestStreak}</td>
                  <td className="py-3 px-4 text-emerald-400">{p.accuracy}%</td>
                  <td className="py-3 px-4 text-neutral-300">
                    {p.badges?.length || 0} badges
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeletePlayer(p.id, p.nickname)}
                      className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
