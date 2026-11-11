const Note = require('../models/Note');

// @desc    Get all notes (with search and category filtering)
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const { search, category, pinned } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (pinned !== undefined) {
      query.isPinned = pinned === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, description, category, tags, isPinned, color } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const note = await Note.create({
      title,
      description,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isPinned: Boolean(isPinned),
      color: color || 'indigo',
    });

    res.status(201).json({
      success: true,
      message: 'Note saved successfully to MongoDB!',
      note,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: 'Note updated successfully in MongoDB!',
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully from MongoDB!',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/notes/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments();
    const pinnedNotes = await Note.countDocuments({ isPinned: true });

    const categories = await Note.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const recentNotes = await Note.find().sort({ updatedAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalNotes,
        pinnedNotes,
        categories: categories.map((c) => ({ category: c._id, count: c.count })),
        recentNotes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
