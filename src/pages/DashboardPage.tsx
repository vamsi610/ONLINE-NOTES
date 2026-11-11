import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Pin,
  FileText,
  Layers,
  FolderPlus,
  SlidersHorizontal,
  Grid,
  List,
  Sparkles,
  BookOpen,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { INote } from '../types/note.ts';
import { NoteCard } from '../components/NoteCard.tsx';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { addCustomCategory, getCustomCategories } from '../services/api.ts';

interface DashboardPageProps {
  notes: INote[];
  onNavigate: (page: string, noteId?: string) => void;
  onDeleteNote: (id: string) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  notes,
  onNavigate,
  onDeleteNote,
  onTogglePin,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Deletion modal state
  const [noteToDelete, setNoteToDelete] = useState<INote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Category prompt
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>(getCustomCategories());

  // Base subjects + custom categories
  const standardCategories = ['Java', 'Python', 'DBMS', 'Mathematics', 'Web Development', 'Data Structures'];
  const allCategories = useMemo(() => {
    const set = new Set([...standardCategories, ...customCategories]);
    return Array.from(set);
  }, [customCategories]);

  // Handle Add Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const updated = addCustomCategory(newCategoryName.trim());
    setCustomCategories(updated);
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Filter & Search Logic
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Category filter
        if (selectedCategory !== 'All' && note.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Pinned only filter
        if (showPinnedOnly && !note.isPinned) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchDesc = note.description.toLowerCase().includes(q);
          const matchCat = note.category.toLowerCase().includes(q);
          const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchCat || matchTags;
        }

        return true;
      })
      .sort((a, b) => {
        // Always place pinned notes on top
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }

        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'created') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        }
      });
  }, [notes, selectedCategory, showPinnedOnly, searchQuery, sortBy]);

  // Statistics
  const totalNotesCount = notes.length;
  const pinnedNotesCount = notes.filter((n) => n.isPinned).length;
  const uniqueSubjectsCount = new Set(notes.map((n) => n.category)).size;

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteNote(noteToDelete._id);
      setNoteToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome & Top Stats Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
                <span>Student Academic Workspace</span>
                <span>·</span>
                <span>{user ? user.major || 'Active Student' : 'Welcome'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notes Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Organize lectures, reference formulas, and revisions across your academic curriculum.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('create')}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Note</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Total Notes</span>
                <FileText className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{totalNotesCount}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Pinned Notes</span>
                <Pin className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{pinnedNotesCount}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Active Subjects</span>
                <Layers className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{uniqueSubjectsCount}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-medium">Storage Engine</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-sm font-extrabold text-slate-900 mt-1 truncate">
                MongoDB Ready
              </p>
            </div>
          </div>
        </div>

        {/* Search & Subject Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, keywords, Java, Python, DBMS, or tags..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Pinned filter toggle */}
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  showPinnedOnly
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${showPinnedOnly ? 'fill-amber-600' : ''}`} />
                <span>Pinned</span>
              </button>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-2 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="created">Newest Created</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-lg ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-1.5 rounded-lg ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Subject Categories Bar */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Subjects & Categories
              </span>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Notes ({notes.length})
              </button>

              {allCategories.map((cat) => {
                const count = notes.filter((n) => n.category.toLowerCase() === cat.toLowerCase()).length;
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="ml-1.5 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Category Inline Form */}
            {isAddingCategory && (
              <form onSubmit={handleCreateCategory} className="mt-3 flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Computer Networks, AI..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Notes Grid or Empty State */}
        {filteredNotes.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'flex flex-col gap-3'
            }
          >
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onView={(id) => onNavigate('view', id)}
                onEdit={(id) => onNavigate('edit', id)}
                onDelete={(n) => setNoteToDelete(n)}
                onTogglePin={onTogglePin}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No academic notes found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No results match "${searchQuery}". Try searching for another keyword or clear your filters.`
                : `No notes found in category "${selectedCategory}". Start creating your first study note!`}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Clear Search Filter
                </button>
              )}
              <button
                onClick={() => onNavigate('create')}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Note Now</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        note={noteToDelete}
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
