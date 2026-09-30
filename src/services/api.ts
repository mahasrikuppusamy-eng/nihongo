import { Player, OverallStats, Question, Destination, MysteryClue, GameSubmissionResult, GameType } from '../types';

const BASE_URL = '/api';

export async function fetchStats(): Promise<OverallStats> {
  try {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    console.warn('API fetchStats error, returning default stats', err);
    return {
      totalPlayers: 16,
      totalGames: 88,
      totalPoints: 48500,
      highestScore: 8450,
      todayPlayers: 12,
      todayGames: 34,
    };
  }
}

export async function fetchLeaderboard(period: 'all' | 'today' | 'week' = 'all'): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/leaderboard?period=${period}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return await res.json();
  } catch (err) {
    console.warn('API fetchLeaderboard error', err);
    return [];
  }
}

export async function loginOrRegisterPlayer(nickname: string, avatar: string): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, avatar }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create player' }));
    throw new Error(err.error || 'Failed to create player');
  }
  return await res.json();
}

export async function fetchPlayer(id: string): Promise<Player> {
  const res = await fetch(`${BASE_URL}/players/${id}`);
  if (!res.ok) throw new Error('Player not found');
  return await res.json();
}

export async function fetchQuestions(gameType: GameType, limit: number = 10): Promise<Question[]> {
  try {
    const res = await fetch(`${BASE_URL}/questions/${gameType}?limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to load ${gameType} questions`);
    return await res.json();
  } catch (err) {
    console.warn('API fetchQuestions error', err);
    return [];
  }
}

export async function submitGameResult(params: {
  playerId: string;
  gameType: GameType;
  score: number;
  accuracy: number;
  streak: number;
}): Promise<GameSubmissionResult> {
  const res = await fetch(`${BASE_URL}/games/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Submission failed' }));
    throw new Error(err.error || 'Submission failed');
  }
  return await res.json();
}

export async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${BASE_URL}/destinations`);
    if (!res.ok) throw new Error('Failed to load destinations');
    return await res.json();
  } catch (err) {
    console.warn('API fetchDestinations error', err);
    return [];
  }
}

export async function exploreDestination(playerId: string, destinationId: string): Promise<{ awarded: boolean; points: number; totalVisited: number }> {
  const res = await fetch(`${BASE_URL}/destinations/explore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, destinationId }),
  });
  if (!res.ok) throw new Error('Failed to record exploration');
  return await res.json();
}

export async function fetchMysteryClues(): Promise<MysteryClue[]> {
  try {
    const res = await fetch(`${BASE_URL}/mystery/clues`);
    if (!res.ok) throw new Error('Failed to load mystery clues');
    return await res.json();
  } catch (err) {
    console.warn('API fetchMysteryClues error', err);
    return [];
  }
}

// Admin APIs
export async function verifyAdminPasscode(passcode: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/admin/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  return res.ok;
}

export async function fetchAdminPlayers(passcode: string): Promise<Player[]> {
  const res = await fetch(`${BASE_URL}/admin/players`, {
    headers: { 'x-admin-passcode': passcode },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function deleteAdminPlayer(id: string, passcode: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/admin/players/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-passcode': passcode },
  });
  return res.ok;
}

export async function resetLeaderboardAdmin(passcode: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/admin/reset-leaderboard`, {
    method: 'POST',
    headers: { 'x-admin-passcode': passcode },
  });
  return res.ok;
}

export async function reseedDemoAdmin(passcode: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/admin/seed`, {
    method: 'POST',
    headers: { 'x-admin-passcode': passcode },
  });
  return res.ok;
}
