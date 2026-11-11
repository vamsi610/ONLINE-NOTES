import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, BookOpen, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        onNavigate('dashboard');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (type: 'alex' | 'priya' | 'marcus') => {
    loginAsDemo(type);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Your Student Account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          Access and manage your course notes, subjects, and study materials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm border border-slate-200 rounded-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min 4 chars</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Or 1-Click Demo Student Sign-In:</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('alex')}
                className="p-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors text-center"
              >
                Alex (CS)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('priya')}
                className="p-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors text-center"
              >
                Priya (AI)
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('marcus')}
                className="p-2 text-[11px] font-semibold text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg border border-slate-200 transition-colors text-center"
              >
                Marcus (SE)
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
