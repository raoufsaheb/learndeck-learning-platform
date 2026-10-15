export type QuestionType = 'single-choice' | 'multi-choice' | 'code-output';

export interface QuestionOption {
  id: string;
  text: string;
  codeSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options: QuestionOption[];
  correctAnswerIds: string[]; // for single choice: 1 item, multi choice: >=1
  explanation: string;
  xpValue: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  passingScorePercentage: number;
  timeLimitSeconds?: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  scorePercentage: number;
  totalQuestions: number;
  correctAnswersCount: number;
  xpEarned: number;
  passed: boolean;
  completedAt: string;
  userAnswers: Record<string, string[]>; // questionId -> selectedOptionIds
}
