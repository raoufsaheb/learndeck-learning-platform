import { describe, it, expect } from 'vitest';
import { isAnswerCorrect, evaluateQuiz, getMasteryTier } from '../src/lib/scoreCalculator';
import type { Quiz, QuizQuestion } from '../src/types/quiz';

const sampleSingleQuestion: QuizQuestion = {
  id: 'q-1',
  type: 'single-choice',
  prompt: 'What is 2+2?',
  options: [
    { id: 'opt-a', text: '3' },
    { id: 'opt-b', text: '4' },
  ],
  correctAnswerIds: ['opt-b'],
  explanation: 'Basic math.',
  xpValue: 40,
};

const sampleMultiQuestion: QuizQuestion = {
  id: 'q-2',
  type: 'multi-choice',
  prompt: 'Select even numbers:',
  options: [
    { id: 'opt-1', text: '2' },
    { id: 'opt-2', text: '4' },
    { id: 'opt-3', text: '5' },
  ],
  correctAnswerIds: ['opt-1', 'opt-2'],
  explanation: '2 and 4 are even.',
  xpValue: 50,
};

const sampleQuiz: Quiz = {
  id: 'quiz-test',
  moduleId: 'mod-test',
  courseId: 'course-test',
  title: 'Test Assessment',
  description: 'Testing quiz evaluation.',
  passingScorePercentage: 70,
  questions: [sampleSingleQuestion, sampleMultiQuestion],
};

describe('Quiz & Assessment Evaluator', () => {
  it('evaluates single-choice question correctly', () => {
    expect(isAnswerCorrect(sampleSingleQuestion, ['opt-b'])).toBe(true);
    expect(isAnswerCorrect(sampleSingleQuestion, ['opt-a'])).toBe(false);
    expect(isAnswerCorrect(sampleSingleQuestion, [])).toBe(false);
  });

  it('evaluates multi-choice question regardless of selection order', () => {
    expect(isAnswerCorrect(sampleMultiQuestion, ['opt-1', 'opt-2'])).toBe(true);
    expect(isAnswerCorrect(sampleMultiQuestion, ['opt-2', 'opt-1'])).toBe(true);
    expect(isAnswerCorrect(sampleMultiQuestion, ['opt-1'])).toBe(false); // incomplete
    expect(isAnswerCorrect(sampleMultiQuestion, ['opt-1', 'opt-2', 'opt-3'])).toBe(false); // extra wrong answer
  });

  it('evaluates complete quiz with passing score and perfect score bonus', () => {
    const userAnswers = {
      'q-1': ['opt-b'],
      'q-2': ['opt-1', 'opt-2'],
    };

    const result = evaluateQuiz(sampleQuiz, userAnswers);

    expect(result.scorePercentage).toBe(100);
    expect(result.correctAnswersCount).toBe(2);
    expect(result.totalQuestions).toBe(2);
    expect(result.passed).toBe(true);
    // 40 + 50 + 50 (bonus) = 140 XP
    expect(result.xpEarned).toBe(140);
  });

  it('evaluates partial quiz with failing score', () => {
    const userAnswers = {
      'q-1': ['opt-b'], // correct (40 XP)
      'q-2': ['opt-1'], // wrong (missing opt-2)
    };

    const result = evaluateQuiz(sampleQuiz, userAnswers);

    expect(result.scorePercentage).toBe(50);
    expect(result.correctAnswersCount).toBe(1);
    expect(result.passed).toBe(false); // 50% < 70% threshold
    expect(result.xpEarned).toBe(40); // no 100% bonus
  });

  it('computes correct mastery tiers from XP points', () => {
    expect(getMasteryTier(200).tier).toBe('Apprentice');
    expect(getMasteryTier(750).tier).toBe('Core Engineer');
    expect(getMasteryTier(2000).tier).toBe('Senior Practitioner');
    expect(getMasteryTier(4500).tier).toBe('Systems Specialist');
    expect(getMasteryTier(8500).tier).toBe('Principal Architect');
  });
});
