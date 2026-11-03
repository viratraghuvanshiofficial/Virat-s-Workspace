import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ThumbsUp,
  Video,
  MessageSquare,
  Bookmark,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  Pin,
  Send,
  UserCheck,
} from 'lucide-react';
import { Professor } from '../types';
import { AddReviewModal } from './AddReviewModal';

interface Props {
  professor: Professor;
  onClose: () => void;
}

export const ProfessorDetailModal: React.FC<Props> = ({ professor, onClose }) => {
  const {
    reviews,
    upvoteReview,
    addProfessorReply,
    userRole,
    actingProfessorId,
    claimProfessorProfile,
    updateProfessorNote,
    joinMeet,
    meets,
    startDM,
    toggleSaveProfessor,
    userStats,
  } = useApp();

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState(professor.pinnedNote?.text || '');
  const [claimEmail, setClaimEmail] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const profReviews = reviews.filter((r) => r.professorId === professor.id);
  const isSaved = userStats.savedProfessors.includes(professor.id);

  // Check if there is an active live meet for this prof
  const activeMeet = meets.find((m) => m.professorId === professor.id && m.isLiveNow);

  const isCurrentEducator = userRole === 'professor' && actingProfessorId === professor.id;

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    addProfessorReply(reviewId, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
  };

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return;
    updateProfessorNote(professor.id, newNoteText.trim());
    setIsEditingNote(false);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimEmail.trim()) return;
    claimProfessorProfile(professor.id, claimEmail.trim());
    setShowClaimForm(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {professor.institution}
              </span>
              <span aria-hidden="true">·</span>
              <span>{professor.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveProfessor(professor.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSaved
                    ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Save Professor"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copiedLink && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs py-1.5 px-4 text-center font-medium border-b border-emerald-200 dark:border-emerald-800">
              Profile link copied to clipboard!
            </div>
          )}

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Profile Hero Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${professor.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0`}
                >
                  {professor.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                      {professor.name}
                    </h1>
                    {professor.isClaimed && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                        title="Verified Educator Account"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 dark:fill-emerald-950" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {professor.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {professor.overallRating} ★
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{professor.totalReviews} Student Reviews</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {professor.eloScore} Duel Elo
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {activeMeet ? (
                  <button
                    onClick={() => {
                      joinMeet(activeMeet.id);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Live Meet</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      startDM(professor.id);
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Direct Message</span>
                  </button>
                )}

                <button
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Give Feedback</span>
                </button>
              </div>
            </div>

            {/* Unclaimed Profile Banner */}
            {!professor.isClaimed && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Are you {professor.name}? Claim this profile to reply to feedback & host meets.</span>
                </div>
                {!showClaimForm ? (
                  <button
                    onClick={() => setShowClaimForm(true)}
                    className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
                  >
                    Claim Profile
                  </button>
                ) : (
                  <form onSubmit={handleClaim} className="flex items-center gap-2 shrink-0">
                    <input
                      type="email"
                      required
                      placeholder="university.edu email"
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="text-xs px-2.5 py-1 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700"
                    >
                      Verify
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Pinned Note from Professor */}
            {(professor.pinnedNote || isCurrentEducator) && (
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                    <Pin className="w-3.5 h-3.5" />
                    <span>Educator Announcement & Office Hours Notice</span>
                  </div>
                  {isCurrentEducator && (
                    <button
                      onClick={() => setIsEditingNote(!isEditingNote)}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isEditingNote ? 'Cancel' : 'Edit Notice'}
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      rows={2}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                    >
                      Update Notice
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                    {professor.pinnedNote?.text || 'No pinned announcement currently.'}
                  </p>
                )}
                {professor.pinnedNote?.date && !isEditingNote && (
                  <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/60 mt-1">
                    Updated {professor.pinnedNote.date}
                  </p>
                )}
              </div>
            )}

            {/* Bio & Courses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    About & Research
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {professor.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Courses Taught
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {professor.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Teaching Style Highlights
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {professor.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Office Hours Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Office Hours</span>
                </div>
                {professor.officeHours.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span>{slot.day}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{slot.time}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {slot.location}
                    </div>
                  </div>
                ))}
                {activeMeet ? (
                  <button
                    onClick={() => {
                      joinMeet(activeMeet.id);
                      onClose();
                    }}
                    className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room #{activeMeet.roomCode}</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                    Next session per schedule above
                  </div>
                )}
              </div>
            </div>

            {/* Performance Rubric & Ratings Breakdown */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                Verified Teaching Metrics & Duel Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>Clarity</span>
                    <span className="font-mono font-semibold">{professor.ratingsBreakdown.clarity}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(professor.ratingsBreakdown.clarity / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>Engagement</span>
                    <span className="font-mono font-semibold">{professor.ratingsBreakdown.engagement}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(professor.ratingsBreakdown.engagement / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>Fairness</span>
                    <span className="font-mono font-semibold">{professor.ratingsBreakdown.fairness}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(professor.ratingsBreakdown.fairness / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>Helpfulness</span>
                    <span className="font-mono font-semibold">{professor.ratingsBreakdown.helpfulness}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${(professor.ratingsBreakdown.helpfulness / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span>Duel Record</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {professor.duelWins}W - {professor.duelLosses}L
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${
                          professor.duelWins + professor.duelLosses > 0
                            ? (professor.duelWins / (professor.duelWins + professor.duelLosses)) * 100
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Student Reviews & Feedback ({profReviews.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real, constructive feedback from verified students
                  </p>
                </div>
                <button
                  onClick={() => setIsWriteReviewOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  + Add Review
                </button>
              </div>

              {profReviews.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    No reviews yet for {professor.name}.
                  </p>
                  <button
                    onClick={() => setIsWriteReviewOpen(true)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Be the first student to leave feedback
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {profReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 space-y-3 transition-shadow hover:shadow-xs"
                    >
                      {/* Review Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {rev.studentName}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Course: {rev.courseTaken} ({rev.term})
                          </span>
                          {rev.gradeReceived && (
                            <>
                              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                Grade: {rev.gradeReceived}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {rev.reviewText}
                      </p>

                      {/* Tags */}
                      {rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {rev.tags.map((t, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          Posted {rev.date}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => upvoteReview(rev.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                              rev.hasUpvoted
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>

                          {/* Professor Reply Button (if claimed or in professor view) */}
                          {userRole === 'professor' && !rev.professorResponse && (
                            <button
                              onClick={() => setReplyingReviewId(rev.id)}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply as Professor</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Reply Form for Professor */}
                      {replyingReviewId === rev.id && (
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                          <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                            Replying to {rev.studentName}'s review
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Write an encouraging response, clarify course policy, or thank the student..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full text-xs p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReplyingReviewId(null)}
                              className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(rev.id)}
                              className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Post Reply</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Official Professor Response Display */}
                      {rev.professorResponse && (
                        <div className="p-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-lg border-l-2 border-indigo-600 dark:border-indigo-500 text-xs space-y-1">
                          <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>Response from {rev.professorResponse.authorName}</span>
                            </div>
                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-normal">
                              {rev.professorResponse.date}
                            </span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                            {rev.professorResponse.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isWriteReviewOpen && (
        <AddReviewModal professor={professor} onClose={() => setIsWriteReviewOpen(false)} />
      )}
    </>
  );
};
