import { describe, it, expect } from 'vitest';
import {
  calculateNextBox,
  computeNextReviewDate,
  reviewFlashcard,
  isCardDue,
  BOX_INTERVAL_DAYS,
  CONFIDENCE_XP,
} from '../src/lib/leitnerEngine';
import type { Flashcard } from '../src/types/flashcard';

const mockCard: Flashcard = {
  id: 'test-1',
  courseId: 'frontend-perf',
  category: 'Rendering',
  front: { prompt: 'What causes layout thrashing?' },
  back: {
    solution: 'Forced Synchronous Layout',
    explanation: 'Alternating between geometry reads and style writes.',
    keyTakeaway: 'Batch reads then writes.',
  },
  box: 2,
  lastReviewedAt: '2026-10-10T12:00:00.000Z',
  nextReviewDue: '2026-10-13',
  timesReviewed: 3,
  timesCorrect: 2,
};

describe('Leitner 5-Box Spaced Repetition Engine', () => {
  it('demotes to Box 1 when confidence is "again"', () => {
    expect(calculateNextBox(3, 'again')).toBe(1);
    expect(calculateNextBox(5, 'again')).toBe(1);
    expect(calculateNextBox(1, 'again')).toBe(1);
  });

  it('maintains the current box when confidence is "hard"', () => {
    expect(calculateNextBox(2, 'hard')).toBe(2);
    expect(calculateNextBox(4, 'hard')).toBe(4);
  });

  it('promotes to next box on "good" and "easy", capped at Box 5', () => {
    expect(calculateNextBox(1, 'good')).toBe(2);
    expect(calculateNextBox(2, 'easy')).toBe(3);
    expect(calculateNextBox(4, 'good')).toBe(5);
    expect(calculateNextBox(5, 'easy')).toBe(5);
  });

  it('computes correct future review dates according to box interval schedule', () => {
    const baseDate = new Date('2026-10-15T00:00:00.000Z');
    expect(computeNextReviewDate(1, baseDate)).toBe('2026-10-16'); // +1 day
    expect(computeNextReviewDate(2, baseDate)).toBe('2026-10-18'); // +3 days
    expect(computeNextReviewDate(3, baseDate)).toBe('2026-10-22'); // +7 days
    expect(computeNextReviewDate(4, baseDate)).toBe('2026-10-29'); // +14 days
    expect(computeNextReviewDate(5, baseDate)).toBe('2026-11-14'); // +30 days
  });

  it('updates card state and computes XP on successful review', () => {
    const reviewDate = new Date('2026-10-15T10:00:00.000Z');
    const { updatedCard, xpEarned } = reviewFlashcard(mockCard, 'good', reviewDate);

    expect(updatedCard.box).toBe(3); // was 2, now 3
    expect(updatedCard.timesReviewed).toBe(4); // was 3
    expect(updatedCard.timesCorrect).toBe(3); // was 2
    expect(updatedCard.nextReviewDue).toBe('2026-10-22'); // +7d
    expect(xpEarned).toBe(CONFIDENCE_XP.good); // 15 XP
  });

  it('demotes card on "again" without incrementing correct counter', () => {
    const reviewDate = new Date('2026-10-15T10:00:00.000Z');
    const { updatedCard, xpEarned } = reviewFlashcard(mockCard, 'again', reviewDate);

    expect(updatedCard.box).toBe(1);
    expect(updatedCard.timesReviewed).toBe(4);
    expect(updatedCard.timesCorrect).toBe(2); // unchanged
    expect(updatedCard.nextReviewDue).toBe('2026-10-16'); // +1d
    expect(xpEarned).toBe(CONFIDENCE_XP.again); // 5 XP
  });

  it('evaluates whether a card is due for review', () => {
    expect(isCardDue(mockCard, '2026-10-14')).toBe(true); // nextReviewDue is 2026-10-13 <= 2026-10-14
    expect(isCardDue(mockCard, '2026-10-13')).toBe(true); // equal is due
    expect(isCardDue(mockCard, '2026-10-12')).toBe(false); // future is not due
  });

  it('validates box intervals mapping completeness', () => {
    expect(BOX_INTERVAL_DAYS[1]).toBe(1);
    expect(BOX_INTERVAL_DAYS[2]).toBe(3);
    expect(BOX_INTERVAL_DAYS[3]).toBe(7);
    expect(BOX_INTERVAL_DAYS[4]).toBe(14);
    expect(BOX_INTERVAL_DAYS[5]).toBe(30);
  });
});
