import React from 'react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

const CATEGORY_COLORS: Record<string, { dot: string; text: string }> = {
  Java: { dot: 'bg-amber-500', text: 'text-amber-700' },
  Python: { dot: 'bg-emerald-500', text: 'text-emerald-700' },
  DBMS: { dot: 'bg-blue-500', text: 'text-blue-700' },
  Mathematics: { dot: 'bg-purple-500', text: 'text-purple-700' },
  'Web Development': { dot: 'bg-cyan-500', text: 'text-cyan-700' },
  'Data Structures': { dot: 'bg-rose-500', text: 'text-rose-700' },
  'Computer Networks': { dot: 'bg-indigo-500', text: 'text-indigo-700' },
  'Operating Systems': { dot: 'bg-teal-500', text: 'text-teal-700' },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const theme = CATEGORY_COLORS[category] || { dot: 'bg-slate-400', text: 'text-slate-700' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wide ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${theme.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${theme.dot} shrink-0`} aria-hidden="true" />
      <span>{category}</span>
    </span>
  );
};
