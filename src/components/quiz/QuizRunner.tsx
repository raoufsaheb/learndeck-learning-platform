import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { useProgressStore } from '../../store/progressStore';
import { QuestionCard } from './QuestionCard';
import { QuizSummaryModal } from './QuizSummaryModal';
import { SEED_QUIZZES } from '../../data/seedCourses';

interface QuizRunnerProps {
  quizId: string;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quizId, onExit }) => {
  const {
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    quizResult,
    startQuiz,
    selectOption,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    exitQuiz,
  } = useQuizStore();

  const { recordQuizResult } = useProgressStore();

  useEffect(() => {
    const quiz = SEED_QUIZZES[quizId];
    if (quiz) {
      startQuiz(quiz);
    }
  }, [quizId, startQuiz]);

  if (!activeQuiz) {
    return (
      <div className="py-20 text-center text-[#94A3B8]">
        <p>Loading assessment...</p>
      </div>
    );
  }

  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const selectedForCurrent = userAnswers[currentQuestion.id] || [];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100);
  const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;

  const handleSubmit = () => {
    const result = submitQuiz();
    if (result) {
      recordQuizResult(result, activeQuiz.moduleId, activeQuiz.courseId);
    }
  };

  const handleRetake = () => {
    startQuiz(activeQuiz);
  };

  const handleExit = () => {
    exitQuiz();
    onExit();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#818CF8]">
            Module Assessment
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{activeQuiz.title}</h2>
        </div>
        <button
          type="button"
          onClick={handleExit}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#161F30] border border-transparent hover:border-[#1E293B] transition-colors"
          title="Exit Quiz"
          aria-label="Exit Quiz"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar & Question Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span>
            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
          </span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="h-1.5 w-full bg-[#161F30] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card Surface */}
      <div className="rounded-3xl bg-[#161F30] border border-[#1E293B] p-6 sm:p-8 shadow-xl">
        <QuestionCard
          question={currentQuestion}
          selectedOptionIds={selectedForCurrent}
          onSelectOption={(optId) =>
            selectOption(currentQuestion.id, optId, currentQuestion.type === 'multi-choice')
          }
          isSubmitted={isSubmitted}
        />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E293B] bg-[#161F30] text-xs font-mono font-medium text-[#94A3B8] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-3">
          {isLastQuestion ? (
            !isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white font-mono text-xs font-semibold shadow-lg shadow-[#10B981]/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Assessment
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs font-semibold shadow-lg transition-all"
              >
                Complete & Finish
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={nextQuestion}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-mono font-semibold transition-all shadow-md shadow-[#6366F1]/20"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Completion Summary Modal */}
      {isSubmitted && quizResult && (
        <QuizSummaryModal
          result={quizResult}
          onRetake={handleRetake}
          onExit={handleExit}
        />
      )}
    </div>
  );
};
