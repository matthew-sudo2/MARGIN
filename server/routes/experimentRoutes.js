import express from 'express';
import {
  createExperiment,
  deleteExperiment,
  getExperimentById,
  getExperiments,
  updateExperiment,
} from '../controllers/experimentController.js';

const router = express.Router();

router.route('/')
  .get(getExperiments)
  .post(createExperiment);

router.route('/:id')
  .get(getExperimentById)
  .put(updateExperiment)
  .delete(deleteExperiment);

export default router;

