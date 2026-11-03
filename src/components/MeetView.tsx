import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Calendar,
  Users,
  Clock,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ActiveMeetRoom } from './ActiveMeetRoom';
import { MeetSession } from '../types';

export const MeetView: React.FC = () => {
  const {
    meets,
    activeMeetId,
    joinMeet,
    leaveMeet,
    createMeet,
    userRole,
    professors,
    actingProfessorId,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'live' | 'upcoming'>('all');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New meet form state
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newTime, setNewTime] = useState('Today at 4:00 PM EST');
  const [newDept, setNewDept] = useState('Computer Science');

  const activeSession = meets.find((m) => m.id === activeMeetId);

  // If in active room, render full video stage
  if (activeSession) {
    return <ActiveMeetRoom meet={activeSession} onLeave={leaveMeet} />;
  }

  const filteredMeets = meets.filter((m) => {
    if (filterType === 'live') return m.isLiveNow;
    if (filterType === 'upcoming') return !m.isLiveNow;
    return true;
  });

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;

    const matched = meets.find(
      (m) => m.roomCode.toLowerCase() === roomCodeInput.trim().toLowerCase()
    );
    if (matched) {
      joinMeet(matched.id);
    } else {
      // Create temporary room with this code
      createMeet({
        title: `Instant Academic Meet #${roomCodeInput.toUpperCase()}`,
        professorName: userRole === 'professor' ? 'Educator Host' : 'Peer Study Circle',
        professorId: 'custom-room',
        department: 'General Academic',
        institution: 'Open Campus',
        topic: 'Collaborative Problem Solving & Office Hours',
        scheduledTime: 'Live Right Now',
        roomCode: roomCodeInput.toUpperCase(),
      });
    }
  };

  const handleCreateMeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const actingProf = professors.find((p) => p.id === actingProfessorId);
    const hostName =
      userRole === 'professor' && actingProf
        ? actingProf.name
        : 'Student Collaborative Session';
    const institution = actingProf ? actingProf.institution : 'Campus Network';

    createMeet({
      title: newTitle.trim(),
      professorName: hostName,
      professorId: actingProf ? actingProf.id : 'student-host',
      department: newDept,
      institution,
      topic: newTopic.trim() || 'General doubt clearing and problem set walkthrough',
      scheduledTime: newTime,
      roomCode: `TRUE-${Math.floor(100 + Math.random() * 900)}`,
    });

    setShowScheduleModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Video className="w-4 h-4" />
            <span>Virtual Meet & Live Office Hours</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Connect Face-to-Face with Educators
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Attend live professor office hours, collaborative whiteboard problem solving, and group study rooms.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Launch / Schedule Room</span>
        </button>
      </div>

      {/* Join via Code Strip */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Join with Room Code
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Have an office hours link or room code from your syllabus?
          </p>
        </div>

        <form onSubmit={handleJoinByCode} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. CS161-OFFICE"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
            className="text-xs font-mono px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-xl transition-colors whitespace-nowrap"
          >
            Enter Room
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterType === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Sessions ({meets.length})
        </button>
        <button
          onClick={() => setFilterType('live')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            filterType === 'live'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Now</span>
        </button>
        <button
          onClick={() => setFilterType('upcoming')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterType === 'upcoming'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Scheduled Office Hours
        </button>
      </div>

      {/* Meets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMeets.map((session) => (
          <div
            key={session.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              session.isLiveNow
                ? 'bg-white dark:bg-slate-900 border-emerald-400/80 dark:border-emerald-500/60 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {session.isLiveNow ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      LIVE RIGHT NOW
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.scheduledTime}</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  #{session.roomCode}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-1">
                {session.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span>{session.institution}</span>
                <span aria-hidden="true">·</span>
                <span>{session.department}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {session.topic}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span>{session.attendeesCount} participants</span>
              </div>

              {session.isLiveNow ? (
                <button
                  onClick={() => joinMeet(session.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Join Live Meet</span>
                </button>
              ) : (
                <button
                  onClick={() => joinMeet(session.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <span>Open Room Early</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Launch / Schedule Office Hours Meet
            </h3>
            <form onSubmit={handleCreateMeet} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Vasquez - Algorithms Problem Set 4 Walkthrough"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Agenda
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tracing dynamic programming table memoization..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Literature & Humanities">Literature & Humanities</option>
                    <option value="Bioengineering">Bioengineering</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Start Room Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
