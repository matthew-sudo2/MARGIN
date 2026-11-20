import mongoose from 'mongoose';

/**
 * Project Schema
 * Represents research initiatives, thesis projects, dissertations, and capstones.
 */
const ProjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: {
        values: ['Planning', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Planning',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;

