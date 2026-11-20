import { isDBConnected } from '../config/db.js';
import Paper from '../models/Paper.js';
import { mockStore } from '../data/mockStore.js';

/**
 * @desc   Get all papers
 * @route  GET /api/papers
 * @access Public
 */
export const getPapers = async (req, res) => {
  try {
    if (isDBConnected()) {
      const papers = await Paper.find().sort({ createdAt: -1 });
      return res.status(200).json(papers);
    }
    const papers = mockStore.getPapers();
    return res.status(200).json(papers);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving papers', message: error.message });
  }
};

/**
 * @desc   Get single paper by ID
 * @route  GET /api/papers/:id
 * @access Public
 */
export const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const paper = await Paper.findOne({ id });
      if (!paper) return res.status(404).json({ error: 'Paper not found' });
      return res.status(200).json(paper);
    }
    const paper = mockStore.getPaperById(id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });
    return res.status(200).json(paper);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving paper', message: error.message });
  }
};

/**
 * @desc   Create a new paper
 * @route  POST /api/papers
 * @access Public
 */
export const createPaper = async (req, res) => {
  try {
    const { title, authors, year, domain, abstract, venue = '', url = '', id } = req.body;

    if (!title || !authors || !year || !domain || !abstract) {
      return res.status(400).json({ error: 'Please provide all required fields: title, authors, year, domain, abstract' });
    }

    const paperId = id || `paper-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const paperData = {
      id: paperId,
      title: title.trim(),
      authors: authors.trim(),
      year: Number(year),
      domain: domain.trim(),
      abstract: abstract.trim(),
      venue: venue.trim(),
      url: url.trim(),
      dateAdded: new Date().toISOString(),
    };

    if (isDBConnected()) {
      const created = await Paper.create(paperData);
      return res.status(201).json(created);
    }

    const created = mockStore.createPaper(paperData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'Server error creating paper', message: error.message });
  }
};

/**
 * @desc   Update a paper
 * @route  PUT /api/papers/:id
 * @access Public
 */
export const updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (isDBConnected()) {
      const updated = await Paper.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Paper not found' });
      return res.status(200).json(updated);
    }

    const updated = mockStore.updatePaper(id, updateData);
    if (!updated) return res.status(404).json({ error: 'Paper not found' });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Server error updating paper', message: error.message });
  }
};

/**
 * @desc   Delete a paper
 * @route  DELETE /api/papers/:id
 * @access Public
 */
export const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const deleted = await Paper.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Paper not found' });
      return res.status(200).json({ message: 'Paper deleted successfully', id });
    }

    const success = mockStore.deletePaper(id);
    if (!success) return res.status(404).json({ error: 'Paper not found' });
    return res.status(200).json({ message: 'Paper deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error deleting paper', message: error.message });
  }
};

