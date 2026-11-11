import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types/note.ts';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string, major?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginAsDemo: (type: 'alex' | 'priya' | 'marcus') => void;
}

const AUTH_USER_KEY = 'online_notes_auth_user';

const DEMO_USERS: Record<string, IUser> = {
  alex: {
    id: 'user_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    role: 'Computer Science Major',
    major: 'Computer Science (Year 3)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  priya: {
    id: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.s@university.edu',
    role: 'Data Science & AI',
    major: 'Data Science (Year 4)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  marcus: {
    id: 'user_marcus',
    name: 'Marcus Chen',
    email: 'marcus.chen@university.edu',
    role: 'Software Engineering',
    major: 'Software Engineering (Year 2)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
      // Default initial session for a seamless experience
      return DEMO_USERS.alex;
    } catch {
      return DEMO_USERS.alex;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Try backend authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const loggedInUser: IUser = {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || 'Student',
            avatar: data.user.avatar,
          };
          setUser(loggedInUser);
          return { success: true, message: 'Welcome back, ' + data.user.name };
        }
      }
    } catch {
      // Fallback local auth validation
    }

    // Client-side demo fallback
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }

    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long' };
    }

    const nameFromEmail = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = nameFromEmail
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Student User';

    const newUser: IUser = {
      id: `user_${Date.now()}`,
      name: formattedName,
      email: email.toLowerCase(),
      role: 'Student',
      major: 'Computer Science',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=4f46e5`,
    };

    setUser(newUser);
    return { success: true, message: `Logged in successfully as ${formattedName}!` };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    major: string = 'Computer Science'
  ): Promise<{ success: boolean; message: string }> => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, message: 'Please complete all required fields' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password should be at least 6 characters long' };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const newUser: IUser = {
            id: data.user.id || data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || 'Student',
            major,
            avatar: data.user.avatar,
          };
          setUser(newUser);
          return { success: true, message: 'Account created successfully!' };
        }
      }
    } catch {}

    const registeredUser: IUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'Student',
      major,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
    };

    setUser(registeredUser);
    return { success: true, message: 'Welcome to Online Notes Management System!' };
  };

  const logout = () => {
    setUser(null);
  };

  const loginAsDemo = (type: 'alex' | 'priya' | 'marcus') => {
    setUser(DEMO_USERS[type]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
