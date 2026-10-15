export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LessonTakeaway {
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  readingTimeMinutes: number;
  contentMarkdown: string;
  takeaways: LessonTakeaway[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quizId: string;
  estimatedMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: CourseDifficulty;
  category: string;
  iconName: string;
  estimatedHours: number;
  xpReward: number;
  modules: Module[];
}
