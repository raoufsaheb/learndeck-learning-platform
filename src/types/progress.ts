import type { QuizResult } from './quiz';

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  cardsReviewed: number;
  quizzesCompleted: number;
  xpEarned: number;
}

export interface UserProgressState {
  totalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  completedLessonIds: string[];
  completedModuleIds: string[];
  completedCourseIds: string[];
  quizResults: Record<string, QuizResult>; // quizId -> best result
  dailyHistory: DailyActivity[];
}
