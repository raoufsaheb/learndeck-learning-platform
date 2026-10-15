import React from 'react';
import { Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { useProgressStore } from '../../store/progressStore';

export const StreakTracker: React.FC = () => {
  const { dailyHistory } = useProgressStore();

  const maxDailyXp = Math.max(...dailyHistory.map((d) => d.xpEarned), 200);

  return (
    <div className="rounded-3xl bg-[#161F30] border border-[#1E293B] p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#818CF8]">
            Study Consistency
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
            7-Day Learning Activity
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 rounded-full">
          <Calendar className="w-3.5 h-3.5" /> Past Week
        </div>
      </div>

      {/* Bar Chart of Past 7 Days */}
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36 pt-4">
          {dailyHistory.map((item) => {
            const heightPercent = Math.max(15, Math.round((item.xpEarned / maxDailyXp) * 100));
            const dayLabel = new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={item.date} className="flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <span className="text-[10px] font-mono text-[#818CF8] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.xpEarned}XP
                </span>

                {/* Bar */}
                <div className="w-full bg-[#0B0F19] rounded-xl overflow-hidden p-0.5 h-28 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#6366F1] to-[#818CF8] rounded-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span className="text-[11px] font-mono text-[#94A3B8]">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Ledger Table */}
      <div className="pt-4 border-t border-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-[#64748B] font-mono uppercase border-b border-[#1E293B] text-[10px]">
                <th className="py-2">Date</th>
                <th className="py-2">Flashcards Reviewed</th>
                <th className="py-2">Quizzes Passed</th>
                <th className="py-2 text-right">XP Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/50 font-mono text-[#CBD5E1]">
              {dailyHistory.slice().reverse().map((row) => (
                <tr key={row.date} className="hover:bg-[#1E293B]/40 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-white">{row.date}</td>
                  <td className="py-2.5">{row.cardsReviewed} cards</td>
                  <td className="py-2.5">
                    {row.quizzesCompleted > 0 ? (
                      <span className="flex items-center gap-1 text-[#10B981]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {row.quizzesCompleted}
                      </span>
                    ) : (
                      <span className="text-[#64748B]">—</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right text-[#F59E0B] font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3 h-3" /> +{row.xpEarned} XP
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
