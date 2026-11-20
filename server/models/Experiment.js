import mongoose from 'mongoose';

/**
 * Experiment Schema
 * Represents empirical logs, methodology, observation notes, and experiment results.
 */
const ExperimentSchema = new mongoose.Schema(
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
      required: [true, 'Experiment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Experiment description is required'],
      trim: true,
    },
    methodology: {
      type: String,
      required: [true, 'Methodology is required'],
      trim: true,
    },
    observations: {
      type: String,
      required: [true, 'Observations are required'],
      trim: true,
    },
    results: {
      type: String,
      required: [true, 'Results are required'],
      trim: true,
    },
    projectId: {
      type: String,
      ref: 'Project',
      default: '',
      trim: true,
      index: true,
    },
    recordedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Experiment = mongoose.models.Experiment || mongoose.model('Experiment', ExperimentSchema);
export default Experiment;

