import React, { useState } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { LeitnerBoxOverview } from './LeitnerBoxOverview';
import { FlashcardViewer } from './FlashcardViewer';
import type { LeitnerBox } from '../../types/flashcard';
import { isCardDue } from '../../lib/leitnerEngine';
import { Sparkles, Brain } from 'lucide-react';

export const FlashcardDeck: React.FC = () => {
  const { flashcards } = useProgressStore();
  const [selectedFilter, setSelectedFilter] = useState<LeitnerBox | 'all' | 'due'>('all');

  const filteredCards = flashcards.filter((card) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'due') return isCardDue(card);
    return card.box === selectedFilter;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="rounded-3xl bg-[#161F30] border border-[#1E293B] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> Spaced Repetition Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Leitner 5-Box Spaced Flashcards
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed max-w-2xl">
            Cards migrate into wider review intervals (1d, 3d, 7d, 14d, 30d) as your recall solidifies.
            Failing a card immediately demotes it to Box 1 for rapid re-acquisition.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-xs font-mono text-[#818CF8]">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>Active Deck: {flashcards.length} Cards</span>
        </div>
      </div>

      {/* Leitner Box Overview Bar */}
      <LeitnerBoxOverview
        flashcards={flashcards}
        selectedBoxFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* Active Card Viewer */}
      <FlashcardViewer cards={filteredCards} />
    </div>
  );
};
