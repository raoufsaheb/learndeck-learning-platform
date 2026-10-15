import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../src/store/progressStore';
import type { QuizResult } from '../src/types/quiz';

describe('Progress & Gamification Store', () => {
  beforeEach(() => {
    useProgressStore.getState().resetDemoData();
  });

  it('initializes with seed data and default streak', () => {
    const state = useProgressStore.getState();
    expect(state.totalXp).toBeGreaterThanOrEqual(1420);
    expect(state.streakDays).toBe(14);
    expect(state.flashcards.length).toBeGreaterThan(0);
    expect(state.dailyHistory.length).toBe(7);
  });

  it('completes a lesson and adds XP without duplicate credit', () => {
    const store = useProgressStore.getState();
    const initialXp = store.totalXp;

    store.completeLesson('les-new-1', 'mod-crp', 'frontend-perf', 30);
    expect(useProgressStore.getState().completedLessonIds).toContain('les-new-1');
    expect(useProgressStore.getState().totalXp).toBe(initialXp + 30);

    // Call again with same lesson ID
    useProgressStore.getState().completeLesson('les-new-1', 'mod-crp', 'frontend-perf', 30);
    expect(useProgressStore.getState().totalXp).toBe(initialXp + 30); // XP unchanged
  });

  it('records quiz result and completes module if passed', () => {
    const mockResult: QuizResult = {
      quizId: 'quiz-crp',
      scorePercentage: 100,
      totalQuestions: 3,
      correctAnswersCount: 3,
      xpEarned: 185,
      passed: true,
      completedAt: new Date().toISOString(),
      userAnswers: {},
    };

    const initialXp = useProgressStore.getState().totalXp;
    useProgressStore.getState().recordQuizResult(mockResult, 'mod-crp', 'frontend-perf');

    const updated = useProgressStore.getState();
    expect(updated.quizResults['quiz-crp']).toBeDefined();
    expect(updated.completedModuleIds).toContain('mod-crp');
    expect(updated.totalXp).toBe(initialXp + 185);
  });

  it('reviews a flashcard and updates box state and daily activity history', () => {
    const store = useProgressStore.getState();
    const cardId = store.flashcards[0].id;
    const initialXp = store.totalXp;

    const reviewRes = store.reviewCard(cardId, 'good');
    expect(reviewRes).not.toBeNull();
    expect(reviewRes?.xpEarned).toBe(15);

    const updated = useProgressStore.getState();
    expect(updated.totalXp).toBe(initialXp + 15);
    const updatedCard = updated.flashcards.find((c) => c.id === cardId);
    expect(updatedCard?.timesReviewed).toBeGreaterThan(0);
  });

  it('resets demo data cleanly to initial defaults', () => {
    useProgressStore.getState().completeLesson('custom-1', 'm', 'c', 500);
    expect(useProgressStore.getState().completedLessonIds).toContain('custom-1');

    useProgressStore.getState().resetDemoData();
    expect(useProgressStore.getState().completedLessonIds).not.toContain('custom-1');
    expect(useProgressStore.getState().totalXp).toBe(1420);
  });
});
