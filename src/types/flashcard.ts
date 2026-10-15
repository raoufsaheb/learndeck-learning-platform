export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export type ReviewConfidence = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  courseId: string;
  moduleId?: string;
  category: string;
  front: {
    prompt: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
  };
  back: {
    solution: string;
    explanation: string;
    keyTakeaway: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
  };
  box: LeitnerBox;
  lastReviewedAt: string | null;
  nextReviewDue: string;
  timesReviewed: number;
  timesCorrect: number;
}
