import type { Quiz, QuizQuestion, QuizResult } from '../types/quiz';

/**
 * Evaluates whether user's selected option IDs correctly answer a question.
 */
export function isAnswerCorrect(question: QuizQuestion, selectedIds: string[]): boolean {
  if (selectedIds.length === 0) return false;

  const correctSet = new Set(question.correctAnswerIds);
  const userSet = new Set(selectedIds);

  if (correctSet.size !== userSet.size) return false;
  for (const id of correctSet) {
    if (!userSet.has(id)) return false;
  }
  return true;
}

/**
 * Evaluates an entire completed quiz, computing percentage, XP, and pass/fail.
 */
export function evaluateQuiz(
  quiz: Quiz,
  userAnswers: Record<string, string[]>,
  completedAt: string = new Date().toISOString()
): QuizResult {
  let correctCount = 0;
  let xpEarned = 0;

  for (const question of quiz.questions) {
    const selected = userAnswers[question.id] || [];
    if (isAnswerCorrect(question, selected)) {
      correctCount += 1;
      xpEarned += question.xpValue;
    }
  }

  const totalQuestions = quiz.questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercentage >= quiz.passingScorePercentage;

  // Bonus 50 XP for perfect 100% score
  if (scorePercentage === 100 && totalQuestions > 0) {
    xpEarned += 50;
  }

  return {
    quizId: quiz.id,
    scorePercentage,
    totalQuestions,
    correctAnswersCount: correctCount,
    xpEarned,
    passed,
    completedAt,
    userAnswers,
  };
}

/**
 * Calculates current user mastery rank based on cumulative XP.
 */
export function getMasteryTier(xp: number): { tier: string; rank: number; nextTierAt: number; progress: number } {
  if (xp >= 7000) {
    return { tier: 'Principal Architect', rank: 5, nextTierAt: 10000, progress: Math.min(100, Math.round(((xp - 7000) / 3000) * 100)) };
  }
  if (xp >= 3500) {
    return { tier: 'Systems Specialist', rank: 4, nextTierAt: 7000, progress: Math.round(((xp - 3500) / 3500) * 100) };
  }
  if (xp >= 1500) {
    return { tier: 'Senior Practitioner', rank: 3, nextTierAt: 3500, progress: Math.round(((xp - 1500) / 2000) * 100) };
  }
  if (xp >= 500) {
    return { tier: 'Core Engineer', rank: 2, nextTierAt: 1500, progress: Math.round(((xp - 500) / 1000) * 100) };
  }
  return { tier: 'Apprentice', rank: 1, nextTierAt: 500, progress: Math.round((xp / 500) * 100) };
}
