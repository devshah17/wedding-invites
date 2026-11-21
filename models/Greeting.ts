import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGreeting extends Document {
  name: string;
  relationship: string;
  message: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const GreetingSchema = new Schema<IGreeting>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    relationship: {
      type: String,
      required: [true, 'Please specify your relationship'],
      default: 'Well Wisher',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please write your wishes or advice'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Greeting: Model<IGreeting> =
  mongoose.models.Greeting || mongoose.model<IGreeting>('Greeting', GreetingSchema);

export default Greeting;
