/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { MongoStatusModal } from './components/MongoStatusModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CreateNotePage } from './pages/CreateNotePage.tsx';
import { ViewNotePage } from './pages/ViewNotePage.tsx';
import { EditNotePage } from './pages/EditNotePage.tsx';
import { ProjectDocsPage } from './pages/ProjectDocsPage.tsx';
import { INote } from './types/note.ts';
import { notesApi } from './services/api.ts';
import { CheckCircle2, AlertCircle, X, BookOpen, Code2, Database } from 'lucide-react';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load notes on mount
  const loadNotes = async () => {
    try {
      const data = await notesApi.getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Navigation router
  const handleNavigate = (page: string, noteId?: string) => {
    if (noteId) {
      setActiveNoteId(noteId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Note CRUD Actions
  const handleCreateNote = async (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    isPinned: boolean;
  }) => {
    try {
      const created = await notesApi.createNote(data);
      setNotes((prev) => [created, ...prev.filter((n) => n._id !== created._id)]);
      showToast('Note created and saved to MongoDB successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to create note', 'error');
      throw err;
    }
  };

  const handleUpdateNote = async (id: string, updates: Partial<INote>) => {
    try {
      const updated = await notesApi.updateNote(id, updates);
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
      showToast('Note changes saved to database!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update note', 'error');
      throw err;
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await notesApi.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      showToast('Note permanently deleted.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete note', 'error');
      throw err;
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const updated = await notesApi.togglePin(id);
      setNotes((prev) =>
        prev.map((n) => (n._id === id ? updated : n)).sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        })
      );
      showToast(updated.isPinned ? 'Note pinned to top' : 'Note unpinned');
    } catch (err: any) {
      showToast('Failed to toggle pin state', 'error');
    }
  };

  const handleResetSeed = async () => {
    notesApi.resetSeed();
    await loadNotes();
    showToast('Reset sample notes for Java, Python, DBMS, and Mathematics.');
  };

  // Find active note for view / edit
  const activeNote = activeNoteId ? notes.find((n) => n._id === activeNoteId) || null : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-600 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenMongoModal={() => setIsMongoModalOpen(true)}
      />

      {/* Page Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} notesCount={notes.length} />
        )}

        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}

        {currentPage === 'dashboard' && (
          <DashboardPage
            notes={notes}
            onNavigate={handleNavigate}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
          />
        )}

        {currentPage === 'create' && (
          <CreateNotePage
            onNavigate={handleNavigate}
            onCreateNote={handleCreateNote}
          />
        )}

        {currentPage === 'view' && (
          <ViewNotePage
            note={activeNote}
            onNavigate={handleNavigate}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
          />
        )}

        {currentPage === 'edit' && (
          <EditNotePage
            note={activeNote}
            onNavigate={handleNavigate}
            onUpdateNote={handleUpdateNote}
          />
        )}

        {currentPage === 'docs' && <ProjectDocsPage onNavigate={handleNavigate} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Online Notes Management System — Academic Edition</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigate('docs')}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-semibold text-slate-700"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>VS Code Guide</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsMongoModalOpen(true)}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>MongoDB Architecture</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Node.js · Express · MongoDB</span>
          </div>
        </div>
      </footer>

      {/* MongoDB Inspection Modal */}
      <MongoStatusModal
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
        onResetSeed={handleResetSeed}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
