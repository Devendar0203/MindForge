export type TopicCategory = 'dsa' | 'ml' | 'math' | 'review' | 'project';

export interface PracticeProblem {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  technique: string;
}

export interface CurriculumDay {
  day: number;
  week?: string;
  title: string;
  sub: string;
  category: TopicCategory;
  keyConcepts: string[];
  practiceProblems: PracticeProblem[];
  deepDive: string;
}

export interface DayData {
  skill: boolean;
  hours: string;
  rep: boolean;
  repType?: string;
  repNote?: string;
  scroll: boolean;
  avoided: string;
  faced: string;
  completedAt?: string;
  practiceChecked?: boolean[];
  notes?: string;
}

export interface RebuildState {
  currentDay: number;
  days: Record<number, DayData>;
  soundEnabled: boolean;
  startDate?: string;
}

export interface DailyWisdomItem {
  day: number;
  quote: string;
  author: string;
  role: string;
  context?: string;
  theme: string;
}
