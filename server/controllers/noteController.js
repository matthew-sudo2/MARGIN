import { isDBConnected } from '../config/db.js';
import Note from '../models/Note.js';
import { mockStore } from '../data/mockStore.js';

/**
 * @desc   Get all notes
 * @route  GET /api/notes
 * @access Public
 */
export const getNotes = async (req, res) => {
  try {
    if (isDBConnected()) {
      const notes = await Note.find().sort({ modifiedAt: -1 });
      return res.status(200).json(notes);
    }
    const notes = mockStore.getNotes();
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving notes', message: error.message });
  }
};

/**
 * @desc   Get single note by ID
 * @route  GET /api/notes/:id
 * @access Public
 */
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const note = await Note.findOne({ id });
      if (!note) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json(note);
    }
    const note = mockStore.getNoteById(id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving note', message: error.message });
  }
};

/**
 * @desc   Create a new note
 * @route  POST /api/notes
 * @access Public
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, paperId = '', id } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Please provide required fields: title, content' });
    }

    const noteId = id || `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const noteData = {
      id: noteId,
      title: title.trim(),
      content: content.trim(),
      paperId: paperId.trim(),
      createdAt: now,
      modifiedAt: now,
    };

    if (isDBConnected()) {
      const created = await Note.create(noteData);
      return res.status(201).json(created);
    }

    const created = mockStore.createNote(noteData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'Server error creating note', message: error.message });
  }
};

/**
 * @desc   Update a note
 * @route  PUT /api/notes/:id
 * @access Public
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, modifiedAt: new Date().toISOString() };
    delete updateData._id;

    if (isDBConnected()) {
      const updated = await Note.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json(updated);
    }

    const updated = mockStore.updateNote(id, updateData);
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Server error updating note', message: error.message });
  }
};

/**
 * @desc   Delete a note
 * @route  DELETE /api/notes/:id
 * @access Public
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const deleted = await Note.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json({ message: 'Note deleted successfully', id });
    }

    const success = mockStore.deleteNote(id);
    if (!success) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json({ message: 'Note deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error deleting note', message: error.message });
  }
};

