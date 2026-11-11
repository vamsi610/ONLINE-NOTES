import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Pin,
  Calendar,
  Clock,
  Bold,
  Italic,
  Code,
  List,
  Heading,
  Quote,
  Eye,
  Edit,
  AlertCircle,
  Database,
} from 'lucide-react';
import { INote } from '../types/note.ts';
import { getCustomCategories, addCustomCategory } from '../services/api.ts';

interface EditNotePageProps {
  note: INote | null;
  onNavigate: (page: string, noteId?: string) => void;
  onUpdateNote: (id: string, updates: Partial<INote>) => Promise<void>;
}

export const EditNotePage: React.FC<EditNotePageProps> = ({
  note,
  onNavigate,
  onUpdateNote,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Java');
  const [customSubject, setCustomSubject] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setCategory(note.category);
      setTags(note.tags || []);
      setIsPinned(note.isPinned || false);
      setDescription(note.description);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-slate-500 text-sm mb-4">Note not found to edit.</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const customCategories = getCustomCategories();
  const defaultSubjects = ['Java', 'Python', 'DBMS', 'Mathematics', 'Web Development', 'Data Structures', 'Computer Networks', 'Operating Systems', 'General'];
  const allSubjects = Array.from(new Set([...defaultSubjects, ...customCategories]));

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('edit-description-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    setDescription(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for the note.');
      return;
    }

    if (!description.trim()) {
      setError('Please provide note description.');
      return;
    }

    setSaving(true);
    try {
      let finalCategory = category;
      if (isCustomCategory && customSubject.trim()) {
        finalCategory = customSubject.trim();
        addCustomCategory(finalCategory);
      }

      await onUpdateNote(note._id, {
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        tags,
        isPinned,
      });

      onNavigate('view', note._id);
    } catch (err: any) {
      setError(err.message || 'Failed to update note in MongoDB');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('view', note._id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and Return</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Editing note: <span className="font-semibold text-slate-700 truncate max-w-[200px] inline-block align-bottom">{note.title}</span>
          </span>
        </div>

        {/* Note Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Edit Academic Note
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Make updates to lecture notes, subject category, or tags
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('view', note._id)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Note Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full px-4 py-2.5 text-base sm:text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Subject Category & Pin Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject Category
                </label>
                {!isCustomCategory ? (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true);
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {allSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Subject...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Type custom subject..."
                      className="flex-1 px-3 py-2 text-sm bg-white border border-indigo-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Presets
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pin Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`w-full flex items-center justify-between px-4 py-2 border rounded-xl text-sm font-semibold transition-colors ${
                    isPinned
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Pin className={`w-4 h-4 ${isPinned ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
                    <span>{isPinned ? 'Pinned to top' : 'Standard note'}</span>
                  </span>
                  <span className="text-xs font-normal opacity-70">
                    {isPinned ? 'Click to unpin' : 'Click to pin'}
                  </span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Topic Tags (Press Enter to add)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-indigo-400 hover:text-indigo-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add more...'}
                  className="flex-1 min-w-[120px] bg-transparent text-xs py-1 px-1 focus:outline-none text-slate-900"
                />
              </div>
            </div>

            {/* Description Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Note Content <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Write</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {activeTab === 'write' && (
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 border border-slate-200 border-b-0 rounded-t-xl text-slate-600">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    title="Bold"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    title="Italic"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    title="Heading"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    title="Bullet List"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('```\n', '\n```')}
                    title="Code Block"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    title="Quote"
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeTab === 'write' ? (
                <textarea
                  id="edit-description-textarea"
                  required
                  rows={14}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 text-sm font-normal bg-white border border-slate-200 rounded-b-xl text-slate-900 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <div className="w-full min-h-[350px] p-6 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm text-slate-800 leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {description}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>{charCount} characters</span>
                </div>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  <span>Will update MongoDB record</span>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
