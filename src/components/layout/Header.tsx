import React from 'react';
import { BookOpen, Flame, Sparkles, Award, RotateCcw } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import { getMasteryTier } from '../../lib/scoreCalculator';

export type ActiveTab = 'courses' | 'flashcards' | 'analytics';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { totalXp, streakDays, resetDemoData } = useProgressStore();
  const mastery = getMasteryTier(totalXp);

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-lg text-white tracking-tight flex items-center gap-2">
                LearnDeck
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/30">
                  v1.0
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161F30] p-1 rounded-xl border border-[#1E293B]" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => onTabChange('courses')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Curricula & Courses
            </button>
            <button
              type="button"
              onClick={() => onTabChange('flashcards')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'flashcards'
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Spaced Flashcards
            </button>
            <button
              type="button"
              onClick={() => onTabChange('analytics')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-[#6366F1] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Mastery & Streaks
            </button>
          </nav>

          {/* Gamification Stats Strip */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161F30] border border-[#1E293B] text-xs font-mono font-semibold text-[#F59E0B]"
              title={`${streakDays} days active learning streak`}
            >
              <Flame className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span>{streakDays}d</span>
            </div>

            {/* Total XP Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161F30] border border-[#1E293B] text-xs font-mono font-semibold text-[#818CF8]"
              title={`${totalXp} cumulative experience points`}
            >
              <Sparkles className="w-4 h-4 text-[#818CF8]" />
              <span>{totalXp.toLocaleString()} XP</span>
            </div>

            {/* Mastery Tier Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-medium text-[#10B981]">
              <Award className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{mastery.tier}</span>
            </div>

            {/* Reset Demo Data */}
            <button
              type="button"
              onClick={resetDemoData}
              title="Reset sample progress, streak, and flashcards"
              aria-label="Reset Demo Data"
              className="p-2 rounded-xl text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#161F30] border border-transparent hover:border-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex border-t border-[#1E293B] px-2 py-1 bg-[#161F30]">
        <button
          type="button"
          onClick={() => onTabChange('courses')}
          className={`flex-1 py-2 text-xs font-medium text-center rounded-lg ${
            activeTab === 'courses' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Courses
        </button>
        <button
          type="button"
          onClick={() => onTabChange('flashcards')}
          className={`flex-1 py-2 text-xs font-medium text-center rounded-lg ${
            activeTab === 'flashcards' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Flashcards
        </button>
        <button
          type="button"
          onClick={() => onTabChange('analytics')}
          className={`flex-1 py-2 text-xs font-medium text-center rounded-lg ${
            activeTab === 'analytics' ? 'bg-[#6366F1] text-white' : 'text-[#94A3B8]'
          }`}
        >
          Mastery
        </button>
      </div>
    </header>
  );
};
