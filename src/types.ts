export interface RatingsBreakdown {
  clarity: number; // 1-5
  engagement: number; // 1-5
  fairness: number; // 1-5
  helpfulness: number; // 1-5
  workload: number; // 1-5 (1=light, 5=very heavy)
}

export interface OfficeHourSlot {
  day: string;
  time: string;
  location: string;
  meetLinkAvailable: boolean;
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  institution: string;
  avatarInitials: string;
  avatarColor: string;
  avatarUrl?: string;
  bio: string;
  courses: string[];
  overallRating: number;
  totalReviews: number;
  ratingsBreakdown: RatingsBreakdown;
  eloScore: number;
  duelWins: number;
  duelLosses: number;
  tags: string[];
  isClaimed: boolean;
  claimedEmail?: string;
  officeHoursNotice?: string;
  pinnedNote?: {
    text: string;
    date: string;
  };
  officeHours: OfficeHourSlot[];
}

export interface ReviewCriteria {
  clarity: number;
  engagement: number;
  fairness: number;
  helpfulness: number;
}

export interface ProfessorResponse {
  text: string;
  date: string;
  authorName: string;
}

export interface Review {
  id: string;
  professorId: string;
  studentName: string;
  isAnonymous: boolean;
  courseTaken: string;
  term: string;
  rating: number;
  criteria: ReviewCriteria;
  gradeReceived?: string;
  reviewText: string;
  tags: string[];
  date: string;
  helpfulCount: number;
  hasUpvoted?: boolean;
  professorResponse?: ProfessorResponse;
}

export interface DuelScenario {
  id: string;
  question: string;
  category: 'Lectures' | 'Exams' | 'Mentorship' | 'Office Hours' | 'Mastery';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'professor';
  senderAvatarColor: string;
  recipientId?: string; // DM
  channelId?: string; // Group
  content: string;
  timestamp: string;
  reactions: {
    emoji: string;
    count: number;
    hasReacted?: boolean;
  }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  isGroup: boolean;
  department?: string;
  targetProfessorId?: string;
  unreadCount: number;
  lastMessage?: string;
  lastTime?: string;
}

export interface MeetSession {
  id: string;
  title: string;
  professorName: string;
  professorId: string;
  department: string;
  institution: string;
  topic: string;
  scheduledTime: string;
  isLiveNow: boolean;
  attendeesCount: number;
  roomCode: string;
}
