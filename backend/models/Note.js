const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide note title'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Please provide note description or body content'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select subject category'],
      enum: [
        'Java',
        'Python',
        'DBMS',
        'Mathematics',
        'Web Development',
        'Data Structures',
        'Computer Networks',
        'Operating Systems',
        'General',
      ],
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'indigo',
    },
    userId: {
      type: String,
      default: 'student_user',
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt
  }
);

// Full-text search index on title and description
noteSchema.index({ title: 'text', description: 'text' });
noteSchema.index({ category: 1 });

module.exports = mongoose.model('Note', noteSchema);
