import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  PenTool,
  Eraser,
  Download,
  CheckCircle2,
  Send,
  Sparkles,
} from 'lucide-react';
import { MeetSession } from '../types';

interface Props {
  meet: MeetSession;
  onLeave: () => void;
}

export const ActiveMeetRoom: React.FC<Props> = ({ meet, onLeave }) => {
  const { userRole, professors, actingProfessorId } = useApp();

  // Local media controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHandsList, setRaisedHandsList] = useState<string[]>(['Chloe Bennett', 'Jordan Vance']);

  // Tabs / Sidebars
  const [activeTab, setActiveTab] = useState<'video' | 'whiteboard'>('video');
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string; isProf?: boolean }[]>([
    { sender: meet.professorName, text: 'Welcome everyone! Feel free to raise your hand or drop problem set questions in this chat.', time: '10:02 AM', isProf: true },
    { sender: 'Rohan Mehta', text: 'Dr. Vasquez, could we review the invariant for Bellman-Ford cycle detection?', time: '10:05 AM' },
    { sender: meet.professorName, text: 'Yes! Opening the whiteboard scratchpad right now to sketch the negative cycle propagation.', time: '10:06 AM', isProf: true },
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  // Whiteboard state
  const [whiteboardText, setWhiteboardText] = useState<string>(
    `// CS161 - Algorithm Memoization Board\n\nTheorem: Shortest Path with DAG Ordering\nLet G = (V, E) be a directed acyclic graph.\n1. Topologically sort vertices: v_1, v_2, ..., v_n\n2. For each v_i, relax all outgoing edges (v_i, u):\n   dist[u] = min(dist[u], dist[v_i] + weight(v_i, u))\n\nTime Complexity: O(|V| + |E|)\nNotice: No cycle checking needed because edges only flow rightward!`
  );

  const isCurrentEducator = userRole === 'professor';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const senderName = isCurrentEducator ? meet.professorName : 'You (Student)';
    setChatMessages((prev) => [
      ...prev,
      {
        sender: senderName,
        text: newMsgText.trim(),
        time: 'Just now',
        isProf: isCurrentEducator,
      },
    ]);
    setNewMsgText('');
  };

  const handleToggleHandRaise = () => {
    if (isHandRaised) {
      setIsHandRaised(false);
      setRaisedHandsList((prev) => prev.filter((name) => name !== 'You'));
    } else {
      setIsHandRaised(true);
      setRaisedHandsList((prev) => [...prev, 'You']);
    }
  };

  const handleAcknowledgeHand = (name: string) => {
    setRaisedHandsList((prev) => prev.filter((n) => n !== name));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Room Header */}
      <div className="h-14 px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              {meet.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{meet.professorName}</span>
              <span aria-hidden="true">·</span>
              <span>Room: #{meet.roomCode}</span>
              <span aria-hidden="true">·</span>
              <span>{meet.attendeesCount + (isHandRaised ? 1 : 0)} participants</span>
            </div>
          </div>
        </div>

        {/* View Switcher: Video vs Whiteboard */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'video'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Video Room
          </button>
          <button
            onClick={() => setActiveTab('whiteboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'whiteboard'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Shared Board</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${
              showChat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Live Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Stage (Video or Whiteboard) */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {activeTab === 'video' ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              {/* Professor Spotlight (2 cols on md) */}
              <div className="md:col-span-2 relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 min-h-[360px]">
                {/* Audio waves & active speaker tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-xs px-3 py-1 rounded-lg text-xs border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold">{meet.professorName} (Speaking)</span>
                  </div>
                  <span className="text-[11px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                    Host & Educator
                  </span>
                </div>

                {/* Animated Simulated Video Feed */}
                <div className="flex flex-col items-center justify-center my-auto space-y-3">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-indigo-400/30">
                    EV
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-sm font-bold text-white">Live Office Hours Stream</div>
                    <div className="flex items-center justify-center gap-1 text-xs text-indigo-300">
                      <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-pulse" />
                      <span className="w-1.5 h-6 bg-indigo-300 rounded-full animate-pulse delay-75" />
                      <span className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse delay-150" />
                      <span className="text-slate-400 ml-1">Live Audio Connected</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar inside feed */}
                <div className="bg-slate-950/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                  <span className="text-slate-300">Topic: {meet.topic}</span>
                  <span className="text-slate-400">{meet.department}</span>
                </div>
              </div>

              {/* Student Participant Tiles (1 col on md) */}
              <div className="space-y-4 flex flex-col">
                {/* Self View ("You") */}
                <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 flex-1 flex flex-col justify-between min-h-[160px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">You (Student)</span>
                    <div className="flex items-center gap-1.5">
                      {isMicOn ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      {isCamOn ? (
                        <VideoIcon className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <VideoOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center my-auto">
                    {isCamOn ? (
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        YOU
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">Camera Off</div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 text-center">
                    {isSharingScreen ? 'Sharing Screen' : 'Webcam Active'}
                  </div>
                </div>

                {/* Peer Student Tile 1 */}
                <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                      CB
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Chloe Bennett</div>
                      <div className="text-[10px] text-slate-400">CS 161 Student</div>
                    </div>
                  </div>
                  <Mic className="w-3.5 h-3.5 text-slate-500" />
                </div>

                {/* Peer Student Tile 2 */}
                <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-3.5 flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      RM
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Rohan Mehta</div>
                      <div className="text-[10px] text-slate-400">Stanford Undergrad</div>
                    </div>
                  </div>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                </div>
              </div>
            </div>
          ) : (
            /* Collaborative Whiteboard / Code Canvas */
            <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Scratchpad & Equations (Live Sync)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWhiteboardText('')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                  <span className="text-[11px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                    Collaborative Editor
                  </span>
                </div>
              </div>

              <textarea
                value={whiteboardText}
                onChange={(e) => setWhiteboardText(e.target.value)}
                placeholder="Type algorithms, LaTeX equations, proof structures, or question notes..."
                className="flex-1 w-full p-4 bg-slate-950 text-indigo-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
          )}
        </div>

        {/* Sidebar: Chat & Hand Raise Queue */}
        {showChat && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
            {/* Raised Hands Queue */}
            {raisedHandsList.length > 0 && (
              <div className="p-3 bg-amber-950/40 border-b border-amber-900/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
                  <Hand className="w-3.5 h-3.5" />
                  <span>Hand Raise Queue ({raisedHandsList.length})</span>
                </div>
                <div className="space-y-1.5">
                  {raisedHandsList.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-slate-900 p-1.5 rounded-lg border border-amber-900/40"
                    >
                      <span className="text-slate-200">{name}</span>
                      {isCurrentEducator ? (
                        <button
                          onClick={() => handleAcknowledgeHand(name)}
                          className="text-[10px] px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono">In Queue</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        msg.isProf ? 'text-indigo-400' : 'text-slate-300'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-slate-500 text-[10px]">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question in meet..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Deck */}
      <div className="h-16 border-t border-slate-800 bg-slate-900 px-6 flex items-center justify-center gap-4 shrink-0">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full transition-colors ${
            isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
          }`}
          title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsCamOn(!isCamOn)}
          className={`p-3 rounded-full transition-colors ${
            isCamOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
          }`}
          title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCamOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsSharingScreen(!isSharingScreen)}
          className={`p-3 rounded-full transition-colors ${
            isSharingScreen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title="Share Screen"
        >
          <MonitorUp className="w-5 h-5" />
        </button>

        <button
          onClick={handleToggleHandRaise}
          className={`p-3 rounded-full transition-colors ${
            isHandRaised ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand className="w-5 h-5" />
        </button>

        <button
          onClick={onLeave}
          className="p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors"
          title="Leave Room"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
