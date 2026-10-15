import React from 'react';
import { Check, CheckCircle2, XCircle } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionIds: string[];
  onSelectOption: (optionId: string) => void;
  isSubmitted: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIds,
  onSelectOption,
  isSubmitted,
}) => {
  const isMulti = question.type === 'multi-choice';

  const typeLabels = {
    'single-choice': 'Single Choice',
    'multi-choice': 'Multiple Selection (Choose all that apply)',
    'code-output': 'Code Output Prediction',
  };

  return (
    <div className="space-y-6">
      {/* Question Type & Prompt */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#1E293B] border border-[#334155] text-[#818CF8]">
            {typeLabels[question.type]}
          </span>
          <span className="text-xs font-mono text-[#F59E0B]">+{question.xpValue} XP</span>
        </div>
        <h3 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Code Snippet Block */}
      {question.codeSnippet && (
        <div className="rounded-xl border border-[#334155] bg-[#0B0F19] overflow-hidden">
          <div className="px-4 py-1.5 border-b border-[#1E293B] bg-[#161F30] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span className="uppercase">{question.codeSnippet.language}</span>
            <span>Input Code</span>
          </div>
          <pre className="p-4 text-xs font-mono text-[#E2E8F0] overflow-x-auto leading-relaxed">
            <code>{question.codeSnippet.code}</code>
          </pre>
        </div>
      )}

      {/* Selectable Options */}
      <div className="space-y-3" role="group" aria-label="Question options">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const isCorrect = question.correctAnswerIds.includes(option.id);

          let optionStyle = 'bg-[#161F30] border-[#1E293B] text-[#CBD5E1] hover:border-[#6366F1]/50';

          if (isSubmitted) {
            if (isCorrect) {
              optionStyle = 'bg-[#10B981]/10 border-[#10B981]/50 text-white font-medium';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'bg-[#F43F5E]/10 border-[#F43F5E]/50 text-white font-medium';
            } else {
              optionStyle = 'bg-[#161F30]/50 border-[#1E293B] text-[#64748B] opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'bg-[#6366F1]/15 border-[#6366F1] text-white font-medium';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelectOption(option.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] ${optionStyle}`}
            >
              <div
                className={`w-5 h-5 mt-0.5 rounded-${
                  isMulti ? 'md' : 'full'
                } border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? isSubmitted
                      ? isCorrect
                        ? 'bg-[#10B981] border-[#10B981] text-white'
                        : 'bg-[#F43F5E] border-[#F43F5E] text-white'
                      : 'bg-[#6366F1] border-[#6366F1] text-white'
                    : 'border-[#475569] bg-[#0B0F19]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1">
                <span className="text-xs font-mono text-[#64748B] mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-sm leading-relaxed">{option.text}</span>
              </div>

              {isSubmitted && (
                <div className="shrink-0">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-[#F43F5E]" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation when submitted */}
      {isSubmitted && (
        <div className="rounded-xl bg-[#0B0F19]/60 border border-[#1E293B] p-4 text-xs text-[#94A3B8] leading-relaxed">
          <span className="font-mono font-semibold text-[#818CF8] uppercase tracking-wider block mb-1">
            Explanation:
          </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
};
