import { create } from 'zustand';
import type { Quiz, QuizResult } from '../types/quiz';
import { evaluateQuiz } from '../lib/scoreCalculator';

interface QuizStoreState {
  activeQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: Record<string, string[]>;
  isSubmitted: boolean;
  quizResult: QuizResult | null;

  // Actions
  startQuiz: (quiz: Quiz) => void;
  selectOption: (questionId: string, optionId: string, isMultiChoice: boolean) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => QuizResult | null;
  exitQuiz: () => void;
}

export const useQuizStore = create<QuizStoreState>((set, get) => ({
  activeQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  isSubmitted: false,
  quizResult: null,

  startQuiz: (quiz: Quiz) => {
    set({
      activeQuiz: quiz,
      currentQuestionIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      quizResult: null,
    });
  },

  selectOption: (questionId: string, optionId: string, isMultiChoice: boolean) => {
    set((state) => {
      const currentSelections = state.userAnswers[questionId] || [];

      let nextSelections: string[];
      if (isMultiChoice) {
        nextSelections = currentSelections.includes(optionId)
          ? currentSelections.filter((id) => id !== optionId)
          : [...currentSelections, optionId];
      } else {
        nextSelections = [optionId];
      }

      return {
        userAnswers: {
          ...state.userAnswers,
          [questionId]: nextSelections,
        },
      };
    });
  },

  nextQuestion: () => {
    const { activeQuiz, currentQuestionIndex } = get();
    if (!activeQuiz) return;
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  submitQuiz: () => {
    const { activeQuiz, userAnswers } = get();
    if (!activeQuiz) return null;

    const result = evaluateQuiz(activeQuiz, userAnswers);
    set({
      isSubmitted: true,
      quizResult: result,
    });
    return result;
  },

  exitQuiz: () => {
    set({
      activeQuiz: null,
      currentQuestionIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      quizResult: null,
    });
  },
}));
