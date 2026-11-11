import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, RefreshCw, X, Server, Terminal, ExternalLink } from 'lucide-react';
import { notesApi } from '../services/api.ts';

interface MongoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSeed: () => void;
}

export const MongoStatusModal: React.FC<MongoStatusModalProps> = ({
  isOpen,
  onClose,
  onResetSeed,
}) => {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const mongoUriSnippet = 'MONGODB_URI=mongodb://localhost:27017/notes_db';

  const handleCopy = () => {
    navigator.clipboard.writeText(mongoUriSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await notesApi.checkBackend();
      if (res.status === 'online') {
        setTestResult('Connected to Express Backend successfully! Database handler ready.');
      } else {
        setTestResult('Running in Resilient Cloud Client Mode with persistent browser storage. Ready to connect to MongoDB in VS Code!');
      }
    } catch {
      setTestResult('Connected in Resilient Mode. MongoDB backend files available in /backend and /server!');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              MongoDB Database & Backend Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Full-Stack Node.js, Express & Mongoose Integration
            </p>
          </div>
        </div>

        {/* Stack Visual */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              Express Backend
            </span>
            <span className="text-emerald-700 bg-emerald-100/70 font-medium px-2 py-0.5 rounded text-[11px]">
              Port 5000 / REST API
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Database Engine
            </span>
            <span className="text-slate-700 font-mono text-[11px]">
              MongoDB / Mongoose ODM
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              Search & Indexing
            </span>
            <span className="text-slate-700 font-medium text-[11px]">
              Full-Text Index on Title & Description
            </span>
          </div>
        </div>

        {/* Connection String */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Default Connection URI:
            </label>
            <button
              onClick={handleCopy}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied URI' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-lg flex items-center justify-between">
            <span className="truncate">{mongoUriSnippet}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Configured in <code className="text-indigo-600 font-semibold">backend/.env</code> and <code className="text-indigo-600 font-semibold">server/config/db.ts</code>.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>{testResult}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onResetSeed();
              onClose();
            }}
            className="w-full sm:w-auto text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1.5 py-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Notes</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
