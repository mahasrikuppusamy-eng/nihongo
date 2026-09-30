import { Player, OverallStats, Question, Destination, MysteryClue, GameSubmissionResult, GameType } from '../types';
import {
  HIRAGANA_QUESTIONS,
  VOCABULARY_QUESTIONS,
  KANJI_QUESTIONS,
  CULTURE_QUESTIONS,
  DESTINATIONS_DATA,
  MYSTERY_CHALLENGES,
  SEED_PLAYERS,
} from '../../server/seedData';

const BASE_URL = '/api';

// Helper for offline / GitHub Pages local storage support
const LOCAL_STORAGE_KEY = 'nihongo_client_db_v1';

interface ClientDB {
  players: Player[];
  visitedDestinations: Record<string, string[]>;
}

function getClientDB(): ClientDB {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Local storage error', e);
  }
  const initial: ClientDB = {
    players: [...(SEED_PLAYERS as unknown as Player[])],
    visitedDestinations: {},
  };
  saveClientDB(initial);
  return initial;
}

function saveClientDB(db: ClientDB) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('Failed to save to local storage', e);
  }
}

export async function fetchStats(): Promise<OverallStats> {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch {
    const db = getClientDB();
    const totalPoints = db.players.reduce((acc, p) => acc + p.totalPoints, 0);
    const totalGames = db.players.reduce((acc, p) => acc + p.gamesPlayed, 0);
    const highestScore = db.players.length > 0 ? Math.max(...db.players.map((p) => p.totalPoints)) : 0;
    return {
      totalPlayers: db.players.length,
      totalGames: totalGames || 88,
      totalPoints: totalPoints || 48500,
      highestScore: highestScore || 8450,
      todayPlayers: Math.min(12, db.players.length),
      todayGames: 34,
    };
  }
}

export async function fetchLeaderboard(period: 'all' | 'today' | 'week' = 'all'): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/leaderboard?period=${period}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return await res.json();
  } catch {
    const db = getClientDB();
    return [...db.players].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 50);
  }
}

export async function loginOrRegisterPlayer(nickname: string, avatar: string): Promise<Player> {
  try {
    const res = await fetch(`${BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, avatar }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback for static hosting
  }

  const trimmed = nickname.trim();
  const db = getClientDB();
  let existing = db.players.find((p) => p.nickname.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    if (avatar && existing.avatar !== avatar) {
      existing.avatar = avatar;
      saveClientDB(db);
    }
    return { ...existing };
  }

  const newPlayer: Player = {
    id: `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    nickname: trimmed,
    avatar: avatar || 'kitsune',
    totalPoints: 0,
    level: 1,
    gamesPlayed: 0,
    bestStreak: 0,
    accuracy: 100,
    badges: ['sakura_starter'],
    createdAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
  };

  db.players.push(newPlayer);
  saveClientDB(db);
  return newPlayer;
}

export async function fetchPlayer(id: string): Promise<Player> {
  try {
    const res = await fetch(`${BASE_URL}/players/${id}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const db = getClientDB();
  const found = db.players.find((p) => p.id === id);
  if (found) {
    const visited = db.visitedDestinations[id] || [];
    return { ...found, visitedDestinations: visited };
  }
  throw new Error('Player not found');
}

export async function fetchQuestions(gameType: GameType, limit: number = 10): Promise<Question[]> {
  try {
    const res = await fetch(`${BASE_URL}/questions/${gameType}?limit=${limit}`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback to static seed
  }

  const questionMap: Record<string, any[]> = {
    hiragana: HIRAGANA_QUESTIONS,
    vocabulary: VOCABULARY_QUESTIONS,
    kanji: KANJI_QUESTIONS,
    culture: CULTURE_QUESTIONS,
  };

  const pool = questionMap[gameType] || [];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit).map((q, idx) => ({
    ...q,
    id: `q-client-${idx}-${Date.now()}`,
  }));
}

export async function submitGameResult(params: {
  playerId: string;
  gameType: GameType;
  score: number;
  accuracy: number;
  streak: number;
}): Promise<GameSubmissionResult> {
  try {
    const res = await fetch(`${BASE_URL}/games/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const { playerId, gameType, score, accuracy, streak } = params;
  const db = getClientDB();
  const playerIdx = db.players.findIndex((p) => p.id === playerId);
  if (playerIdx === -1) {
    throw new Error('Player not found');
  }

  const player = db.players[playerIdx];
  const allBefore = [...db.players].sort((a, b) => b.totalPoints - a.totalPoints);
  const oldRank = allBefore.findIndex((p) => p.id === playerId) + 1;

  const unlockedBadges = new Set<string>(player.badges || []);
  unlockedBadges.add('sakura_starter');
  if (gameType === 'hiragana' && score >= 300) unlockedBadges.add('hiragana_hero');
  if (gameType === 'vocabulary') unlockedBadges.add('word_warrior');
  if (gameType === 'kanji' && score >= 400) unlockedBadges.add('kanji_master');
  if (gameType === 'mystery' && score >= 500) unlockedBadges.add('mystery_solver');
  if (streak >= 10 || player.bestStreak >= 10) unlockedBadges.add('streak_samurai');
  if (unlockedBadges.size >= 5) unlockedBadges.add('expo_champion');

  const newlyUnlocked: string[] = [];
  unlockedBadges.forEach((b) => {
    if (!player.badges.includes(b)) newlyUnlocked.push(b);
  });

  const newTotalPoints = Math.max(0, player.totalPoints + score);
  const newGamesPlayed = player.gamesPlayed + 1;
  const newBestStreak = Math.max(player.bestStreak, streak);
  const calculatedAcc = Math.round((player.accuracy * player.gamesPlayed + accuracy) / newGamesPlayed);
  const newLevel = Math.max(1, Math.floor(newTotalPoints / 500) + 1);

  const updatedPlayer: Player = {
    ...player,
    totalPoints: newTotalPoints,
    gamesPlayed: newGamesPlayed,
    bestStreak: newBestStreak,
    accuracy: Math.min(100, Math.max(0, calculatedAcc)),
    level: newLevel,
    badges: Array.from(unlockedBadges),
    lastPlayedAt: new Date().toISOString(),
  };

  db.players[playerIdx] = updatedPlayer;
  saveClientDB(db);

  const allAfter = [...db.players].sort((a, b) => b.totalPoints - a.totalPoints);
  const newRank = allAfter.findIndex((p) => p.id === playerId) + 1;

  return {
    player: updatedPlayer,
    rankDelta: oldRank - newRank,
    newRank,
    oldRank,
    newBadges: newlyUnlocked,
    result: {
      id: `res-${Date.now()}`,
      playerId,
      playerNickname: player.nickname,
      playerAvatar: player.avatar,
      gameType,
      score,
      accuracy,
      streak,
      completedAt: new Date().toISOString(),
    },
  };
}

export async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${BASE_URL}/destinations`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return [...DESTINATIONS_DATA];
}

export async function exploreDestination(playerId: string, destinationId: string): Promise<{ awarded: boolean; points: number; totalVisited: number }> {
  try {
    const res = await fetch(`${BASE_URL}/destinations/explore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId, destinationId }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  const db = getClientDB();
  if (!db.visitedDestinations[playerId]) {
    db.visitedDestinations[playerId] = [];
  }
  const visited = db.visitedDestinations[playerId];
  if (visited.includes(destinationId)) {
    return { awarded: false, points: 0, totalVisited: visited.length };
  }

  visited.push(destinationId);
  const pointsAwarded = 25;
  const pIdx = db.players.findIndex((p) => p.id === playerId);
  if (pIdx !== -1) {
    db.players[pIdx].totalPoints += pointsAwarded;
    if (visited.length >= 5 && !db.players[pIdx].badges.includes('japan_explorer')) {
      db.players[pIdx].badges.push('japan_explorer');
    }
    saveClientDB(db);
  }

  return { awarded: true, points: pointsAwarded, totalVisited: visited.length };
}

export async function fetchMysteryClues(): Promise<MysteryClue[]> {
  try {
    const res = await fetch(`${BASE_URL}/mystery/clues`);
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return [...MYSTERY_CHALLENGES];
}

// Admin APIs
export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  return passcode === 'sakura2025';
}

export async function fetchAdminPlayers(passcode: string): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/admin/players`, {
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const db = getClientDB();
  return [...db.players].sort((a, b) => b.totalPoints - a.totalPoints);
}

export async function deleteAdminPlayer(id: string, passcode: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/admin/players/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  const db = getClientDB();
  db.players = db.players.filter((p) => p.id !== id);
  saveClientDB(db);
  return true;
}

export async function resetLeaderboardAdmin(passcode: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/admin/reset-leaderboard`, {
      method: 'POST',
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  const db = getClientDB();
  db.players = [];
  db.visitedDestinations = {};
  saveClientDB(db);
  return true;
}

export async function reseedDemoAdmin(passcode: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/admin/seed`, {
      method: 'POST',
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) return true;
  } catch {
    // Fallback
  }
  saveClientDB({
    players: [...(SEED_PLAYERS as unknown as Player[])],
    visitedDestinations: {},
  });
  return true;
}
