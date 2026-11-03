import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  Swords,
  Video,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Clock,
  Pin,
  ChevronRight,
} from 'lucide-react';
import { Professor } from '../types';
import { ProfessorDetailModal } from './ProfessorDetailModal';
import { AddReviewModal } from './AddReviewModal';

interface Props {
  professor: Professor;
}

export const ProfessorCard: React.FC<Props> = ({ professor }) => {
  const { meets, joinMeet, startDM, toggleSaveProfessor, userStats } = useApp();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const isSaved = userStats.savedProfessors.includes(professor.id);
  const liveMeet = meets.find((m) => m.professorId === professor.id && m.isLiveNow);

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
        {/* Top Meta Bar */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${professor.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0`}
              >
                {professor.avatarInitials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    onClick={() => setIsDetailOpen(true)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors"
                  >
                    {professor.name}
                  </h3>
                  {professor.isClaimed && (
                    <span title="Verified Educator Profile">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/40" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{professor.institution}</span>
                  <span aria-hidden="true">·</span>
                  <span>{professor.department}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSaveProfessor(professor.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Save to bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bio Preview */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {professor.bio}
          </p>

          {/* Pinned Note Preview (if exists) */}
          {professor.pinnedNote && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-start gap-1.5">
              <Pin className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{professor.pinnedNote.text}</span>
            </div>
          )}

          {/* Quantitative Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-xs mb-3.5">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                True Rating
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{professor.overallRating}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({professor.totalReviews})
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                Duel Elo
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                <Swords className="w-3.5 h-3.5 text-indigo-500" />
                <span>{professor.eloScore}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 block">
                Win Rate
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {professor.duelWins + professor.duelLosses > 0
                  ? `${Math.round(
                      (professor.duelWins / (professor.duelWins + professor.duelLosses)) * 100
                    )}%`
                  : 'New'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {professor.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {liveMeet ? (
            <button
              onClick={() => joinMeet(liveMeet.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <Video className="w-3 h-3" />
              <span>Live Office Hours</span>
            </button>
          ) : (
            <button
              onClick={() => startDM(professor.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsReviewOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
            >
              Feedback
            </button>
            <button
              onClick={() => setIsDetailOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <span>Profile</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {isDetailOpen && (
        <ProfessorDetailModal
          professor={professor}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      {isReviewOpen && (
        <AddReviewModal
          professor={professor}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </>
  );
};
