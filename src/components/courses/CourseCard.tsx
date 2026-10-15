import React from 'react';
import { Clock, Zap, BookOpen, CheckCircle2, ChevronRight, Code, Layers, Server } from 'lucide-react';
import type { Course } from '../../types/course';
import { useProgressStore } from '../../store/progressStore';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
  const { completedLessonIds, completedModuleIds } = useProgressStore();

  // Compute progress
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessonsInCourse = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => completedLessonIds.includes(l.id)).length,
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsInCourse / totalLessons) * 100) : 0;
  const isCompleted = progressPercent === 100;

  const renderIcon = () => {
    switch (course.iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#6366F1]" />;
      case 'Code':
        return <Code className="w-5 h-5 text-[#10B981]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#818CF8]" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#6366F1]" />;
    }
  };

  const difficultyColors = {
    Beginner: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
    Intermediate: 'text-[#818CF8] bg-[#6366F1]/10 border-[#6366F1]/20',
    Advanced: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
  };

  return (
    <div className="group rounded-2xl bg-[#161F30] border border-[#1E293B] hover:border-[#6366F1]/50 transition-all duration-200 flex flex-col overflow-hidden shadow-lg hover:shadow-[#6366F1]/5">
      {/* Top Banner */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center group-hover:scale-105 transition-transform">
                {renderIcon()}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8]">
                  {course.category}
                </span>
                <span
                  className={`ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full border ${difficultyColors[course.difficulty]}`}
                >
                  {course.difficulty}
                </span>
              </div>
            </div>

            {isCompleted && (
              <span className="flex items-center gap-1 text-xs font-mono font-medium text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-[#10B981]/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
              </span>
            )}
          </div>

          <h3 className="font-sans font-bold text-lg text-white group-hover:text-[#818CF8] transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
            {course.tagline}
          </p>
        </div>

        {/* Progress Bar & Metadata */}
        <div className="mt-6 pt-4 border-t border-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-2">
            <span>Progress: {progressPercent}%</span>
            <span>
              {completedLessonsInCourse}/{totalLessons} Lessons
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#10B981] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mt-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{course.estimatedHours}h
            </span>
            <span className="flex items-center gap-1 text-[#818CF8]">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" /> +{course.xpReward} XP
            </span>
            <span>{course.modules.length} Modules</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-3.5 bg-[#0B0F19]/60 border-t border-[#1E293B] flex items-center justify-between">
        <span className="text-xs font-medium text-[#94A3B8]">
          {course.modules.filter((m) => completedModuleIds.includes(m.id)).length} of {course.modules.length} Quizzes Passed
        </span>
        <button
          type="button"
          onClick={() => onSelectCourse(course)}
          className="flex items-center gap-1 text-xs font-semibold text-[#818CF8] group-hover:text-white transition-colors"
        >
          {progressPercent > 0 ? 'Continue Track' : 'Start Track'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
