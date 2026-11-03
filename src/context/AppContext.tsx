import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Professor,
  Review,
  MeetSession,
  ChatChannel,
  ChatMessage,
  DuelScenario,
} from '../types';
import {
  INITIAL_PROFESSORS,
  INITIAL_REVIEWS,
  INITIAL_MEETS,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
  DUEL_SCENARIOS,
} from '../mockData';

export type ViewType = 'professors' | 'game' | 'meet' | 'chat' | 'leaderboard';
export type UserRole = 'student' | 'professor';

interface UserStats {
  duelsVoted: number;
  streak: number;
  lastVoteDate?: string;
  savedProfessors: string[];
}

interface AppContextType {
  // Navigation & View
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  actingProfessorId: string;
  setActingProfessorId: (id: string) => void;
  selectedProfessorId: string | null;
  setSelectedProfessorId: (id: string | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Professors
  professors: Professor[];
  addProfessor: (prof: Omit<Professor, 'id' | 'eloScore' | 'duelWins' | 'duelLosses' | 'overallRating' | 'totalReviews' | 'avatarInitials' | 'avatarColor'>) => void;
  claimProfessorProfile: (profId: string, email: string) => void;
  updateProfessorNote: (profId: string, text: string) => void;
  toggleSaveProfessor: (profId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'hasUpvoted'>) => void;
  upvoteReview: (reviewId: string) => void;
  addProfessorReply: (reviewId: string, text: string) => void;

  // Gamification (This or That Duels)
  scenarios: DuelScenario[];
  voteDuel: (winnerId: string, loserId: string, scenarioId: string) => void;
  userStats: UserStats;

  // Meet
  meets: MeetSession[];
  activeMeetId: string | null;
  joinMeet: (meetId: string) => void;
  leaveMeet: () => void;
  createMeet: (meet: Omit<MeetSession, 'id' | 'attendeesCount' | 'isLiveNow'>) => void;

  // Chat
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  sendMessage: (channelId: string, content: string) => void;
  reactToMessage: (channelId: string, messageId: string, emoji: string) => void;
  createGroupChannel: (name: string, description: string, department?: string) => void;
  startDM: (professorId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('true_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('true_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Navigation & Role
  const [currentView, setCurrentView] = useState<ViewType>('professors');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [actingProfessorId, setActingProfessorId] = useState<string>('prof-1');
  const [selectedProfessorId, setSelectedProfessorId] = useState<string | null>(null);

  // Professors State
  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('true_professors');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSORS;
  });

  useEffect(() => {
    localStorage.setItem('true_professors', JSON.stringify(professors));
  }, [professors]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('true_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('true_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // User Stats & Gamification
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('true_user_stats');
    return saved ? JSON.parse(saved) : { duelsVoted: 14, streak: 3, savedProfessors: ['prof-1', 'prof-4'] };
  });

  useEffect(() => {
    localStorage.setItem('true_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Meet State
  const [meets, setMeets] = useState<MeetSession[]>(() => {
    const saved = localStorage.getItem('true_meets');
    return saved ? JSON.parse(saved) : INITIAL_MEETS;
  });

  const [activeMeetId, setActiveMeetId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('true_meets', JSON.stringify(meets));
  }, [meets]);

  // Chat State
  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem('true_channels');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('true_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('chan-cs-algorithms');

  useEffect(() => {
    localStorage.setItem('true_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('true_messages', JSON.stringify(messages));
  }, [messages]);

  // Color generator for new professors
  const COLOR_PALETTES = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-violet-600 to-purple-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
    'from-cyan-600 to-sky-600',
  ];

  const addProfessor = (
    newProfData: Omit<Professor, 'id' | 'eloScore' | 'duelWins' | 'duelLosses' | 'overallRating' | 'totalReviews' | 'avatarInitials' | 'avatarColor'>
  ) => {
    const names = newProfData.name.trim().split(' ');
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();

    const randomColor = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

    const newProf: Professor = {
      ...newProfData,
      id: `prof-${Date.now()}`,
      avatarInitials: initials,
      avatarColor: randomColor,
      eloScore: 1500, // standard baseline Elo
      duelWins: 0,
      duelLosses: 0,
      overallRating: 5.0,
      totalReviews: 0,
    };

    setProfessors((prev) => [newProf, ...prev]);
  };

  const claimProfessorProfile = (profId: string, email: string) => {
    setProfessors((prev) =>
      prev.map((p) =>
        p.id === profId
          ? {
              ...p,
              isClaimed: true,
              claimedEmail: email,
            }
          : p
      )
    );
  };

  const updateProfessorNote = (profId: string, text: string) => {
    setProfessors((prev) =>
      prev.map((p) =>
        p.id === profId
          ? {
              ...p,
              pinnedNote: {
                text,
                date: 'Just now',
              },
            }
          : p
      )
    );
  };

  const toggleSaveProfessor = (profId: string) => {
    setUserStats((prev) => {
      const exists = prev.savedProfessors.includes(profId);
      return {
        ...prev,
        savedProfessors: exists
          ? prev.savedProfessors.filter((id) => id !== profId)
          : [...prev.savedProfessors, profId],
      };
    });
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount' | 'hasUpvoted'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      hasUpvoted: false,
    };

    setReviews((prev) => [newRev, ...prev]);

    // Update professor rating stats
    setProfessors((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.professorId) {
          const profReviews = reviews.filter((r) => r.professorId === p.id);
          const allReviews = [...profReviews, newRev];
          const newCount = allReviews.length;
          const avgOverall =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / newCount;

          const avgClarity =
            allReviews.reduce((sum, r) => sum + r.criteria.clarity, 0) / newCount;
          const avgEngagement =
            allReviews.reduce((sum, r) => sum + r.criteria.engagement, 0) / newCount;
          const avgFairness =
            allReviews.reduce((sum, r) => sum + r.criteria.fairness, 0) / newCount;
          const avgHelpfulness =
            allReviews.reduce((sum, r) => sum + r.criteria.helpfulness, 0) / newCount;

          return {
            ...p,
            totalReviews: newCount,
            overallRating: Number(avgOverall.toFixed(1)),
            ratingsBreakdown: {
              ...p.ratingsBreakdown,
              clarity: Number(avgClarity.toFixed(1)),
              engagement: Number(avgEngagement.toFixed(1)),
              fairness: Number(avgFairness.toFixed(1)),
              helpfulness: Number(avgHelpfulness.toFixed(1)),
            },
          };
        }
        return p;
      })
    );
  };

  const upvoteReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const currentlyUpvoted = !!r.hasUpvoted;
          return {
            ...r,
            hasUpvoted: !currentlyUpvoted,
            helpfulCount: currentlyUpvoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
          };
        }
        return r;
      })
    );
  };

  const addProfessorReply = (reviewId: string, text: string) => {
    const actingProf = professors.find((p) => p.id === actingProfessorId);
    const authorName = actingProf ? actingProf.name : 'Professor';

    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            professorResponse: {
              text,
              date: 'Just now',
              authorName,
            },
          };
        }
        return r;
      })
    );
  };

  // Gamification: Duel Voting
  const voteDuel = (winnerId: string, loserId: string, _scenarioId: string) => {
    setProfessors((prev) =>
      prev.map((prof) => {
        if (prof.id === winnerId) {
          return {
            ...prof,
            duelWins: prof.duelWins + 1,
            eloScore: prof.eloScore + 25,
          };
        }
        if (prof.id === loserId) {
          return {
            ...prof,
            duelLosses: prof.duelLosses + 1,
            eloScore: Math.max(1000, prof.eloScore - 12),
          };
        }
        return prof;
      })
    );

    setUserStats((prev) => ({
      ...prev,
      duelsVoted: prev.duelsVoted + 1,
      streak: prev.streak + 1,
    }));
  };

  // Meets
  const joinMeet = (meetId: string) => {
    setActiveMeetId(meetId);
    setCurrentView('meet');
  };

  const leaveMeet = () => {
    setActiveMeetId(null);
  };

  const createMeet = (meetData: Omit<MeetSession, 'id' | 'attendeesCount' | 'isLiveNow'>) => {
    const newMeet: MeetSession = {
      ...meetData,
      id: `meet-${Date.now()}`,
      attendeesCount: 1,
      isLiveNow: true,
    };

    setMeets((prev) => [newMeet, ...prev]);
    setActiveMeetId(newMeet.id);
    setCurrentView('meet');
  };

  // Chat
  const sendMessage = (channelId: string, content: string) => {
    const isProf = userRole === 'professor';
    const actingProf = professors.find((p) => p.id === actingProfessorId);

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: isProf ? actingProfessorId : 'current-user',
      senderName: isProf ? (actingProf ? actingProf.name : 'Professor') : 'You (Student)',
      senderRole: isProf ? 'professor' : 'student',
      senderAvatarColor: isProf ? 'bg-indigo-600' : 'bg-blue-600',
      channelId,
      content,
      timestamp: 'Just now',
      reactions: [],
    };

    setMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));

    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              lastMessage: content,
              lastTime: 'Just now',
            }
          : c
      )
    );
  };

  const reactToMessage = (channelId: string, messageId: string, emoji: string) => {
    setMessages((prev) => {
      const list = prev[channelId] || [];
      const updated = list.map((msg) => {
        if (msg.id === messageId) {
          const existing = msg.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.hasReacted ? r.count - 1 : r.count + 1,
                      hasReacted: !r.hasReacted,
                    }
                  : r
              ).filter((r) => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, hasReacted: true }],
            };
          }
        }
        return msg;
      });
      return { ...prev, [channelId]: updated };
    });
  };

  const createGroupChannel = (name: string, description: string, department?: string) => {
    const formattedName = name.startsWith('#') ? name : `# ${name.toLowerCase().replace(/\s+/g, '-')}`;
    const newChan: ChatChannel = {
      id: `chan-${Date.now()}`,
      name: formattedName,
      description,
      isGroup: true,
      department,
      unreadCount: 0,
      lastMessage: 'Channel created. Welcome everyone!',
      lastTime: 'Just now',
    };

    setChannels((prev) => [newChan, ...prev]);
    setActiveChannelId(newChan.id);
  };

  const startDM = (professorId: string) => {
    const prof = professors.find((p) => p.id === professorId);
    if (!prof) return;

    // Check if DM exists
    const existing = channels.find((c) => !c.isGroup && c.targetProfessorId === professorId);
    if (existing) {
      setActiveChannelId(existing.id);
      setCurrentView('chat');
      return;
    }

    const dmId = `dm-${prof.id}`;
    const newDM: ChatChannel = {
      id: dmId,
      name: prof.name,
      description: `Direct Message (${prof.title})`,
      isGroup: false,
      targetProfessorId: prof.id,
      unreadCount: 0,
      lastMessage: 'Direct message thread started',
      lastTime: 'Just now',
    };

    setChannels((prev) => [newDM, ...prev]);
    setActiveChannelId(dmId);
    setCurrentView('chat');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        actingProfessorId,
        setActingProfessorId,
        selectedProfessorId,
        setSelectedProfessorId,
        darkMode,
        toggleDarkMode,
        professors,
        addProfessor,
        claimProfessorProfile,
        updateProfessorNote,
        toggleSaveProfessor,
        reviews,
        addReview,
        upvoteReview,
        addProfessorReply,
        scenarios: DUEL_SCENARIOS,
        voteDuel,
        userStats,
        meets,
        activeMeetId,
        joinMeet,
        leaveMeet,
        createMeet,
        channels,
        messages,
        activeChannelId,
        setActiveChannelId,
        sendMessage,
        reactToMessage,
        createGroupChannel,
        startDM,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
