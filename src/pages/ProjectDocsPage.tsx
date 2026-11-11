import React, { useState } from 'react';
import {
  Code2,
  FolderTree,
  Terminal,
  Database,
  Copy,
  Check,
  Server,
  Layers,
  FileCode,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

interface ProjectDocsPageProps {
  onNavigate: (page: string) => void;
}

export const ProjectDocsPage: React.FC<ProjectDocsPageProps> = ({ onNavigate }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('backend/server.js');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fileExplanations = [
    {
      path: 'backend/server.js',
      category: 'Backend',
      purpose: 'The central Express.js application server. Initializes middleware (CORS, JSON parser), connects to MongoDB via Mongoose, and mounts `/api/auth` and `/api/notes` routes on port 5000.',
    },
    {
      path: 'backend/config/db.js',
      category: 'Backend',
      purpose: 'Handles connection to MongoDB using Mongoose. Reads `MONGODB_URI` from `.env`, manages connection timeouts, handles reconnection, and logs connection host.',
    },
    {
      path: 'backend/models/User.js',
      category: 'Backend',
      purpose: 'Mongoose schema and model for student accounts. Enforces required fields, email formatting, password length, and timestamps (`createdAt`, `updatedAt`).',
    },
    {
      path: 'backend/models/Note.js',
      category: 'Backend',
      purpose: 'Mongoose schema for academic notes. Contains `title`, `description`, `category` (Java, Python, DBMS, Mathematics, etc.), `tags`, `isPinned`, and full-text indexes for search.',
    },
    {
      path: 'backend/controllers/noteController.js',
      category: 'Backend',
      purpose: 'Business logic for note management. Implements `getNotes` (with multi-field search and category filtering), `getNoteById`, `createNote`, `updateNote`, `deleteNote`, and `getDashboardStats`.',
    },
    {
      path: 'backend/controllers/authController.js',
      category: 'Backend',
      purpose: 'Authentication controller. Implements student registration with email validation, login verification, and session token generation.',
    },
    {
      path: 'backend/routes/noteRoutes.js',
      category: 'Backend',
      purpose: 'Express router defining RESTful routes: `GET /api/notes`, `POST /api/notes`, `GET /:id`, `PUT /:id`, `DELETE /:id`, and `GET /stats`.',
    },
    {
      path: 'backend/routes/authRoutes.js',
      category: 'Backend',
      purpose: 'Express router defining `/api/auth/register` and `/api/auth/login`.',
    },
    {
      path: 'backend/package.json',
      category: 'Backend',
      purpose: 'Contains backend dependencies: `express`, `mongoose`, `dotenv`, `cors`, and `nodemon` for hot-reloading.',
    },
    {
      path: 'src/services/api.ts',
      category: 'Frontend',
      purpose: 'Unified API client that connects the React frontend to Express `/api` endpoints, with zero-friction browser fallback and localStorage persistence.',
    },
    {
      path: 'src/context/AuthContext.tsx',
      category: 'Frontend',
      purpose: 'React context for user authentication state. Manages active student profile, login, registration, logout, and 1-click demo accounts.',
    },
    {
      path: 'src/pages/DashboardPage.tsx',
      category: 'Frontend',
      purpose: 'Main student hub displaying total notes, pinned notes, subject categories, real-time search, and interactive note cards.',
    },
    {
      path: 'src/pages/CreateNotePage.tsx',
      category: 'Frontend',
      purpose: 'Note composer with automatic date/time, subject category selector, rich Markdown toolbar, tags input, and live preview.',
    },
    {
      path: 'src/pages/ViewNotePage.tsx',
      category: 'Frontend',
      purpose: 'Dedicated note reader with Markdown formatting, copy to clipboard, export as Markdown file, and print styling.',
    },
    {
      path: 'src/pages/EditNotePage.tsx',
      category: 'Frontend',
      purpose: 'Note editor pre-populated with existing note data to update title, category, tags, and description.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-3">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Documentation & Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            VS Code Setup & Complete Source Code Guide
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Everything you need to run this project in Visual Studio Code, connect to MongoDB, and understand the frontend and backend separation.
          </p>
        </div>

        {/* Step-by-Step VS Code Guide */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Step-by-Step Visual Studio Code Instructions
              </h2>
              <p className="text-xs text-slate-500">
                Commands to execute in your VS Code terminal
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700">
                  STEP 1: Open in VS Code & Start the Backend
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'cd backend\nnpm install\ncp .env.example .env\nnpm run dev',
                      'step1'
                    )
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step1' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto">
{`# 1. Open Terminal in VS Code (Ctrl + \` or Terminal > New Terminal)
cd backend

# 2. Install backend dependencies (express, mongoose, dotenv, cors)
npm install

# 3. Create your .env environment file
cp .env.example .env

# 4. Start the backend server with nodemon
npm run dev
# -> Server running on port 5000`}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700">
                  STEP 2: Start the Frontend in a Second Terminal Tab
                </span>
                <button
                  onClick={() =>
                    copyToClipboard('npm install\nnpm run dev', 'step2')
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step2' ? 'Copied' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto">
{`# In VS Code, click the '+' icon in the terminal panel to open a 2nd tab:
npm install

# Start the Vite development server
npm run dev

# -> Open http://localhost:3000 in your web browser`}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700">
                  STEP 3: MongoDB Database Connection
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'MONGODB_URI=mongodb://localhost:27017/notes_db',
                      'step3'
                    )
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                >
                  {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step3' ? 'Copied' : 'Copy MongoDB URI'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-600 mb-2">
                Set this inside <code className="text-indigo-600 font-semibold font-mono">backend/.env</code>:
              </p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto">
{`# For Local MongoDB (free Community Server):
MONGODB_URI=mongodb://localhost:27017/notes_db

# Or for free MongoDB Atlas Cloud:
MONGODB_URI=mongodb+srv://student:<password>@cluster0.abcde.mongodb.net/notes_db?retryWrites=true&w=majority`}
              </pre>
            </div>
          </div>
        </section>

        {/* Purpose of Every File Directory Table */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Purpose of Every File
              </h2>
              <p className="text-xs text-slate-500">
                Detailed breakdown of frontend and backend architecture
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">File Path</th>
                  <th className="py-3 px-4">Layer</th>
                  <th className="py-3 px-4">Function & Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {fileExplanations.map((file, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-700">
                      {file.path}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          file.category === 'Backend'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {file.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 leading-relaxed">{file.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* REST API Reference */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                RESTful API Endpoints
              </h2>
              <p className="text-xs text-slate-500">
                Communicating between React and the Node.js Express Server
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded mr-2">GET</span>
                <span className="font-semibold text-slate-800">/api/notes</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Fetch all notes (supports ?search, ?category, ?pinned)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded mr-2">POST</span>
                <span className="font-semibold text-slate-800">/api/notes</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Create note (saves to MongoDB)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded mr-2">PUT</span>
                <span className="font-semibold text-slate-800">/api/notes/:id</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Update note title, category, tags, or description</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded mr-2">DELETE</span>
                <span className="font-semibold text-slate-800">/api/notes/:id</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Permanently remove note from MongoDB</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded mr-2">GET</span>
                <span className="font-semibold text-slate-800">/api/notes/stats</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Dashboard metrics & category aggregates</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded mr-2">POST</span>
                <span className="font-semibold text-slate-800">/api/auth/register</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Student user registration</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded mr-2">POST</span>
                <span className="font-semibold text-slate-800">/api/auth/login</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Student user login authentication</span>
            </div>
          </div>
        </section>

        {/* Back to App CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Return to Notes Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
