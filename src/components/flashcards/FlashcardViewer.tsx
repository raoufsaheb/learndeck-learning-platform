import React, { useState, useEffect, useCallback } from 'react';
import { RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import type { Flashcard, ReviewConfidence } from '../../types/flashcard';
import { useProgressStore } from '../../store/progressStore';

interface FlashcardViewerProps {
  cards: Flashcard[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { reviewCard } = useProgressStore();

  const currentCard: Flashcard | undefined = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleReview = useCallback(
    (confidence: ReviewConfidence) => {
      if (!currentCard) return;
      reviewCard(currentCard.id, confidence);
      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setCurrentIndex(0); // loop back
      }
    },
    [currentCard, currentIndex, cards.length, reviewCard]
  );

  // Global Keyboard shortcuts (<kbd>Space</kbd> / <kbd>Enter</kbd> to flip, 1-4 for ratings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is on an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleReview('again');
        } else if (e.key === '2') {
          e.preventDefault();
          handleReview('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleReview('good');
        } else if (e.key === '4') {
          e.preventDefault();
          handleReview('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleReview, isFlipped]);

  if (!currentCard) {
    return (
      <div className="rounded-3xl bg-[#161F30] border border-[#1E293B] p-12 text-center text-[#94A3B8]">
        <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">All Cards Reviewed!</h3>
        <p className="text-xs text-[#94A3B8] mt-1">
          No cards matching the selected filter currently require attention.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deck Progress Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
        <span>
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((i) => Math.max(0, i - 1));
            }}
            disabled={currentIndex === 0}
            className="p-1 rounded bg-[#161F30] border border-[#1E293B] disabled:opacity-30 hover:text-white"
            aria-label="Previous flashcard"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex((i) => Math.min(cards.length - 1, i + 1));
            }}
            disabled={currentIndex === cards.length - 1}
            className="p-1 rounded bg-[#161F30] border border-[#1E293B] disabled:opacity-30 hover:text-white"
            aria-label="Next flashcard"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="perspective-1000 w-full min-h-[380px] sm:min-h-[420px] cursor-pointer"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Interactive Flashcard. Press space to flip."
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div
          className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#161F30] border border-[#334155] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/30">
                  {currentCard.category}
                </span>
                <span className="text-xs font-mono text-[#F59E0B]">
                  Box {currentCard.box} / 5
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-sans font-bold text-white tracking-tight leading-snug mt-2">
                {currentCard.front.prompt}
              </h3>

              {currentCard.front.codeSnippet && (
                <div className="mt-4 rounded-xl border border-[#334155] bg-[#0B0F19] overflow-hidden">
                  <pre className="p-3 text-xs font-mono text-[#E2E8F0] overflow-x-auto">
                    <code>{currentCard.front.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span className="flex items-center gap-1.5 text-[#818CF8]">
                <RotateCw className="w-3.5 h-3.5" /> Tap card or press Space to flip
              </span>
              <span>Reviewed: {currentCard.timesReviewed}x</span>
            </div>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-[#0F172A] border border-[#6366F1]/50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
                  Verified Architectural Solution
                </span>
                <span className="text-xs font-mono text-[#818CF8]">
                  Box {currentCard.box}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight mt-1 text-[#10B981]">
                {currentCard.back.solution}
              </h4>

              <p className="text-xs sm:text-sm text-[#CBD5E1] mt-3 leading-relaxed">
                {currentCard.back.explanation}
              </p>

              <div className="mt-4 p-3.5 rounded-xl bg-[#161F30] border border-[#1E293B]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#818CF8] block mb-1 font-semibold">
                  Key Takeaway:
                </span>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {currentCard.back.keyTakeaway}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>Accuracy: {currentCard.timesReviewed > 0 ? Math.round((currentCard.timesCorrect / currentCard.timesReviewed) * 100) : 100}%</span>
              <span className="text-[#818CF8]">Choose difficulty below (1-4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leitner Confidence Rating Bar (Enabled when card is flipped) */}
      <div className="p-4 rounded-2xl bg-[#161F30] border border-[#1E293B] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#F59E0B]" /> Rate Your Recall Confidence:
          </span>
          <span className="hidden sm:inline text-[#64748B]">Hotkeys: <kbd className="px-1.5 py-0.5 bg-[#0B0F19] rounded text-[10px]">1</kbd> <kbd className="px-1.5 py-0.5 bg-[#0B0F19] rounded text-[10px]">2</kbd> <kbd className="px-1.5 py-0.5 bg-[#0B0F19] rounded text-[10px]">3</kbd> <kbd className="px-1.5 py-0.5 bg-[#0B0F19] rounded text-[10px]">4</kbd></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            disabled={!isFlipped}
            onClick={(e) => {
              e.stopPropagation();
              handleReview('again');
            }}
            className="px-3 py-2.5 rounded-xl bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-bold">1 · Again</div>
            <div className="text-[10px] text-[#F43F5E]/70 mt-0.5">Box 1 (+5 XP)</div>
          </button>

          <button
            type="button"
            disabled={!isFlipped}
            onClick={(e) => {
              e.stopPropagation();
              handleReview('hard');
            }}
            className="px-3 py-2.5 rounded-xl bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-bold">2 · Hard</div>
            <div className="text-[10px] text-[#F59E0B]/70 mt-0.5">Keep Box (+10 XP)</div>
          </button>

          <button
            type="button"
            disabled={!isFlipped}
            onClick={(e) => {
              e.stopPropagation();
              handleReview('good');
            }}
            className="px-3 py-2.5 rounded-xl bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#818CF8] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-bold">3 · Good</div>
            <div className="text-[10px] text-[#818CF8]/70 mt-0.5">Box +1 (+15 XP)</div>
          </button>

          <button
            type="button"
            disabled={!isFlipped}
            onClick={(e) => {
              e.stopPropagation();
              handleReview('easy');
            }}
            className="px-3 py-2.5 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-bold">4 · Easy</div>
            <div className="text-[10px] text-[#10B981]/70 mt-0.5">Box +1 (+20 XP)</div>
          </button>
        </div>
      </div>
    </div>
  );
};
