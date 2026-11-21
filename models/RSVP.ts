import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRSVP extends Document {
  guestName: string;
  mobile: string;
  totalAttendees: number;
  eventAttendance: Record<string, boolean>;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RSVPSchema = new Schema<IRSVP>(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: [100, 'Guest name cannot exceed 100 characters'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      index: true,
    },
    totalAttendees: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Attendees count must be at least 1'],
    },
    eventAttendance: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export const RSVP: Model<IRSVP> =
  mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', RSVPSchema);

export default RSVP;
