import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionDocument extends Document {
  gameType: string;
  question: string;
  subtext?: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  points: number;
  category?: string;
  explanation?: string;
  imageUrl?: string;
}

const QuestionSchema = new Schema<IQuestionDocument>({
  gameType: { type: String, required: true, index: true },
  question: { type: String, required: true },
  subtext: { type: String },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  difficulty: { type: String, default: 'beginner' },
  points: { type: Number, default: 100 },
  category: { type: String },
  explanation: { type: String },
  imageUrl: { type: String },
});

export const QuestionModel = mongoose.models.Question || mongoose.model<IQuestionDocument>('Question', QuestionSchema);
