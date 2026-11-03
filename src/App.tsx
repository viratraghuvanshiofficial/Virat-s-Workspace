import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProfessorsView } from './components/ProfessorsView';
import { DuelGameView } from './components/DuelGameView';
import { LeaderboardView } from './components/LeaderboardView';
import { MeetView } from './components/MeetView';
import { ChatView } from './components/ChatView';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 pb-12">
        {currentView === 'professors' && <ProfessorsView />}
        {currentView === 'game' && <DuelGameView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'meet' && <MeetView />}
        {currentView === 'chat' && <ChatView />}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">true</span>
            <span aria-hidden="true">·</span>
            <span>Transparent Student Feedback, Meets & Educator Gamification</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Verified Student Reviews</span>
            <span aria-hidden="true">·</span>
            <span>Pairwise Duel Scoring</span>
            <span aria-hidden="true">·</span>
            <span>Virtual Office Hours</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
