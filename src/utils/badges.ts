import { BadgeInfo } from '../types';

export const BADGES_LIST: BadgeInfo[] = [
  {
    id: 'sakura_starter',
    title: 'Sakura Starter',
    titleJa: '桜の始まり',
    icon: '🌸',
    description: 'Began your journey into Japanese language and culture.',
  },
  {
    id: 'hiragana_hero',
    title: 'Hiragana Hero',
    titleJa: '平仮名の勇者',
    icon: '🈁',
    description: 'Mastered the sacred symbols of Hiragana Dojo.',
  },
  {
    id: 'word_warrior',
    title: 'Word Warrior',
    titleJa: '言葉の戦士',
    icon: '📚',
    description: 'Conquered vocabulary quests across essential daily categories.',
  },
  {
    id: 'kanji_master',
    title: 'Kanji Master',
    titleJa: '漢字の達人',
    icon: '🈶',
    description: 'Decoded character meanings from basic strokes to advanced wisdom.',
  },
  {
    id: 'japan_explorer',
    title: 'Japan Explorer',
    titleJa: '日本探検家',
    icon: '🗾',
    description: 'Explored 5 or more iconic destinations across the interactive map.',
  },
  {
    id: 'mystery_solver',
    title: 'Mystery Solver',
    titleJa: '謎解きの師',
    icon: '🧩',
    description: 'Cracked the multi-stage cryptographic Japanese mystery puzzles.',
  },
  {
    id: 'streak_samurai',
    title: 'Streak Samurai',
    titleJa: '連勝の侍',
    icon: '🔥',
    description: 'Achieved an unbroken streak of 10 or more consecutive correct answers.',
  },
  {
    id: 'expo_champion',
    title: 'Expo Champion',
    titleJa: '万博の覇者',
    icon: '🏆',
    description: 'Earned legendary status among the top challengers of the college expo.',
  },
];

export function getBadgeDetails(badgeId: string): BadgeInfo {
  const found = BADGES_LIST.find((b) => b.id === badgeId);
  if (found) return found;
  return {
    id: badgeId,
    title: badgeId.replace(/_/g, ' ').toUpperCase(),
    titleJa: '名誉の印',
    icon: '🎖️',
    description: 'Distinguished accomplishment in Nihongo AI Lab.',
  };
}
