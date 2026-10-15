import React from 'react';
import { X, CheckCircle2, Award, Clock, ArrowRight, HelpCircle } from 'lucide-react';
import type { Course, Module, Lesson } from '../../types/course';
import { useProgressStore } from '../../store/progressStore';
import { SEED_QUIZZES } from '../../data/seedCourses';

interface LessonViewerProps {
  course: Course;
  module: Module;
  lesson: Lesson;
  onClose: () => void;
  onStartQuiz: (quizId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  module,
  lesson,
  onClose,
  onStartQuiz,
}) => {
  const { completedLessonIds, completeLesson } = useProgressStore();
  const isCompleted = completedLessonIds.includes(lesson.id);
  const quiz = SEED_QUIZZES[module.quizId];

  const handleComplete = () => {
    completeLesson(lesson.id, module.id, course.id, 25);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lesson.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#161F30] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#1E293B] bg-[#0B0F19]/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono text-[#818CF8] uppercase tracking-wider">
                {course.title}
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] font-mono text-[#94A3B8]">{module.title}</span>
            </div>
            <h2 className="text-xl font-sans font-bold text-white tracking-tight">{lesson.title}</h2>
            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {lesson.readingTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1 text-[#10B981]">
                <Award className="w-3.5 h-3.5" /> +25 XP
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lesson viewer"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#CBD5E1] leading-relaxed">
          {/* Main Theory */}
          <div className="prose prose-invert max-w-none space-y-4">
            {lesson.contentMarkdown.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-bold text-white mt-4 first:mt-0">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return (
                <p key={idx} className="text-[#94A3B8] leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Code Snippet if present */}
          {lesson.codeSnippet && (
            <div className="rounded-xl border border-[#334155] bg-[#0B0F19] overflow-hidden">
              <div className="px-4 py-2 border-b border-[#1E293B] bg-[#161F30] flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span className="uppercase">{lesson.codeSnippet.language}</span>
                <span>Code Example</span>
              </div>
              <pre className="p-4 text-xs font-mono text-[#E2E8F0] overflow-x-auto leading-relaxed">
                <code>{lesson.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Key Takeaways */}
          {lesson.takeaways.length > 0 && (
            <div className="rounded-xl bg-[#0B0F19]/50 border border-[#1E293B] p-5">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#818CF8] mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#818CF8]" /> Architectural Takeaways
              </h4>
              <ul className="space-y-2.5">
                {lesson.takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                    <div>
                      <strong className="text-white font-medium">{takeaway.title}: </strong>
                      <span className="text-[#94A3B8]">{takeaway.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#1E293B] bg-[#0B0F19]/70 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleted}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              isCompleted
                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 cursor-default'
                : 'bg-[#1E293B] text-white hover:bg-[#334155] border border-[#334155]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Lesson Completed (+25 XP)' : 'Mark as Complete (+25 XP)'}
          </button>

          {quiz && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartQuiz(quiz.id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white text-xs font-mono font-semibold shadow-lg shadow-[#6366F1]/20 hover:brightness-110 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              Take Module Assessment
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
