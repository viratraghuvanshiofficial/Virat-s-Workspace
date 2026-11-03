import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Medal,
  Swords,
  Star,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Professor } from '../types';
import { ProfessorDetailModal } from './ProfessorDetailModal';

export const LeaderboardView: React.FC = () => {
  const { professors, setCurrentView } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedProf, setSelectedProf] = useState<Professor | null>(null);

  const departments = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Literature & Humanities', 'Bioengineering', 'Economics'];

  const filteredProfessors = [...professors]
    .filter((p) => selectedDept === 'All' || p.department === selectedDept)
    .sort((a, b) => b.eloScore - a.eloScore);

  const topThree = filteredProfessors.slice(0, 3);
  const remainingRanks = filteredProfessors.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>The Hall of Inspiring Educators</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Most Effective Educators Leaderboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked continuously through thousands of head-to-head student comparison duels and verified feedback.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('game')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Vote in Comparison Duels</span>
        </button>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedDept === dept
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Podium for Top 3 */}
      {topThree.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
          {/* Rank #2 */}
          {topThree[1] && (
            <div
              onClick={() => setSelectedProf(topThree[1])}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col items-center text-center relative order-2 md:order-1 md:h-72 justify-between"
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center absolute -top-3.5 shadow-xs">
                #2
              </div>
              <div className="flex flex-col items-center mt-2">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topThree[1].avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm mb-3`}
                >
                  {topThree[1].avatarInitials}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {topThree[1].name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {topThree[1].institution} · {topThree[1].department}
                </p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">True Elo</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {topThree[1].eloScore} pts
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Rating</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {topThree[1].overallRating} ★
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rank #1 Centerpiece */}
          {topThree[0] && (
            <div
              onClick={() => setSelectedProf(topThree[0])}
              className="group cursor-pointer bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-slate-900 dark:to-slate-900 rounded-2xl border-2 border-amber-400 dark:border-amber-500/60 p-6 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center relative order-1 md:order-2 md:h-80 justify-between"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center absolute -top-4.5 shadow-md">
                👑
              </div>
              <div className="flex flex-col items-center mt-2">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topThree[0].avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md mb-3`}
                >
                  {topThree[0].avatarInitials}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Master Pedagogue · Rank #1
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {topThree[0].name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {topThree[0].institution} · {topThree[0].department}
                </p>
              </div>

              <div className="w-full pt-3 border-t border-amber-100 dark:border-slate-800 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">True Elo</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm tabular-nums">
                    {topThree[0].eloScore} pts
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Win Rate</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {Math.round(
                      (topThree[0].duelWins / (topThree[0].duelWins + topThree[0].duelLosses)) * 100
                    )}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Rating</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {topThree[0].overallRating} ★
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rank #3 */}
          {topThree[2] && (
            <div
              onClick={() => setSelectedProf(topThree[2])}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col items-center text-center relative order-3 md:order-3 md:h-68 justify-between"
            >
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center absolute -top-3.5 shadow-xs">
                #3
              </div>
              <div className="flex flex-col items-center mt-2">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topThree[2].avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm mb-3`}
                >
                  {topThree[2].avatarInitials}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {topThree[2].name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {topThree[2].institution} · {topThree[2].department}
                </p>
              </div>

              <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">True Elo</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {topThree[2].eloScore} pts
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Rating</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {topThree[2].overallRating} ★
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Global Pedagogy Standings ({filteredProfessors.length} Educators)
          </h3>
          <span className="text-xs text-slate-400">
            Updated in real-time with student votes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Educator</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5 text-right">True Duel Points</th>
                <th className="px-6 py-3.5 text-right">Record (W-L)</th>
                <th className="px-6 py-3.5 text-right">Win Rate</th>
                <th className="px-6 py-3.5 text-right">Student Rating</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProfessors.map((prof, idx) => {
                const totalDuels = prof.duelWins + prof.duelLosses;
                const winRate =
                  totalDuels > 0 ? Math.round((prof.duelWins / totalDuels) * 100) : 0;

                return (
                  <tr
                    key={prof.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${prof.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                        >
                          {prof.avatarInitials}
                        </div>
                        <div>
                          <div
                            onClick={() => setSelectedProf(prof)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                          >
                            {prof.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {prof.institution}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {prof.department}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {prof.eloScore}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                      {prof.duelWins}W - {prof.duelLosses}L
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {winRate}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{prof.overallRating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({prof.totalReviews})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedProf(prof)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProf && (
        <ProfessorDetailModal
          professor={selectedProf}
          onClose={() => setSelectedProf(null)}
        />
      )}
    </div>
  );
};
