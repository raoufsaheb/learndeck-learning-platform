import React from 'react';
import type { Flashcard, LeitnerBox } from '../../types/flashcard';
import { BOX_INTERVAL_DAYS, isCardDue } from '../../lib/leitnerEngine';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

interface LeitnerBoxOverviewProps {
  flashcards: Flashcard[];
  selectedBoxFilter: LeitnerBox | 'all' | 'due';
  onSelectFilter: (filter: LeitnerBox | 'all' | 'due') => void;
}

export const LeitnerBoxOverview: React.FC<LeitnerBoxOverviewProps> = ({
  flashcards,
  selectedBoxFilter,
  onSelectFilter,
}) => {
  const boxes: LeitnerBox[] = [1, 2, 3, 4, 5];
  const dueCount = flashcards.filter((c) => isCardDue(c)).length;

  const boxLabels: Record<LeitnerBox, string> = {
    1: 'Daily Review',
    2: '3-Day Interval',
    3: 'Weekly',
    4: 'Bi-Weekly',
    5: 'Mastered',
  };

  return (
    <div className="space-y-4">
      {/* Top filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedBoxFilter === 'all'}
          onClick={() => onSelectFilter('all')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            selectedBoxFilter === 'all'
              ? 'bg-[#6366F1] text-white font-semibold'
              : 'bg-[#161F30] text-[#94A3B8] hover:text-white border border-[#1E293B]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> All Cards ({flashcards.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selectedBoxFilter === 'due'}
          onClick={() => onSelectFilter('due')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
            selectedBoxFilter === 'due'
              ? 'bg-[#F59E0B] text-black font-bold'
              : 'bg-[#161F30] text-[#F59E0B] hover:bg-[#F59E0B]/10 border border-[#F59E0B]/30'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Due Today ({dueCount})
        </button>
      </div>

      {/* 5 Leitner Boxes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {boxes.map((b) => {
          const cardsInBox = flashcards.filter((c) => c.box === b);
          const isSelected = selectedBoxFilter === b;

          return (
            <button
              key={b}
              type="button"
              onClick={() => onSelectFilter(b)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#6366F1]/15 border-[#6366F1] shadow-md shadow-[#6366F1]/10'
                  : 'bg-[#161F30] border-[#1E293B] hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] mb-1">
                <span>Box {b}</span>
                <span>+{BOX_INTERVAL_DAYS[b]}d</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-mono font-bold text-white">
                  {cardsInBox.length}
                </span>
                {b === 5 && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
              </div>
              <span className="text-[10px] text-[#94A3B8] block mt-0.5 truncate">
                {boxLabels[b]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
