import { create } from 'zustand';
import type { Flashcard, ReviewConfidence } from '../types/flashcard';
import type { QuizResult } from '../types/quiz';
import type { DailyActivity } from '../types/progress';
import { SEED_FLASHCARDS } from '../data/seedFlashcards';
import { reviewFlashcard } from '../lib/leitnerEngine';

const STORAGE_KEY = 'learndeck_state_v1';

const SEED_DAILY_HISTORY: DailyActivity[] = [
  { date: '2026-10-09', cardsReviewed: 12, quizzesCompleted: 1, xpEarned: 180 },
  { date: '2026-10-10', cardsReviewed: 8, quizzesCompleted: 0, xpEarned: 90 },
  { date: '2026-10-11', cardsReviewed: 15, quizzesCompleted: 2, xpEarned: 240 },
  { date: '2026-10-12', cardsReviewed: 6, quizzesCompleted: 0, xpEarned: 75 },
  { date: '2026-10-13', cardsReviewed: 10, quizzesCompleted: 1, xpEarned: 160 },
  { date: '2026-10-14', cardsReviewed: 14, quizzesCompleted: 1, xpEarned: 210 },
  { date: '2026-10-15', cardsReviewed: 5, quizzesCompleted: 0, xpEarned: 65 },
];

interface ProgressStoreState {
  totalXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  completedLessonIds: string[];
  completedModuleIds: string[];
  completedCourseIds: string[];
  quizResults: Record<string, QuizResult>;
  flashcards: Flashcard[];
  dailyHistory: DailyActivity[];

  // Actions
  completeLesson: (lessonId: string, moduleId: string, courseId: string, xpEarned?: number) => void;
  recordQuizResult: (result: QuizResult, moduleId?: string, courseId?: string) => void;
  reviewCard: (cardId: string, confidence: ReviewConfidence) => { updatedCard: Flashcard; xpEarned: number } | null;
  resetDemoData: () => void;
}

const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback to defaults
    }
  }

  return {
    totalXp: 1420,
    streakDays: 14,
    lastActiveDate: '2026-10-15',
    completedLessonIds: ['les-crp-1'],
    completedModuleIds: [],
    completedCourseIds: [],
    quizResults: {},
    flashcards: SEED_FLASHCARDS,
    dailyHistory: SEED_DAILY_HISTORY,
  };
};

export const useProgressStore = create<ProgressStoreState>((set, get) => ({
  ...getInitialState(),

  completeLesson: (lessonId: string, _moduleId: string, _courseId: string, xpEarned = 25) => {
    set((state) => {
      if (state.completedLessonIds.includes(lessonId)) {
        return state;
      }
      const nextCompleted = [...state.completedLessonIds, lessonId];
      const nextXp = state.totalXp + xpEarned;
      const today = new Date().toISOString().split('T')[0];

      const nextState = {
        ...state,
        totalXp: nextXp,
        completedLessonIds: nextCompleted,
        lastActiveDate: today,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  },

  recordQuizResult: (result: QuizResult, moduleId?: string, _courseId?: string) => {
    set((state) => {
      const nextQuizResults = {
        ...state.quizResults,
        [result.quizId]: result,
      };

      const nextCompletedModules =
        result.passed && moduleId && !state.completedModuleIds.includes(moduleId)
          ? [...state.completedModuleIds, moduleId]
          : state.completedModuleIds;

      const nextXp = state.totalXp + result.xpEarned;
      const today = new Date().toISOString().split('T')[0];

      // Update daily history
      const historyCopy = [...state.dailyHistory];
      const todayIndex = historyCopy.findIndex((h) => h.date === today);
      if (todayIndex >= 0) {
        historyCopy[todayIndex] = {
          ...historyCopy[todayIndex],
          quizzesCompleted: historyCopy[todayIndex].quizzesCompleted + 1,
          xpEarned: historyCopy[todayIndex].xpEarned + result.xpEarned,
        };
      } else {
        historyCopy.push({
          date: today,
          cardsReviewed: 0,
          quizzesCompleted: 1,
          xpEarned: result.xpEarned,
        });
      }

      const nextState = {
        ...state,
        totalXp: nextXp,
        quizResults: nextQuizResults,
        completedModuleIds: nextCompletedModules,
        dailyHistory: historyCopy,
        lastActiveDate: today,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  },

  reviewCard: (cardId: string, confidence: ReviewConfidence) => {
    const card = get().flashcards.find((c) => c.id === cardId);
    if (!card) return null;

    const { updatedCard, xpEarned } = reviewFlashcard(card, confidence);

    set((state) => {
      const updatedFlashcards = state.flashcards.map((c) => (c.id === cardId ? updatedCard : c));
      const nextXp = state.totalXp + xpEarned;
      const today = new Date().toISOString().split('T')[0];

      // Update daily history
      const historyCopy = [...state.dailyHistory];
      const todayIndex = historyCopy.findIndex((h) => h.date === today);
      if (todayIndex >= 0) {
        historyCopy[todayIndex] = {
          ...historyCopy[todayIndex],
          cardsReviewed: historyCopy[todayIndex].cardsReviewed + 1,
          xpEarned: historyCopy[todayIndex].xpEarned + xpEarned,
        };
      } else {
        historyCopy.push({
          date: today,
          cardsReviewed: 1,
          quizzesCompleted: 0,
          xpEarned,
        });
      }

      const nextState = {
        ...state,
        totalXp: nextXp,
        flashcards: updatedFlashcards,
        dailyHistory: historyCopy,
        lastActiveDate: today,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });

    return { updatedCard, xpEarned };
  },

  resetDemoData: () => {
    const freshState = {
      totalXp: 1420,
      streakDays: 14,
      lastActiveDate: '2026-10-15',
      completedLessonIds: ['les-crp-1'],
      completedModuleIds: [],
      completedCourseIds: [],
      quizResults: {},
      flashcards: SEED_FLASHCARDS,
      dailyHistory: SEED_DAILY_HISTORY,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    } catch {
      // ignore
    }
    set(freshState);
  },
}));
