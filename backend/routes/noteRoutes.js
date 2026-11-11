const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getDashboardStats,
} = require('../controllers/noteController');

// GET /api/notes/stats
router.get('/stats', getDashboardStats);

// GET /api/notes
router.get('/', getNotes);

// POST /api/notes
router.post('/', createNote);

// GET /api/notes/:id
router.get('/:id', getNoteById);

// PUT /api/notes/:id
router.put('/:id', updateNote);

// DELETE /api/notes/:id
router.delete('/:id', deleteNote);

module.exports = router;
