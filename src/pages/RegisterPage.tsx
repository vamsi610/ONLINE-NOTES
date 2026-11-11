import React, { useState } from 'react';
import { UserPlus, User, Mail, Lock, BookOpen, GraduationCap, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', percent: 0, color: '' };
    if (pwd.length < 6) return { label: 'Weak', percent: 30, color: 'bg-rose-500' };
    if (pwd.length < 9) return { label: 'Medium', percent: 65, color: 'bg-amber-500' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register(name, email, password, major);
      if (res.success) {
        onNavigate('dashboard');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create student account');
    } finally {
      setLoading(false);
    }
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
          Create Student Account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500">
          Join your fellow classmates and start organizing lecture notes
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
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Academic Major */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Department / Major
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Mathematics & Computing">Mathematics & Computing</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {password.length > 0 && (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                    Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Sign In here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
