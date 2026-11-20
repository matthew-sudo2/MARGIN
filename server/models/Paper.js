import mongoose from 'mongoose';

/**
 * Paper Schema
 * Represents research literature, capstone references, and academic papers.
 */
const PaperSchema = new mongoose.Schema(
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
      required: [true, 'Paper title is required'],
      trim: true,
    },
    authors: {
      type: String,
      required: [true, 'Authors are required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Publication year is required'],
      min: [1000, 'Year must be a valid 4-digit number'],
      max: [new Date().getFullYear() + 2, 'Year cannot be far in the future'],
    },
    domain: {
      type: String,
      required: [true, 'Research domain is required'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
    },
    venue: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    dateAdded: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Paper = mongoose.models.Paper || mongoose.model('Paper', PaperSchema);
export default Paper;

