import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Users,
  Search,
  Plus,
  Send,
  Smile,
  CheckCircle2,
  Video,
  Hash,
  User,
  GraduationCap,
} from 'lucide-react';
import { ChatChannel, ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const {
    channels,
    messages,
    activeChannelId,
    setActiveChannelId,
    sendMessage,
    reactToMessage,
    createGroupChannel,
    userRole,
    professors,
    joinMeet,
    meets,
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupDept, setNewGroupDept] = useState('Computer Science');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = activeChannel ? messages[activeChannel.id] || [] : [];

  const groupChannels = channels.filter((c) => c.isGroup);
  const dmChannels = channels.filter((c) => !c.isGroup);

  const filteredGroups = groupChannels.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDMs = dmChannels.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeChannel) return;

    sendMessage(activeChannel.id, inputContent.trim());
    setInputContent('');
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    createGroupChannel(newGroupName.trim(), newGroupDesc.trim(), newGroupDept);
    setShowCreateGroup(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  // Find if professor has a live meet
  const targetProf = activeChannel?.targetProfessorId
    ? professors.find((p) => p.id === activeChannel.targetProfessorId)
    : null;
  const profMeet = targetProf
    ? meets.find((m) => m.professorId === targetProf.id && m.isLiveNow)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex overflow-hidden">
        {/* Left Sidebar: Channels & DMs */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Discussions & Chats</span>
              </h2>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Create Group Channel"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search channels or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Section 1: Study Circles / Groups */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Study Circles & Groups</span>
                <span className="font-mono">{filteredGroups.length}</span>
              </div>
              <div className="space-y-1">
                {filteredGroups.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannelId(channel.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                      activeChannelId === channel.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeChannelId === channel.id
                            ? 'bg-indigo-700 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        #
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate leading-tight">
                          {channel.name}
                        </div>
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            activeChannelId === channel.id
                              ? 'text-indigo-100'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {channel.lastMessage || channel.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Direct Messages */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Direct Messages</span>
                <span className="font-mono">{filteredDMs.length}</span>
              </div>
              <div className="space-y-1">
                {filteredDMs.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => setActiveChannelId(dm.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                      activeChannelId === dm.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          activeChannelId === dm.id
                            ? 'bg-indigo-700 text-white'
                            : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
                        }`}
                      >
                        {dm.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold truncate leading-tight flex items-center gap-1">
                          <span>{dm.name}</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        </div>
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            activeChannelId === dm.id
                              ? 'text-indigo-100'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {dm.lastMessage || 'Direct message thread'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Chat Window */}
        {activeChannel ? (
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {/* Active Channel Header */}
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                  {activeChannel.isGroup ? '#' : activeChannel.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {activeChannel.name}
                    </h3>
                    {!activeChannel.isGroup && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Faculty
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeChannel.description}
                  </p>
                </div>
              </div>

              {/* Fast Meet Link if educator has active meet */}
              {profMeet && (
                <button
                  onClick={() => joinMeet(profMeet.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Live Meet Room</span>
                </button>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {channelMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 group">
                  <div
                    className={`w-8 h-8 rounded-xl ${msg.senderAvatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5`}
                  >
                    {msg.senderName.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {msg.senderName}
                      </span>
                      {msg.senderRole === 'professor' && (
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                          Educator
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                      {msg.content}
                    </div>

                    {/* Reactions Pill Row */}
                    <div className="flex items-center gap-1 pt-1">
                      {msg.reactions.map((react, i) => (
                        <button
                          key={i}
                          onClick={() => reactToMessage(activeChannel.id, msg.id, react.emoji)}
                          className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                            react.hasReacted
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{react.emoji}</span>
                          <span className="font-mono text-[10px]">{react.count}</span>
                        </button>
                      ))}

                      {/* Quick Add Reaction Buttons on hover */}
                      <div className="hidden group-hover:flex items-center gap-1 ml-1 text-xs">
                        {['👍', '💡', '❤️', '🔥'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => reactToMessage(activeChannel.id, msg.id, emoji)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Message ${activeChannel.name}...`}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Study Circle or Group
            </h3>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Channel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. # cs161-midterm-prep"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Channel Purpose / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Peer doubt clearing, homework hints & practice tests"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={newGroupDept}
                  onChange={(e) => setNewGroupDept(e.target.value)}
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

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
