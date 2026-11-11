export interface INote {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  major?: string;
}

export type SubjectCategory =
  | 'Java'
  | 'Python'
  | 'DBMS'
  | 'Mathematics'
  | 'Web Development'
  | 'Data Structures'
  | 'Computer Networks'
  | 'Operating Systems'
  | 'General'
  | string;

export interface CategoryStat {
  category: string;
  count: number;
  color: string;
  iconName?: string;
}

export interface DashboardStats {
  totalNotes: number;
  pinnedNotes: number;
  categories: { category: string; count: number }[];
  recentNotes: INote[];
}
