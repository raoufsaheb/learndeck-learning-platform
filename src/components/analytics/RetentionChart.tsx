import React from 'react';
import { Brain, ShieldCheck } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';
import type { LeitnerBox } from '../../types/flashcard';
import { BOX_INTERVAL_DAYS } from '../../lib/leitnerEngine';

export const RetentionChart: React.FC = () => {
  const { flashcards } = useProgressStore();
  const boxes: LeitnerBox[] = [1, 2, 3, 4, 5];

  const totalCards = flashcards.length;

  return (
    <div className="rounded-3xl bg-[#161F30] border border-[#1E293B] p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981]">
            Cognitive Recall Curve
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Leitner 5-Box Distribution
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#818CF8] bg-[#6366F1]/10 border border-[#6366F1]/30 px-3 py-1 rounded-full">
          <Brain className="w-3.5 h-3.5" /> Spaced Schedule
        </div>
      </div>

      <p className="text-xs text-[#94A3B8] leading-relaxed">
        The Leitner box model leverages the spacing effect: review intervals double with each successive correct recall, flattening the Ebbinghaus forgetting curve.
      </p>

      {/* Distribution Bars */}
      <div className="space-y-4">
        {boxes.map((box) => {
          const count = flashcards.filter((c) => c.box === box).length;
          const percent = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;

          const boxColors: Record<LeitnerBox, { bar: string; badge: string }> = {
            1: { bar: 'bg-[#F43F5E]', badge: 'text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20' },
            2: { bar: 'bg-[#F59E0B]', badge: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' },
            3: { bar: 'bg-[#6366F1]', badge: 'text-[#818CF8] bg-[#6366F1]/10 border-[#6366F1]/20' },
            4: { bar: 'bg-[#818CF8]', badge: 'text-[#818CF8] bg-[#818CF8]/10 border-[#818CF8]/20' },
            5: { bar: 'bg-[#10B981]', badge: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' },
          };

          return (
            <div key={box} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Box {box}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${boxColors[box].badge}`}>
                    {box === 5 ? 'Mastered (30d)' : `Interval: +${BOX_INTERVAL_DAYS[box]}d`}
                  </span>
                </div>
                <span className="text-[#CBD5E1]">
                  {count} cards ({percent}%)
                </span>
              </div>

              <div className="h-2 w-full bg-[#0B0F19] rounded-full overflow-hidden">
                <div
                  className={`h-full ${boxColors[box].bar} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Zero Server Sync (Client-Side Isolation)
        </span>
        <span>Deterministic Leitner State</span>
      </div>
    </div>
  );
};
