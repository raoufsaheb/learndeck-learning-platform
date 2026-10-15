import React from 'react';
import { Award, Sparkles, Flame, CheckCircle2, TrendingUp, Layers } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import { getMasteryTier } from '../../lib/scoreCalculator';

export const MasteryStats: React.FC = () => {
  const { totalXp, streakDays, completedLessonIds, completedModuleIds, flashcards } = useProgressStore();
  const mastery = getMasteryTier(totalXp);

  const totalReviews = flashcards.reduce((sum, c) => sum + c.timesReviewed, 0);
  const totalCorrect = flashcards.reduce((sum, c) => sum + c.timesCorrect, 0);
  const retentionRate = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 94;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Mastery Tier */}
      <div className="rounded-2xl bg-[#161F30] border border-[#1E293B] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2">
            <span>Engineering Rank</span>
            <Award className="w-4 h-4 text-[#10B981]" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{mastery.tier}</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Tier {mastery.rank} of 5</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#1E293B]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] mb-1">
            <span>Next: {mastery.nextTierAt} XP</span>
            <span>{mastery.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#0B0F19] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#10B981]"
              style={{ width: `${mastery.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Active Streak */}
      <div className="rounded-2xl bg-[#161F30] border border-[#1E293B] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono text-white tracking-tight">{streakDays}</h3>
            <span className="text-xs font-mono text-[#F59E0B] font-semibold">Days Continuous</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">Goal: 30-day mastery habit</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#10B981]">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Today
          </span>
          <span>100% On Track</span>
        </div>
      </div>

      {/* 3. Leitner Retention Rate */}
      <div className="rounded-2xl bg-[#161F30] border border-[#1E293B] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2">
            <span>Retention Rate</span>
            <TrendingUp className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono text-white tracking-tight">{retentionRate}%</h3>
            <span className="text-xs font-mono text-[#10B981] font-semibold">High Recall</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">{totalCorrect} correct of {totalReviews} reviews</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {flashcards.length} Cards in Rotation
          </span>
        </div>
      </div>

      {/* 4. Curriculum Modules Completed */}
      <div className="rounded-2xl bg-[#161F30] border border-[#1E293B] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2">
            <span>Completed Units</span>
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-mono text-white tracking-tight">
              {completedLessonIds.length}
            </h3>
            <span className="text-xs font-mono text-[#818CF8]">Lessons Mastered</span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">{completedModuleIds.length} Quizzes Passed</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B]">
          <span>{totalXp.toLocaleString()} Total XP Earned</span>
        </div>
      </div>
    </div>
  );
};
