import { isDBConnected } from '../config/db.js';
import Experiment from '../models/Experiment.js';
import { mockStore } from '../data/mockStore.js';

/**
 * @desc   Get all experiments
 * @route  GET /api/experiments
 * @access Public
 */
export const getExperiments = async (req, res) => {
  try {
    if (isDBConnected()) {
      const experiments = await Experiment.find().sort({ recordedAt: -1 });
      return res.status(200).json(experiments);
    }
    const experiments = mockStore.getExperiments();
    return res.status(200).json(experiments);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving experiments', message: error.message });
  }
};

/**
 * @desc   Get single experiment by ID
 * @route  GET /api/experiments/:id
 * @access Public
 */
export const getExperimentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const experiment = await Experiment.findOne({ id });
      if (!experiment) return res.status(404).json({ error: 'Experiment not found' });
      return res.status(200).json(experiment);
    }
    const experiment = mockStore.getExperimentById(id);
    if (!experiment) return res.status(404).json({ error: 'Experiment not found' });
    return res.status(200).json(experiment);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving experiment', message: error.message });
  }
};

/**
 * @desc   Create a new experiment
 * @route  POST /api/experiments
 * @access Public
 */
export const createExperiment = async (req, res) => {
  try {
    const { title, description, methodology, observations, results, projectId = '', id } = req.body;

    if (!title || !description || !methodology || !observations || !results) {
      return res.status(400).json({
        error: 'Please provide all required fields: title, description, methodology, observations, results',
      });
    }

    const expId = id || `experiment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const experimentData = {
      id: expId,
      title: title.trim(),
      description: description.trim(),
      methodology: methodology.trim(),
      observations: observations.trim(),
      results: results.trim(),
      projectId: projectId.trim(),
      recordedAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      const created = await Experiment.create(experimentData);
      return res.status(201).json(created);
    }

    const created = mockStore.createExperiment(experimentData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'Server error creating experiment', message: error.message });
  }
};

/**
 * @desc   Update an experiment
 * @route  PUT /api/experiments/:id
 * @access Public
 */
export const updateExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (isDBConnected()) {
      const updated = await Experiment.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Experiment not found' });
      return res.status(200).json(updated);
    }

    const updated = mockStore.updateExperiment(id, updateData);
    if (!updated) return res.status(404).json({ error: 'Experiment not found' });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Server error updating experiment', message: error.message });
  }
};

/**
 * @desc   Delete an experiment
 * @route  DELETE /api/experiments/:id
 * @access Public
 */
export const deleteExperiment = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const deleted = await Experiment.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Experiment not found' });
      return res.status(200).json({ message: 'Experiment deleted successfully', id });
    }

    const success = mockStore.deleteExperiment(id);
    if (!success) return res.status(404).json({ error: 'Experiment not found' });
    return res.status(200).json({ message: 'Experiment deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error deleting experiment', message: error.message });
  }
};

