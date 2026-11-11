import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide note description or content'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a subject category'],
      default: 'General',
      enum: {
        values: [
          'Java',
          'Python',
          'DBMS',
          'Mathematics',
          'Web Development',
          'Data Structures',
          'Computer Networks',
          'Operating Systems',
          'General',
        ],
        message: '{VALUE} is not a supported standard category',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'indigo',
    },
    userId: {
      type: String,
      default: 'guest_user',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Indexes for high performance search by title and category
noteSchema.index({ title: 'text', description: 'text' });
noteSchema.index({ category: 1 });
noteSchema.index({ userId: 1, createdAt: -1 });

export const Note = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);
export default Note;
