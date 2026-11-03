import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Award,
  Video,
} from 'lucide-react';
import { ProfessorCard } from './ProfessorCard';
import { AddProfessorModal } from './AddProfessorModal';

export const ProfessorsView: React.FC = () => {
  const { professors, reviews, meets, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'elo' | 'reviews'>('rating');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const departments = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Literature & Humanities', 'Bioengineering', 'Economics'];

  const filteredProfessors = useMemo(() => {
    return professors
      .filter((prof) => {
        const matchesDept = selectedDept === 'All' || prof.department === selectedDept;
        const matchesQuery =
          searchQuery === '' ||
          prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.courses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
          prof.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesDept && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.overallRating - a.overallRating;
        if (sortBy === 'elo') return b.eloScore - a.eloScore;
        if (sortBy === 'reviews') return b.totalReviews - a.totalReviews;
        return 0;
      });
  }, [professors, selectedDept, searchQuery, sortBy]);

  const activeMeetsCount = meets.filter((m) => m.isLiveNow).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Editorial Hero Strip */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <span>Academic Truth & Educator Transparency</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            Real feedback from verified students. Where exceptional teaching gets recognized.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Browse genuine reviews, join live virtual office hours, chat directly with faculty, and play the comparison duel game to identify the most inspiring professors in academia.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Professor Profile</span>
            </button>
            <button
              onClick={() => setCurrentView('game')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Play "Choose This or That"</span>
            </button>
          </div>
        </div>

        {/* Quiet Numerical Metrics Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
              {professors.length}
            </div>
            <div className="text-xs text-slate-400">Educators Indexed</div>
          </div>
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
              {reviews.length}
            </div>
            <div className="text-xs text-slate-400">Verified Reviews</div>
          </div>
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-indigo-400 tabular-nums">
              {activeMeetsCount} Live
            </div>
            <div className="text-xs text-slate-400">Office Hour Meets</div>
          </div>
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">
              1,840+
            </div>
            <div className="text-xs text-slate-400">Comparison Duels</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by professor name, university, course (e.g. CS161, MIT), or teaching tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              <option value="rating">Sort: Highest True Rating</option>
              <option value="elo">Sort: Highest Duel Elo Score</option>
              <option value="reviews">Sort: Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Department Segmented Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Professor Grid */}
      {filteredProfessors.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <GraduationCap className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No educators found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or upload this professor to create their profile on true.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Professor Profile</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfessors.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} />
          ))}
        </div>
      )}

      {isAddModalOpen && <AddProfessorModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};
