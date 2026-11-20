import mongoose from 'mongoose';

/**
 * Note Schema
 * Represents working knowledge, notes, interpretations, and critical reviews linked to papers.
 */
const NoteSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
    },
    paperId: {
      type: String,
      ref: 'Paper',
      default: '',
      trim: true,
      index: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    modifiedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export default Note;

