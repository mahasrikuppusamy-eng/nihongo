import mongoose, { Schema, Document } from 'mongoose';

export interface IGameResultDocument extends Document {
  playerId: string;
  playerNickname: string;
  playerAvatar: string;
  gameType: string;
  score: number;
  accuracy: number;
  streak: number;
  completedAt: Date;
}

const GameResultSchema = new Schema<IGameResultDocument>({
  playerId: { type: String, required: true, index: true },
  playerNickname: { type: String, default: 'Explorer' },
  playerAvatar: { type: String, default: 'kitsune' },
  gameType: { type: String, required: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, default: 100 },
  streak: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now, index: -1 },
});

export const GameResultModel = mongoose.models.GameResult || mongoose.model<IGameResultDocument>('GameResult', GameResultSchema);
