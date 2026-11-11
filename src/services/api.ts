import { INote, DashboardStats } from '../types/note.ts';
import { INITIAL_SEED_NOTES } from '../data/seedNotes.ts';

const STORAGE_KEY = 'online_notes_management_db';
const CATEGORIES_KEY = 'online_notes_custom_categories';

/**
 * Helper to get stored notes from local persistence layer
 */
const getLocalNotes = (): INote[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_NOTES));
      return INITIAL_SEED_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_NOTES;
  } catch (e) {
    return INITIAL_SEED_NOTES;
  }
};

const saveLocalNotes = (notes: INote[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to persist notes to localStorage', e);
  }
};

export const getCustomCategories = (): string[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const addCustomCategory = (name: string): string[] => {
  const existing = getCustomCategories();
  const trimmed = name.trim();
  if (!trimmed || existing.includes(trimmed)) return existing;
  const updated = [...existing, trimmed];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Notes API Service
 * Supports RESTful operations with real MongoDB/Express backend endpoint integration
 * and immediate local persistence fallback for instant client responsiveness.
 */
export const notesApi = {
  // Fetch notes with optional search query, category, and pinned filters
  async getNotes(filters?: { search?: string; category?: string; pinned?: boolean }): Promise<INote[]> {
    // Attempt backend fetch first
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters?.pinned !== undefined) params.append('pinned', String(filters.pinned));

      const res = await fetch(`/api/notes?${params.toString()}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          saveLocalNotes(data.notes);
          return data.notes;
        }
      }
    } catch {
      // Backend not running on same origin or offline; use local storage
    }

    let notes = getLocalNotes();

    if (filters?.category && filters.category !== 'All') {
      notes = notes.filter((n) => n.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.pinned !== undefined) {
      notes = notes.filter((n) => n.isPinned === filters.pinned);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort pinned first, then by updatedAt descending
    return [...notes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  },

  // Get single note by ID
  async getNoteById(id: string): Promise<INote | null> {
    try {
      const res = await fetch(`/api/notes/${id}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.note) return data.note;
      }
    } catch {}

    const notes = getLocalNotes();
    return notes.find((n) => n._id === id) || null;
  },

  // Create note
  async createNote(data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPinned?: boolean;
    color?: string;
  }): Promise<INote> {
    const now = new Date().toISOString();
    const newNote: INote = {
      _id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category || 'General',
      tags: data.tags || [],
      isPinned: Boolean(data.isPinned),
      color: data.color || 'indigo',
      createdAt: now,
      updatedAt: now,
    };

    // Try posting to Express backend
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const backendRes = await res.json();
        if (backendRes.success && backendRes.note) {
          const notes = getLocalNotes();
          notes.unshift(backendRes.note);
          saveLocalNotes(notes);
          return backendRes.note;
        }
      }
    } catch {}

    // Local fallback
    const notes = getLocalNotes();
    notes.unshift(newNote);
    saveLocalNotes(notes);
    return newNote;
  },

  // Update note
  async updateNote(id: string, updates: Partial<INote>): Promise<INote> {
    const now = new Date().toISOString();

    // Try backend
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const backendRes = await res.json();
        if (backendRes.success && backendRes.note) {
          const notes = getLocalNotes();
          const idx = notes.findIndex((n) => n._id === id);
          if (idx !== -1) {
            notes[idx] = backendRes.note;
            saveLocalNotes(notes);
          }
          return backendRes.note;
        }
      }
    } catch {}

    const notes = getLocalNotes();
    const idx = notes.findIndex((n) => n._id === id);
    if (idx === -1) throw new Error('Note not found');

    const updatedNote: INote = {
      ...notes[idx],
      ...updates,
      updatedAt: now,
    };

    notes[idx] = updatedNote;
    saveLocalNotes(notes);
    return updatedNote;
  },

  // Delete note
  async deleteNote(id: string): Promise<boolean> {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(2000),
      });
    } catch {}

    const notes = getLocalNotes();
    const filtered = notes.filter((n) => n._id !== id);
    saveLocalNotes(filtered);
    return true;
  },

  // Toggle Pinned status
  async togglePin(id: string): Promise<INote> {
    const note = await this.getNoteById(id);
    if (!note) throw new Error('Note not found');
    return this.updateNote(id, { isPinned: !note.isPinned });
  },

  // Calculate dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const notes = getLocalNotes();
    const totalNotes = notes.length;
    const pinnedNotes = notes.filter((n) => n.isPinned).length;

    const countMap: Record<string, number> = {};
    notes.forEach((n) => {
      countMap[n.category] = (countMap[n.category] || 0) + 1;
    });

    const categories = Object.entries(countMap).map(([category, count]) => ({
      category,
      count,
    })).sort((a, b) => b.count - a.count);

    const recentNotes = [...notes]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return {
      totalNotes,
      pinnedNotes,
      categories,
      recentNotes,
    };
  },

  // Reset sample notes
  resetSeed(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_NOTES));
  },

  // Health check
  async checkBackend(): Promise<{ status: string; mongoConnected: boolean }> {
    try {
      const res = await fetch('/api/health', { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const data = await res.json();
        return { status: 'online', mongoConnected: Boolean(data.mongoDBConnected) };
      }
    } catch {}
    return { status: 'local_mode', mongoConnected: false };
  },
};
