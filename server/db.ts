import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { IPlayer, IGameResult, IQuestion, IDestination, IMysteryClue } from './types.js';
import {
  HIRAGANA_QUESTIONS,
  VOCABULARY_QUESTIONS,
  KANJI_QUESTIONS,
  CULTURE_QUESTIONS,
  DESTINATIONS_DATA,
  MYSTERY_CHALLENGES,
  SEED_PLAYERS,
} from './seedData.js';
import { PlayerModel } from './models/Player.js';
import { GameResultModel } from './models/GameResult.js';
import { QuestionModel } from './models/Question.js';
import { DestinationModel } from './models/Destination.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'storage.json');

interface LocalStorageSchema {
  players: IPlayer[];
  gameResults: IGameResult[];
  questions: IQuestion[];
  destinations: IDestination[];
  mysteryClues: IMysteryClue[];
  visitedDestinations: Record<string, string[]>; // playerId -> destinationId[]
}

class DatabaseManager {
  private isMongoConnected: boolean = false;
  private localStore: LocalStorageSchema = {
    players: [],
    gameResults: [],
    questions: [],
    destinations: [],
    mysteryClues: [],
    visitedDestinations: {},
  };

  constructor() {
    this.ensureDataDir();
    this.loadLocalStorage();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory:', err);
      }
    }
  }

  private loadLocalStorage() {
    if (fs.existsSync(STORAGE_FILE)) {
      try {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        this.localStore = JSON.parse(raw);
        console.log(`[Database] Loaded persistent storage: ${this.localStore.players.length} players, ${this.localStore.questions.length} questions.`);
      } catch (e) {
        console.warn('[Database] Storage file corrupted or invalid, re-initializing.');
        this.seedLocalStorage();
      }
    } else {
      this.seedLocalStorage();
    }
  }

  private saveLocalStorage() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.localStore, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write storage file:', err);
    }
  }

  public seedLocalStorage(force: boolean = false) {
    if (this.localStore.questions.length > 0 && !force) {
      return;
    }

    const allQuestions: IQuestion[] = [];
    let qId = 1;

    [...HIRAGANA_QUESTIONS, ...VOCABULARY_QUESTIONS, ...KANJI_QUESTIONS, ...CULTURE_QUESTIONS].forEach((q) => {
      allQuestions.push({
        ...q,
        id: `q-${qId++}`,
      });
    });

    const now = new Date();
    const demoResults: IGameResult[] = [];
    SEED_PLAYERS.slice(0, 8).forEach((p, idx) => {
      demoResults.push({
        id: `res-seed-${idx}`,
        playerId: p.id,
        playerNickname: p.nickname,
        playerAvatar: p.avatar,
        gameType: 'hiragana',
        score: Math.floor(p.totalPoints * 0.4),
        accuracy: p.accuracy,
        streak: p.bestStreak,
        completedAt: new Date(now.getTime() - (idx + 1) * 3600000).toISOString(),
      });
    });

    this.localStore = {
      players: [...SEED_PLAYERS],
      gameResults: demoResults,
      questions: allQuestions,
      destinations: [...DESTINATIONS_DATA],
      mysteryClues: [...MYSTERY_CHALLENGES],
      visitedDestinations: {},
    };

    this.saveLocalStorage();
    console.log('[Database] Seeded local storage successfully with complete Japanese syllabus and demo players.');
  }

  public async connectMongo(uri?: string): Promise<boolean> {
    const mongoUri = uri || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('[Database] No MONGODB_URI specified. Operating with persistent JSON storage mode (ideal for instant expo startup).');
      return false;
    }

    try {
      console.log(`[Database] Connecting to MongoDB at ${mongoUri.replace(/:([^:@]{1,})@/, ':****@')}...`);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      this.isMongoConnected = true;
      console.log('[Database] MongoDB successfully connected via Mongoose!');
      await this.syncToMongoIfEmpty();
      return true;
    } catch (err: any) {
      console.warn(`[Database] MongoDB connection skipped: ${err.message}. Seamlessly continuing with persistent JSON engine.`);
      this.isMongoConnected = false;
      return false;
    }
  }

  private async syncToMongoIfEmpty() {
    if (!this.isMongoConnected) return;

    try {
      const qCount = await QuestionModel.countDocuments();
      if (qCount === 0) {
        console.log('[Database] MongoDB is empty. Seeding initial questions, destinations, and players...');
        const allQuestions = [...HIRAGANA_QUESTIONS, ...VOCABULARY_QUESTIONS, ...KANJI_QUESTIONS, ...CULTURE_QUESTIONS];
        await QuestionModel.insertMany(allQuestions);
        
        const destDocs = DESTINATIONS_DATA.map(d => ({
          idKey: d.id,
          nameJa: d.nameJa,
          nameEn: d.nameEn,
          region: d.region,
          coordinates: d.coordinates,
          tagline: d.tagline,
          famousFor: d.famousFor,
          traditionalFood: d.traditionalFood,
          culture: d.culture,
          interestingFact: d.interestingFact,
          japanesePhrase: d.japanesePhrase,
          pointsAwarded: d.pointsAwarded,
        }));
        await DestinationModel.insertMany(destDocs);

        for (const sp of SEED_PLAYERS) {
          await PlayerModel.create({
            nickname: sp.nickname,
            avatar: sp.avatar,
            totalPoints: sp.totalPoints,
            level: sp.level,
            gamesPlayed: sp.gamesPlayed,
            bestStreak: sp.bestStreak,
            accuracy: sp.accuracy,
            badges: sp.badges,
            createdAt: new Date(sp.createdAt),
            lastPlayedAt: new Date(sp.lastPlayedAt),
          });
        }
        console.log('[Database] MongoDB successfully populated with seed data!');
      }
    } catch (err) {
      console.error('[Database] Failed to populate MongoDB seed:', err);
    }
  }

  // --- PLAYERS API ---
  public async getPlayer(id: string): Promise<IPlayer | null> {
    if (this.isMongoConnected) {
      try {
        const doc = await PlayerModel.findById(id);
        if (doc) {
          return {
            id: doc._id.toString(),
            nickname: doc.nickname,
            avatar: doc.avatar,
            totalPoints: doc.totalPoints,
            level: doc.level,
            gamesPlayed: doc.gamesPlayed,
            bestStreak: doc.bestStreak,
            accuracy: doc.accuracy,
            badges: doc.badges,
            createdAt: doc.createdAt.toISOString(),
            lastPlayedAt: doc.lastPlayedAt.toISOString(),
          };
        }
      } catch {
        // Fall back to local
      }
    }
    const found = this.localStore.players.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  public async createOrGetPlayer(nickname: string, avatar: string = 'kitsune'): Promise<IPlayer> {
    const trimmed = nickname.trim();
    if (!trimmed) {
      throw new Error('Player name cannot be empty');
    }

    if (this.isMongoConnected) {
      try {
        let player = await PlayerModel.findOne({ nickname: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
        if (player) {
          if (avatar && player.avatar !== avatar) {
            player.avatar = avatar;
            await player.save();
          }
          return {
            id: player._id.toString(),
            nickname: player.nickname,
            avatar: player.avatar,
            totalPoints: player.totalPoints,
            level: player.level,
            gamesPlayed: player.gamesPlayed,
            bestStreak: player.bestStreak,
            accuracy: player.accuracy,
            badges: player.badges,
            createdAt: player.createdAt.toISOString(),
            lastPlayedAt: player.lastPlayedAt.toISOString(),
          };
        }

        const newPlayer = await PlayerModel.create({
          nickname: trimmed,
          avatar: avatar || 'kitsune',
          totalPoints: 0,
          level: 1,
          gamesPlayed: 0,
          bestStreak: 0,
          accuracy: 100,
          badges: ['sakura_starter'],
          createdAt: new Date(),
          lastPlayedAt: new Date(),
        });

        return {
          id: newPlayer._id.toString(),
          nickname: newPlayer.nickname,
          avatar: newPlayer.avatar,
          totalPoints: newPlayer.totalPoints,
          level: newPlayer.level,
          gamesPlayed: newPlayer.gamesPlayed,
          bestStreak: newPlayer.bestStreak,
          accuracy: newPlayer.accuracy,
          badges: newPlayer.badges,
          createdAt: newPlayer.createdAt.toISOString(),
          lastPlayedAt: newPlayer.lastPlayedAt.toISOString(),
        };
      } catch (e) {
        console.warn('Mongo createOrGetPlayer error, using local store', e);
      }
    }

    const existing = this.localStore.players.find((p) => p.nickname.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (avatar && existing.avatar !== avatar) {
        existing.avatar = avatar;
        this.saveLocalStorage();
      }
      return { ...existing };
    }

    const newId = `player-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newPlayer: IPlayer = {
      id: newId,
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

    this.localStore.players.push(newPlayer);
    this.saveLocalStorage();
    return { ...newPlayer };
  }

  public async getAllPlayers(): Promise<IPlayer[]> {
    if (this.isMongoConnected) {
      try {
        const docs = await PlayerModel.find().sort({ totalPoints: -1 }).limit(100);
        return docs.map((doc) => ({
          id: doc._id.toString(),
          nickname: doc.nickname,
          avatar: doc.avatar,
          totalPoints: doc.totalPoints,
          level: doc.level,
          gamesPlayed: doc.gamesPlayed,
          bestStreak: doc.bestStreak,
          accuracy: doc.accuracy,
          badges: doc.badges,
          createdAt: doc.createdAt.toISOString(),
          lastPlayedAt: doc.lastPlayedAt.toISOString(),
        }));
      } catch {
        // Fall back to local
      }
    }

    return [...this.localStore.players].sort((a, b) => b.totalPoints - a.totalPoints);
  }

  public async deletePlayer(id: string): Promise<boolean> {
    if (this.isMongoConnected) {
      try {
        await PlayerModel.findByIdAndDelete(id);
        await GameResultModel.deleteMany({ playerId: id });
      } catch {
        // ignore
      }
    }

    const before = this.localStore.players.length;
    this.localStore.players = this.localStore.players.filter((p) => p.id !== id);
    this.localStore.gameResults = this.localStore.gameResults.filter((g) => g.playerId !== id);
    if (this.localStore.visitedDestinations[id]) {
      delete this.localStore.visitedDestinations[id];
    }
    this.saveLocalStorage();
    return this.localStore.players.length < before;
  }

  public async resetLeaderboard(): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await PlayerModel.deleteMany({});
        await GameResultModel.deleteMany({});
        console.log('[Database] Reset MongoDB players and results');
      } catch (err) {
        console.error(err);
      }
    }

    this.localStore.players = [];
    this.localStore.gameResults = [];
    this.localStore.visitedDestinations = {};
    this.saveLocalStorage();
    console.log('[Database] Leaderboard fully reset.');
  }

  public async reseedDemoData(): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await PlayerModel.deleteMany({});
        await GameResultModel.deleteMany({});
        await QuestionModel.deleteMany({});
        await DestinationModel.deleteMany({});
        await this.syncToMongoIfEmpty();
      } catch (err) {
        console.error(err);
      }
    }
    this.seedLocalStorage(true);
  }

  // --- SUBMIT GAME RESULT & UPDATE STATS ---
  public async submitGameResult(params: {
    playerId: string;
    gameType: 'hiragana' | 'vocabulary' | 'kanji' | 'culture' | 'explorer' | 'mystery';
    score: number;
    accuracy: number;
    streak: number;
  }): Promise<{
    player: IPlayer;
    rankDelta: number;
    newRank: number;
    oldRank: number;
    newBadges: string[];
    result: IGameResult;
  }> {
    const { playerId, gameType, score, accuracy, streak } = params;
    const player = await this.getPlayer(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Determine old rank
    const allBefore = await this.getAllPlayers();
    const oldRankIndex = allBefore.findIndex((p) => p.id === playerId);
    const oldRank = oldRankIndex === -1 ? allBefore.length + 1 : oldRankIndex + 1;

    // Calculate badge awards
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
      if (!player.badges.includes(b)) {
        newlyUnlocked.push(b);
      }
    });

    const newTotalPoints = Math.max(0, player.totalPoints + score);
    const newGamesPlayed = player.gamesPlayed + 1;
    const newBestStreak = Math.max(player.bestStreak, streak);
    const calculatedAcc = Math.round((player.accuracy * player.gamesPlayed + accuracy) / newGamesPlayed);
    const newLevel = Math.max(1, Math.floor(newTotalPoints / 500) + 1);

    const updatedPlayer: IPlayer = {
      ...player,
      totalPoints: newTotalPoints,
      gamesPlayed: newGamesPlayed,
      bestStreak: newBestStreak,
      accuracy: Math.min(100, Math.max(0, calculatedAcc)),
      level: newLevel,
      badges: Array.from(unlockedBadges),
      lastPlayedAt: new Date().toISOString(),
    };

    const newResult: IGameResult = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      playerId,
      playerNickname: player.nickname,
      playerAvatar: player.avatar,
      gameType,
      score,
      accuracy,
      streak,
      completedAt: new Date().toISOString(),
    };

    // Update in Mongo if active
    if (this.isMongoConnected) {
      try {
        await PlayerModel.findByIdAndUpdate(playerId, {
          totalPoints: updatedPlayer.totalPoints,
          gamesPlayed: updatedPlayer.gamesPlayed,
          bestStreak: updatedPlayer.bestStreak,
          accuracy: updatedPlayer.accuracy,
          level: updatedPlayer.level,
          badges: updatedPlayer.badges,
          lastPlayedAt: new Date(),
        });
        await GameResultModel.create({
          playerId,
          playerNickname: player.nickname,
          playerAvatar: player.avatar,
          gameType,
          score,
          accuracy,
          streak,
          completedAt: new Date(),
        });
      } catch (err) {
        console.warn('Mongo update error:', err);
      }
    }

    // Update local storage
    const pIdx = this.localStore.players.findIndex((p) => p.id === playerId);
    if (pIdx !== -1) {
      this.localStore.players[pIdx] = updatedPlayer;
    } else {
      this.localStore.players.push(updatedPlayer);
    }
    this.localStore.gameResults.push(newResult);
    this.saveLocalStorage();

    // Determine new rank
    const allAfter = await this.getAllPlayers();
    const newRankIndex = allAfter.findIndex((p) => p.id === playerId);
    const newRank = newRankIndex === -1 ? allAfter.length : newRankIndex + 1;
    const rankDelta = oldRank - newRank; // positive means moved UP!

    return {
      player: updatedPlayer,
      rankDelta,
      newRank,
      oldRank,
      newBadges: newlyUnlocked,
      result: newResult,
    };
  }

  // --- LEADERBOARD API ---
  public async getLeaderboard(period: 'all' | 'today' | 'week' = 'all') {
    const players = await this.getAllPlayers();

    if (period === 'all') {
      return players.slice(0, 50);
    }

    const cutoff = new Date();
    if (period === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      cutoff.setDate(cutoff.getDate() - 7);
    }

    // Filter by recent game result activity
    const activePlayerIds = new Set<string>();
    this.localStore.gameResults.forEach((gr) => {
      const dt = new Date(gr.completedAt);
      if (dt >= cutoff) {
        activePlayerIds.add(gr.playerId);
      }
    });

    const filtered = players.filter((p) => {
      const last = new Date(p.lastPlayedAt);
      return last >= cutoff || activePlayerIds.has(p.id);
    });

    return (filtered.length > 0 ? filtered : players).slice(0, 50);
  }

  // --- STATS API ---
  public async getStats() {
    const players = await this.getAllPlayers();
    const totalPoints = players.reduce((acc, p) => acc + p.totalPoints, 0);
    const totalGames = this.localStore.gameResults.length + players.reduce((acc, p) => acc + p.gamesPlayed, 0);
    const highestScore = players.length > 0 ? Math.max(...players.map((p) => p.totalPoints)) : 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayResults = this.localStore.gameResults.filter((g) => new Date(g.completedAt) >= startOfToday);
    const todayPlayers = players.filter((p) => new Date(p.lastPlayedAt) >= startOfToday);

    return {
      totalPlayers: players.length,
      totalGames,
      totalPoints,
      highestScore,
      todayPlayers: todayPlayers.length,
      todayGames: todayResults.length,
    };
  }

  // --- QUESTIONS API ---
  public async getQuestions(gameType: string, limit: number = 10): Promise<IQuestion[]> {
    if (this.isMongoConnected) {
      try {
        const docs = await QuestionModel.aggregate([
          { $match: { gameType } },
          { $sample: { size: limit } }
        ]);
        if (docs && docs.length > 0) {
          return docs.map(d => ({
            id: d._id.toString(),
            gameType: d.gameType,
            question: d.question,
            subtext: d.subtext,
            options: d.options,
            correctAnswer: d.correctAnswer,
            difficulty: d.difficulty,
            points: d.points,
            category: d.category,
            explanation: d.explanation,
            imageUrl: d.imageUrl,
          }));
        }
      } catch {
        // Fall back to local
      }
    }

    const filtered = this.localStore.questions.filter((q) => q.gameType === gameType);
    if (filtered.length === 0) {
      return [];
    }

    // Shuffle and pick
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  // --- DESTINATIONS API ---
  public async getDestinations(): Promise<IDestination[]> {
    return [...this.localStore.destinations];
  }

  public async recordDestinationVisit(playerId: string, destinationId: string): Promise<{ awarded: boolean; points: number; totalVisited: number }> {
    if (!this.localStore.visitedDestinations[playerId]) {
      this.localStore.visitedDestinations[playerId] = [];
    }

    const visited = this.localStore.visitedDestinations[playerId];
    if (visited.includes(destinationId)) {
      return { awarded: false, points: 0, totalVisited: visited.length };
    }

    visited.push(destinationId);
    const pointsAwarded = 25;

    // Award points to player
    const player = await this.getPlayer(playerId);
    if (player) {
      player.totalPoints += pointsAwarded;
      if (visited.length >= 5 && !player.badges.includes('japan_explorer')) {
        player.badges.push('japan_explorer');
      }
      this.saveLocalStorage();
    }

    return { awarded: true, points: pointsAwarded, totalVisited: visited.length };
  }

  public async getPlayerVisitedDestinations(playerId: string): Promise<string[]> {
    return this.localStore.visitedDestinations[playerId] || [];
  }

  // --- MYSTERY CLUES API ---
  public async getMysteryClues(): Promise<IMysteryClue[]> {
    return [...this.localStore.mysteryClues];
  }
}

export const db = new DatabaseManager();
