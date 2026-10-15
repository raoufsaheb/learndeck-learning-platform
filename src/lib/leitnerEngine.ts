import type { Flashcard, LeitnerBox, ReviewConfidence } from '../types/flashcard';

export const BOX_INTERVAL_DAYS: Record<LeitnerBox, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export const CONFIDENCE_XP: Record<ReviewConfidence, number> = {
  again: 5,
  hard: 10,
  good: 15,
  easy: 20,
};

/**
 * Calculates next box following the Leitner 5-box algorithm.
 */
export function calculateNextBox(currentBox: LeitnerBox, confidence: ReviewConfidence): LeitnerBox {
  switch (confidence) {
    case 'again':
      return 1;
    case 'hard':
      return currentBox;
    case 'good':
      return Math.min(5, currentBox + 1) as LeitnerBox;
    case 'easy':
      return Math.min(5, currentBox + 1) as LeitnerBox;
  }
}

/**
 * Computes next review date by adding box interval days to reference date.
 */
export function computeNextReviewDate(box: LeitnerBox, fromDate: Date = new Date()): string {
  const days = BOX_INTERVAL_DAYS[box];
  const target = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
  return target.toISOString().split('T')[0];
}

/**
 * Applies a review to a flashcard, returning the updated card and XP earned.
 */
export function reviewFlashcard(
  card: Flashcard,
  confidence: ReviewConfidence,
  reviewDate: Date = new Date()
): { updatedCard: Flashcard; xpEarned: number } {
  const nextBox = calculateNextBox(card.box, confidence);
  const nextDue = computeNextReviewDate(nextBox, reviewDate);
  const isCorrect = confidence === 'good' || confidence === 'easy';

  const updatedCard: Flashcard = {
    ...card,
    box: nextBox,
    lastReviewedAt: reviewDate.toISOString(),
    nextReviewDue: nextDue,
    timesReviewed: card.timesReviewed + 1,
    timesCorrect: isCorrect ? card.timesCorrect + 1 : card.timesCorrect,
  };

  const xpEarned = CONFIDENCE_XP[confidence];
  return { updatedCard, xpEarned };
}

/**
 * Determines whether a flashcard is due for review today or overdue.
 */
export function isCardDue(card: Flashcard, todayDate: string = new Date().toISOString().split('T')[0]): boolean {
  return card.nextReviewDue <= todayDate;
}
