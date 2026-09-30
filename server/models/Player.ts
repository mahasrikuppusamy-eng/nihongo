import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayerDocument extends Document {
  nickname: string;
  avatar: string;
  totalPoints: number;
  level: number;
  gamesPlayed: number;
  bestStreak: number;
  accuracy: number;
  badges: string[];
  createdAt: Date;
  lastPlayedAt: Date;
}

const PlayerSchema = new Schema<IPlayerDocument>({
  nickname: { type: String, required: true, trim: true, index: true },
  avatar: { type: String, default: 'kitsune' },
  totalPoints: { type: Number, default: 0, index: -1 },
  level: { type: Number, default: 1 },
  gamesPlayed: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  accuracy: { type: Number, default: 100 },
  badges: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  lastPlayedAt: { type: Date, default: Date.now },
});

export const PlayerModel = mongoose.models.Player || mongoose.model<IPlayerDocument>('Player', PlayerSchema);
