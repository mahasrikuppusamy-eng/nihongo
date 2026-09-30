import mongoose, { Schema, Document } from 'mongoose';

export interface IDestinationDocument extends Document {
  idKey: string;
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

const DestinationSchema = new Schema<IDestinationDocument>({
  idKey: { type: String, required: true, unique: true },
  nameJa: { type: String, required: true },
  nameEn: { type: String, required: true },
  region: { type: String, required: true },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  tagline: { type: String, required: true },
  famousFor: { type: [String], default: [] },
  traditionalFood: { type: String, required: true },
  culture: { type: String, required: true },
  interestingFact: { type: String, required: true },
  japanesePhrase: {
    japanese: { type: String, required: true },
    romaji: { type: String, required: true },
    english: { type: String, required: true },
  },
  pointsAwarded: { type: Number, default: 25 },
});

export const DestinationModel = mongoose.models.Destination || mongoose.model<IDestinationDocument>('Destination', DestinationSchema);
