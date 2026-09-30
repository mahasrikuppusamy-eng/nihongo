export type AvatarType = 'samurai' | 'ninja' | 'sakura' | 'kitsune' | 'tanuki' | 'fuji' | 'cat';

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  totalPoints: number;
  level: number;
  gamesPlayed: number;
  bestStreak: number;
  accuracy: number;
  badges: string[];
  createdAt: string;
  lastPlayedAt: string;
  visitedDestinations?: string[];
}

export type GameType = 'hiragana' | 'vocabulary' | 'kanji' | 'culture' | 'explorer' | 'mystery';

export interface Question {
  id: string;
  gameType: GameType;
  question: string;
  subtext?: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  category?: string;
  explanation?: string;
  imageUrl?: string;
}

export interface Destination {
  id: string;
  nameJa: string;
  nameEn: string;
  region: string;
  coordinates: { x: number; y: number };
  tagline: string;
  famousFor: string[];
  traditionalFood: string;
  culture: string;
  interestingFact: string;
  japanesePhrase: {
    japanese: string;
    romaji: string;
    english: string;
  };
  pointsAwarded: number;
}

export interface MysteryClue {
  id: string;
  stage: number;
  title: string;
  japaneseText: string;
  romajiText: string;
  hint: string;
  decodedMeaning: string;
  options: string[];
  storyText: string;
}

export interface GameSubmissionResult {
  player: Player;
  rankDelta: number;
  newRank: number;
  oldRank: number;
  newBadges: string[];
  result: {
    id: string;
    playerId: string;
    playerNickname: string;
    playerAvatar: string;
    gameType: GameType;
    score: number;
    accuracy: number;
    streak: number;
    completedAt: string;
  };
}

export interface OverallStats {
  totalPlayers: number;
  totalGames: number;
  totalPoints: number;
  highestScore: number;
  todayPlayers: number;
  todayGames: number;
}

export interface BadgeInfo {
  id: string;
  title: string;
  titleJa: string;
  icon: string;
  description: string;
}
