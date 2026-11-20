import { isDBConnected } from '../config/db.js';
import Project from '../models/Project.js';
import { mockStore } from '../data/mockStore.js';

/**
 * @desc   Get all projects
 * @route  GET /api/projects
 * @access Public
 */
export const getProjects = async (req, res) => {
  try {
    if (isDBConnected()) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json(projects);
    }
    const projects = mockStore.getProjects();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving projects', message: error.message });
  }
};

/**
 * @desc   Get single project by ID
 * @route  GET /api/projects/:id
 * @access Public
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const project = await Project.findOne({ id });
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.status(200).json(project);
    }
    const project = mockStore.getProjectById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving project', message: error.message });
  }
};

/**
 * @desc   Create a new project
 * @route  POST /api/projects
 * @access Public
 */
export const createProject = async (req, res) => {
  try {
    const { name, description, category, status = 'Planning', id } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ error: 'Please provide required fields: name, description, category' });
    }

    const projectId = id || `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const projectData = {
      id: projectId,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      const created = await Project.create(projectData);
      return res.status(201).json(created);
    }

    const created = mockStore.createProject(projectData);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: 'Server error creating project', message: error.message });
  }
};

/**
 * @desc   Update a project
 * @route  PUT /api/projects/:id
 * @access Public
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (isDBConnected()) {
      const updated = await Project.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: 'Project not found' });
      return res.status(200).json(updated);
    }

    const updated = mockStore.updateProject(id, updateData);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Server error updating project', message: error.message });
  }
};

/**
 * @desc   Delete a project
 * @route  DELETE /api/projects/:id
 * @access Public
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const deleted = await Project.findOneAndDelete({ id });
      if (!deleted) return res.status(404).json({ error: 'Project not found' });
      return res.status(200).json({ message: 'Project deleted successfully', id });
    }

    const success = mockStore.deleteProject(id);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json({ message: 'Project deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ error: 'Server error deleting project', message: error.message });
  }
};

