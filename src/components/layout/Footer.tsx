import React from 'react';
import { BookOpen, Sparkles, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0B0F19] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-sans font-bold text-white text-sm">LearnDeck</span>
              <p className="text-xs text-[#64748B] mt-0.5">
                Technical Mastery & Leitner Spaced Repetition for Software Engineers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#161F30] border border-[#1E293B]">
              <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" /> React 19 + TS 5.8
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#161F30] border border-[#1E293B]">
              <Terminal className="w-3.5 h-3.5 text-[#10B981]" /> Leitner 5-Box Engine
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#161F30] border border-[#1E293B]">
              Zero Telemetry / Local Storage
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
