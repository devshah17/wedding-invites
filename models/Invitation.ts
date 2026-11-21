import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvitation extends Document {
  code: string;
  guestName: string;
  events: string[]; // event IDs from weddingEvents
  note: string;
  views: number;
  status: 'invited' | 'confirmed';
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: [120, 'Guest name cannot exceed 120 characters'],
    },
    events: {
      type: [String],
      required: true,
      default: [],
    },
    note: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Note cannot exceed 1000 characters'],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['invited', 'confirmed'],
      default: 'invited',
    },
  },
  {
    timestamps: true,
  }
);

export const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;
