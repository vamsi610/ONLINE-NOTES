import React from 'react';
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Folders,
  Database,
  Code2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HomePageProps {
  onNavigate: (page: string, noteId?: string) => void;
  notesCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, notesCount }) => {
  const { isAuthenticated, user } = useAuth();

  const subjects = [
    {
      name: 'Java',
      desc: 'OOP, Interfaces, JVM Internals, Multi-threading & Spring',
      color: 'border-l-amber-500 hover:border-amber-500',
      badge: 'text-amber-700 bg-amber-50',
      count: '15+ notes',
    },
    {
      name: 'Python',
      desc: 'List Comprehensions, Asyncio, Data Science & Generators',
      color: 'border-l-emerald-500 hover:border-emerald-500',
      badge: 'text-emerald-700 bg-emerald-50',
      count: '24+ notes',
    },
    {
      name: 'DBMS',
      desc: 'SQL Queries, 1NF-BCNF Normalization, ACID & Indexing',
      color: 'border-l-blue-500 hover:border-blue-500',
      badge: 'text-blue-700 bg-blue-50',
      count: '18+ notes',
    },
    {
      name: 'Mathematics',
      desc: 'Linear Algebra, Eigenvalues, Discrete Math & Calculus',
      color: 'border-l-purple-500 hover:border-purple-500',
      badge: 'text-purple-700 bg-purple-50',
      count: '12+ notes',
    },
  ];

  const highlights = [
    {
      icon: Zap,
      title: 'Real-Time Full-Text Search',
      desc: 'Instant filtering across note titles, descriptions, and custom tags as you type.',
    },
    {
      icon: Folders,
      title: 'Subject-Driven Categorization',
      desc: 'Organize notes by academic subjects with custom colors, pin important topics, and track stats.',
    },
    {
      icon: Database,
      title: 'MongoDB & Express Backed',
      desc: 'Built with Mongoose schemas, REST API endpoints, and zero-loss local storage sync.',
    },
    {
      icon: Code2,
      title: 'Developer & Student Friendly',
      desc: 'Complete clean source code structured for Visual Studio Code with step-by-step guides.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-white">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-indigo-50/60 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Minimal Subheading */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-full mb-6 border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full-Stack Academic Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Online Notes <br className="hidden sm:block" />
              <span className="text-indigo-600">Management System</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create, organize, search, and manage your academic lecture notes in one clean workspace. Organize by Java, Python, DBMS, Mathematics, and custom subjects.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group"
              >
                <span>Go to Notes Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('create')}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-slate-500" />
                <span>Create New Note</span>
              </button>

              <button
                onClick={() => onNavigate('docs')}
                className="w-full sm:w-auto px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-4 h-4" />
                <span>VS Code Guide</span>
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{notesCount}+</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Academic Notes Ready</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-indigo-600">4+</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Core Subject Fields</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Mongoose & Express</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">0 ms</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Instant Client Filter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subject Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Organized by Academic Subjects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Separate your study notes cleanly with dedicated filters and tags
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {subjects.map((sub) => (
            <div
              key={sub.name}
              onClick={() => onNavigate('dashboard')}
              className={`p-5 bg-white rounded-xl border border-slate-200 border-l-4 ${sub.color} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-lg">{sub.name}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${sub.badge}`}>
                    {sub.count}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{sub.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
                <span>Browse {sub.name} Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Highlights */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Engineered for Student Productivity
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Every tool a student needs to retain concepts and ace exams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{h.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Quick Start CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to organize your study notes?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Create an account or use one of our pre-configured student demo accounts to experience the full CRUD workflow, Markdown rendering, and MongoDB sync.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('create')}
                className="px-6 py-3 text-xs sm:text-sm font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors shadow-sm"
              >
                Create a Note Now
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-3 text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
              >
                Explore Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
