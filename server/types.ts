export interface IPlayer {
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
}

export interface IGameResult {
  id: string;
  playerId: string;
  playerNickname: string;
  playerAvatar: string;
  gameType: 'hiragana' | 'vocabulary' | 'kanji' | 'culture' | 'explorer' | 'mystery';
  score: number;
  accuracy: number;
  streak: number;
  completedAt: string;
}

export interface IQuestion {
  id: string;
  gameType: 'hiragana' | 'vocabulary' | 'kanji' | 'culture' | 'mystery';
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

export interface IDestination {
  id: string;
  nameJa: string;
  nameEn: string;
  region: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map
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

export interface IMysteryClue {
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
