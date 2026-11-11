import { Router } from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getDashboardStats,
} from '../controllers/noteController.ts';

const router = Router();

// Route: GET /api/notes/stats (Dashboard statistics)
router.get('/stats', getDashboardStats);

// Route: GET /api/notes (Get all notes with search, category filtering)
router.get('/', getNotes);

// Route: POST /api/notes (Create a new note)
router.post('/', createNote);

// Route: GET /api/notes/:id (Get note by ID)
router.get('/:id', getNoteById);

// Route: PUT /api/notes/:id (Update note)
router.put('/:id', updateNote);

// Route: DELETE /api/notes/:id (Delete note)
router.delete('/:id', deleteNote);

export default router;
