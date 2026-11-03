import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Swords,
  Video,
  MessageSquare,
  Trophy,
  Moon,
  Sun,
  UserCheck,
  Plus,
} from 'lucide-react';
import { AddProfessorModal } from './AddProfessorModal';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    professors,
    actingProfessorId,
    setActingProfessorId,
    darkMode,
    toggleDarkMode,
  } = useApp();

  const [isAddProfOpen, setIsAddProfOpen] = useState(false);

  const actingProf = professors.find((p) => p.id === actingProfessorId);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('professors')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  true
                </span>
                <span className="text-[10px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-0.5">
                  Educator Truth
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setCurrentView('professors')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors ${
                currentView === 'professors'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[2px]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Professors</span>
            </button>

            <button
              onClick={() => setCurrentView('game')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors ${
                currentView === 'game'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[2px]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Choose This or That</span>
            </button>

            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors ${
                currentView === 'leaderboard'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[2px]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setCurrentView('meet')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors ${
                currentView === 'meet'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[2px]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Live Meet</span>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className={`flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0 transition-colors ${
                currentView === 'chat'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[2px]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chats & Circles</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action / controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Role switch toggle */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setUserRole('student')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  userRole === 'student'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => setUserRole('professor')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  userRole === 'professor'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Switch to Professor Mode to reply to feedback, host meets, and post updates"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Educator Mode</span>
              </button>
            </div>

            {userRole === 'professor' && (
              <select
                value={actingProfessorId}
                onChange={(e) => setActingProfessorId(e.target.value)}
                className="hidden xl:block text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                {professors
                  .filter((p) => p.isClaimed)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      Acting as: {p.name}
                    </option>
                  ))}
              </select>
            )}

            {/* Dark mode button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsAddProfOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Educator</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-2 text-xs">
          <button
            onClick={() => setCurrentView('professors')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              currentView === 'professors' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setCurrentView('game')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              currentView === 'game' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Duels</span>
          </button>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              currentView === 'leaderboard' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Ranks</span>
          </button>
          <button
            onClick={() => setCurrentView('meet')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              currentView === 'meet' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Meet</span>
          </button>
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
              currentView === 'chat' ? 'text-indigo-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
        </div>
      </header>

      {/* Modal for adding a new teacher profile */}
      {isAddProfOpen && <AddProfessorModal onClose={() => setIsAddProfOpen(false)} />}
    </>
  );
};
