import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Swords,
  Flame,
  Star,
  Trophy,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Professor, DuelScenario } from '../types';

export const DuelGameView: React.FC = () => {
  const {
    professors,
    scenarios,
    voteDuel,
    userStats,
    setCurrentView,
  } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [profA, setProfA] = useState<Professor | null>(null);
  const [profB, setProfB] = useState<Professor | null>(null);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [duelVotedCount, setDuelVotedCount] = useState(0);
  const [showResultAnimation, setShowResultAnimation] = useState(false);

  const departments = ['All', 'Computer Science', 'Physics', 'Mathematics', 'Literature & Humanities'];

  // Pick two random distinct professors based on department filter
  const pickNewDuel = (dept: string = selectedDept) => {
    setSelectedWinnerId(null);
    setShowResultAnimation(false);

    const eligible =
      dept === 'All'
        ? professors
        : professors.filter((p) => p.department === dept);

    if (eligible.length < 2) {
      // Fallback to all if fewer than 2 in department
      const allShuffled = [...professors].sort(() => 0.5 - Math.random());
      setProfA(allShuffled[0] || null);
      setProfB(allShuffled[1] || null);
    } else {
      const shuffled = [...eligible].sort(() => 0.5 - Math.random());
      setProfA(shuffled[0]);
      setProfB(shuffled[1]);
    }

    // Advance scenario
    setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  useEffect(() => {
    pickNewDuel(selectedDept);
  }, [selectedDept]);

  const handleVote = (winner: Professor, loser: Professor) => {
    if (selectedWinnerId) return; // already voted on this round

    setSelectedWinnerId(winner.id);
    setShowResultAnimation(true);
    setDuelVotedCount((prev) => prev + 1);

    const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
    voteDuel(winner.id, loser.id, currentScenario.id);
  };

  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];

  // Calculate simulated vote split for dramatic reveal
  const getSimulatedVoteShare = (prof: Professor, other: Professor) => {
    const scoreA = prof.eloScore;
    const scoreB = other.eloScore;
    const ratio = Math.round((scoreA / (scoreA + scoreB)) * 100);
    return Math.max(25, Math.min(85, ratio));
  };

  // Top 5 educators for the live mini-sidebar
  const topEducators = [...professors]
    .sort((a, b) => b.eloScore - a.eloScore)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4" />
            <span>The Educator Duel · Would You Choose This or That?</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Head-to-Head Comparison Game
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare educators on real academic scenarios. Each vote awards True Points and shapes the Global Educator Leaderboard.
          </p>
        </div>

        {/* Voter Streak & Score Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold text-amber-800 dark:text-amber-200">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Streak: {userStats.streak} 🔥</span>
          </div>
          <button
            onClick={() => setCurrentView('leaderboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>View Full Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Department Filter Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
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

        <button
          onClick={() => pickNewDuel()}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Shuffle Matchup</span>
        </button>
      </div>

      {/* Main Grid: Duel Stage + Live Leaderboard Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Duel Stage (Col 1-3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Prompt Question Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md border border-indigo-800/60">
            <div className="relative z-10 space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                Round Scenario · {currentScenario.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                "{currentScenario.question}"
              </h2>
              <p className="text-xs text-indigo-200/80">
                Click on the educator you believe excels most in this situation.
              </p>
            </div>
          </div>

          {/* Cards Matchup Container */}
          {profA && profB ? (
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* VS Badge in Middle (Desktop) */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900 text-white font-extrabold text-xs items-center justify-center border-4 border-slate-50 dark:border-slate-950 shadow-lg">
                VS
              </div>

              {/* Professor A Card */}
              <div
                className={`group relative rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                  selectedWinnerId === profA.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                    : selectedWinnerId === profB.id
                    ? 'opacity-60 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${profA.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}
                    >
                      {profA.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {profA.name}
                        </h3>
                        {profA.isClaimed && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {profA.institution} · {profA.department}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {profA.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold block">
                        True Rating
                      </span>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white mt-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{profA.overallRating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({profA.totalReviews})
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold block">
                        Duel Elo
                      </span>
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {profA.eloScore} pts
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-5">
                    {profA.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vote Action & Result Reveal */}
                <div>
                  {selectedWinnerId ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">
                          {selectedWinnerId === profA.id ? 'You Voted This' : 'Student Votes'}
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {getSimulatedVoteShare(profA, profB)}% of students
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
                          style={{ width: `${getSimulatedVoteShare(profA, profB)}%` }}
                        />
                      </div>
                      {selectedWinnerId === profA.id && (
                        <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                          +25 True Points Awarded!
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVote(profA, profB)}
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <span>Choose {profA.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Professor B Card */}
              <div
                className={`group relative rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                  selectedWinnerId === profB.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                    : selectedWinnerId === profA.id
                    ? 'opacity-60 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${profB.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}
                    >
                      {profB.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {profB.name}
                        </h3>
                        {profB.isClaimed && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {profB.institution} · {profB.department}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {profB.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold block">
                        True Rating
                      </span>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white mt-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{profB.overallRating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({profB.totalReviews})
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-semibold block">
                        Duel Elo
                      </span>
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {profB.eloScore} pts
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-5">
                    {profB.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vote Action & Result Reveal */}
                <div>
                  {selectedWinnerId ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">
                          {selectedWinnerId === profB.id ? 'You Voted This' : 'Student Votes'}
                        </span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400">
                          {getSimulatedVoteShare(profB, profA)}% of students
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
                          style={{ width: `${getSimulatedVoteShare(profB, profA)}%` }}
                        />
                      </div>
                      {selectedWinnerId === profB.id && (
                        <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                          +25 True Points Awarded!
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVote(profB, profA)}
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <span>Choose {profB.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Next Round Button after vote */}
          {selectedWinnerId && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Comparison Recorded · True Score updated!</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  You’ve evaluated {userStats.duelsVoted} educators. Keep the streak alive!
                </div>
              </div>
              <button
                onClick={() => pickNewDuel()}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Next Matchup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Live Leaderboard Mini-Sidebar (Col 4) */}
        <div className="lg:col-span-1 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Live Duel Leaders
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('leaderboard')}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All Ranks
            </button>
          </div>

          <div className="space-y-3">
            {topEducators.map((prof, rank) => (
              <div
                key={prof.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`font-mono font-bold w-5 text-center text-xs ${
                      rank === 0
                        ? 'text-amber-500 font-extrabold'
                        : rank === 1
                        ? 'text-slate-400'
                        : rank === 2
                        ? 'text-amber-700'
                        : 'text-slate-500'
                    }`}
                  >
                    #{rank + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {prof.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {prof.institution}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {prof.eloScore}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                    {prof.duelWins}W - {prof.duelLosses}L
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1">
            <span className="font-semibold block">How Elo Points Work:</span>
            <span>
              Every vote updates teacher ratings using pairwise comparison scoring. Effective educators climb the True Pedagogy Index.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
