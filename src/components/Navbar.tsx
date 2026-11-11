import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  Home,
  Code2,
  LogOut,
  Database,
  Menu,
  X,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, noteId?: string) => void;
  onOpenMongoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenMongoModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Note', icon: PlusCircle },
    { id: 'docs', label: 'VS Code & MongoDB Guide', icon: Code2 },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block leading-tight">
                  NotesHub
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                  Online Notes Management
                </span>
              </div>
            </button>

            {/* DB Status Button */}
            <button
              onClick={onOpenMongoModal}
              title="MongoDB Connection & Architecture Status"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>MongoDB Ready</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions & User Area */}
          <div className="flex items-center gap-3">
            {/* Quick Create CTA (Desktop) */}
            <button
              onClick={() => onNavigate('create')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Note</span>
            </button>

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="hidden xl:inline-block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5">{user.major || user.role}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        My Notes Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('docs');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <Code2 className="w-3.5 h-3.5 text-slate-400" />
                        VS Code Setup Guide
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMongoModal();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg text-left"
              >
                <Database className="w-4 h-4 text-emerald-600" />
                <span>MongoDB & VS Code Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
