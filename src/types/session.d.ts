export interface Session {
  session_id: string;
  started_at: string;
  last_activity: string;
  message_count: number;
}

export interface SessionsResponse {
  childId: string;
  sessions: Session[];
  activeSessions: Session[];
  totalSessions: number;
}

export interface SessionMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface SessionDetail {
  sessionId: string;
  messages: SessionMessage[];
  source: string;
  isActive: boolean;
}
