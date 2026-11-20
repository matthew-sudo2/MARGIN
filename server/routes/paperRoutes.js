import express from 'express';
import {
  createPaper,
  deletePaper,
  getPaperById,
  getPapers,
  updatePaper,
} from '../controllers/paperController.js';

const router = express.Router();

router.route('/')
  .get(getPapers)
  .post(createPaper);

router.route('/:id')
  .get(getPaperById)
  .put(updatePaper)
  .delete(deletePaper);

export default router;

