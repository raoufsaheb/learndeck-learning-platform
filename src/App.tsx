import { useState } from 'react';
import { Header, type ActiveTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CourseCatalog } from './components/courses/CourseCatalog';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { MasteryStats } from './components/analytics/MasteryStats';
import { StreakTracker } from './components/analytics/StreakTracker';
import { RetentionChart } from './components/analytics/RetentionChart';
import { QuizRunner } from './components/quiz/QuizRunner';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
  };

  const handleExitQuiz = () => {
    setActiveQuizId(null);
  };

  return (
    <div className="min-h-dvh bg-[#0B0F19] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#6366F1] selection:text-white">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveQuizId(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeQuizId ? (
          <QuizRunner
            quizId={activeQuizId}
            onExit={handleExitQuiz}
          />
        ) : (
          <>
            {activeTab === 'courses' && (
              <CourseCatalog onStartQuiz={handleStartQuiz} />
            )}

            {activeTab === 'flashcards' && (
              <FlashcardDeck />
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Engineering Mastery & Retention Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
                    Track your daily study streaks, cumulative XP levels, and Leitner 5-box spaced repetition retention trends.
                  </p>
                </div>

                <MasteryStats />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <StreakTracker />
                  <RetentionChart />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
export default App;
