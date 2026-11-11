import { Request, Response } from 'express';
import Note from '../models/Note.ts';

/**
 * Controller for Notes Management
 * Handles CRUD operations, search, filtering, and categorization
 */

// Get all notes with search and category filtering
export const getNotes = async (req: Request, res: Response) => {
  try {
    const { search, category, pinned } = req.query;
    const query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (pinned !== undefined) {
      query.isPinned = pinned === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching notes' });
  }
};

// Get single note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    return res.status(200).json({ success: true, note });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching note' });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, description, category, tags, isPinned, color } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newNote = await Note.create({
      title,
      description,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isPinned: Boolean(isPinned),
      color: color || 'indigo',
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully!',
      note: newNote,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error creating note' });
  }
};

// Update an existing note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { title, description, category, tags, isPinned, color } = req.body;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (description !== undefined) note.description = description;
    if (category !== undefined) note.category = category;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (color !== undefined) note.color = color;

    const updatedNote = await note.save();

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully!',
      note: updatedNote,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error updating note' });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully!',
      id: req.params.id,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error deleting note' });
  }
};

// Get stats for Dashboard
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalNotes = await Note.countDocuments();
    const pinnedNotes = await Note.countDocuments({ isPinned: true });
    
    // Group notes by subject category
    const categoryStats = await Note.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentNotes = await Note.find().sort({ updatedAt: -1 }).limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalNotes,
        pinnedNotes,
        categories: categoryStats.map((c) => ({ category: c._id, count: c.count })),
        recentNotes,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error calculating stats' });
  }
};
