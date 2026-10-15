import React from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import type { QuizResult } from '../../types/quiz';

interface QuizSummaryModalProps {
  result: QuizResult;
  onRetake: () => void;
  onExit: () => void;
}

export const QuizSummaryModal: React.FC<QuizSummaryModalProps> = ({ result, onRetake, onExit }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quiz Results Summary"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#161F30] border border-[#334155] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            result.passed ? 'bg-[#10B981]/20' : 'bg-[#F43F5E]/20'
          }`}
        />

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 border ${
            result.passed
              ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
              : 'bg-[#F43F5E]/10 border-[#F43F5E]/30 text-[#F43F5E]'
          }`}
        >
          {result.passed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        </div>

        <h2 className="text-2xl font-sans font-bold text-white tracking-tight">
          {result.passed ? 'Assessment Passed!' : 'Assessment Incomplete'}
        </h2>
        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
          {result.passed
            ? 'Great performance! You have demonstrated conceptual mastery over this module.'
            : 'You scored below the passing threshold. Review the material and try again.'}
        </p>

        {/* Score metrics */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="rounded-2xl bg-[#0B0F19] border border-[#1E293B] p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
              Final Score
            </span>
            <div className="text-3xl font-mono font-bold text-white mt-1">
              {result.scorePercentage}%
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {result.correctAnswersCount} / {result.totalQuestions} Correct
            </span>
          </div>

          <div className="rounded-2xl bg-[#0B0F19] border border-[#1E293B] p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
              XP Awarded
            </span>
            <div className="text-3xl font-mono font-bold text-[#F59E0B] mt-1">
              +{result.xpEarned}
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              {result.scorePercentage === 100 ? 'Includes 50 XP Bonus' : 'Standard Points'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onExit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#818CF8] hover:brightness-110 text-white font-mono text-xs font-semibold shadow-lg shadow-[#6366F1]/20 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Continue Learning <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onRetake}
            className="w-full py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[#CBD5E1] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
