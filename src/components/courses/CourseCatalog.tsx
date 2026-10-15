import React, { useState } from 'react';
import { Search, CheckCircle2, ChevronRight, HelpCircle, X, ArrowLeft } from 'lucide-react';
import { SEED_COURSES } from '../../data/seedCourses';
import type { Course, Module, Lesson } from '../../types/course';
import { CourseCard } from './CourseCard';
import { LessonViewer } from './LessonViewer';
import { useProgressStore } from '../../store/progressStore';

interface CourseCatalogProps {
  onStartQuiz: (quizId: string) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onStartQuiz }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<{ course: Course; module: Module; lesson: Lesson } | null>(null);

  const { completedLessonIds, completedModuleIds, quizResults } = useProgressStore();

  const categories = ['All', 'Architecture', 'Language', 'Framework', 'Systems'];

  const filteredCourses = SEED_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Learning Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#161F30] via-[#0B0F19] to-[#161F30] border border-[#1E293B] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#818CF8] bg-[#6366F1]/10 border border-[#6366F1]/30 px-3 py-1 rounded-full">
              Engineering Curricula
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight leading-tight">
            Advanced Software Engineering Tracks
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed">
            High-density technical masterclasses designed for senior frontend, full-stack, and distributed systems engineers. Learn deep underlying mechanics and verify mastery through code assessments.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, concepts, or algorithms..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F19] border border-[#334155] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#6366F1] text-white font-semibold shadow-sm'
                      : 'bg-[#161F30] text-[#94A3B8] hover:text-white border border-[#1E293B]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onSelectCourse={(c) => setSelectedCourse(c)}
          />
        ))}
      </div>

      {/* Selected Course Curriculum Modal */}
      {selectedCourse && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedCourse.title}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] bg-[#161F30] border border-[#334155] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#1E293B] bg-[#0B0F19]/60 flex items-start justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#818CF8] hover:text-white mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Tracks
                </button>
                <h2 className="text-xl font-bold text-white tracking-tight">{selectedCourse.title}</h2>
                <p className="text-xs text-[#94A3B8] mt-1">{selectedCourse.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close track syllabus"
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modules & Lessons List */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedCourse.modules.map((module, mIdx) => {
                const isModulePassed = completedModuleIds.includes(module.id);
                const quizBestResult = quizResults[module.quizId];

                return (
                  <div key={module.id} className="rounded-xl bg-[#0B0F19]/50 border border-[#1E293B] p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                          Module {mIdx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{module.title}</h4>
                        <p className="text-xs text-[#94A3B8] mt-1">{module.description}</p>
                      </div>

                      {isModulePassed ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 whitespace-nowrap">
                          Passed ({quizBestResult?.scorePercentage}%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 whitespace-nowrap">
                          {module.estimatedMinutes}m
                        </span>
                      )}
                    </div>

                    {/* Lessons */}
                    <div className="space-y-2 mt-4 pt-3 border-t border-[#1E293B]/70">
                      {module.lessons.map((lesson) => {
                        const isLessonDone = completedLessonIds.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLesson({ course: selectedCourse, module, lesson })}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#161F30] hover:bg-[#1E293B] border border-[#1E293B] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isLessonDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[#64748B]" />
                              )}
                              <span className="text-xs font-medium text-white">{lesson.title}</span>
                            </div>
                            <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                              {lesson.readingTimeMinutes}m <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quiz Launcher */}
                    <div className="mt-4 pt-3 border-t border-[#1E293B]/70 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCourse(null);
                          onStartQuiz(module.quizId);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366F1]/10 hover:bg-[#6366F1] text-[#818CF8] hover:text-white border border-[#6366F1]/30 hover:border-transparent text-xs font-mono font-medium transition-all"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isModulePassed ? 'Retake Module Quiz' : 'Launch Module Quiz'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Lesson Viewer Modal */}
      {activeLesson && (
        <LessonViewer
          course={activeLesson.course}
          module={activeLesson.module}
          lesson={activeLesson.lesson}
          onClose={() => setActiveLesson(null)}
          onStartQuiz={(quizId) => {
            setActiveLesson(null);
            setSelectedCourse(null);
            onStartQuiz(quizId);
          }}
        />
      )}
    </div>
  );
};
