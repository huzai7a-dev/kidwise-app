export type RootStackParamList = {
  default: undefined;
  login: undefined;
  register: undefined;
  dashboard: undefined,
  profile: undefined,
  avatar: undefined,
  pin: undefined,
  notification: undefined,
  progress: undefined,
  ai_sessions: undefined,
  update_child_profile: undefined,
  onboarding: { parentId: string,nextRoute?:string };
  stories: { id: number };
  lesson: undefined;
  lesson_questions: { lessonId: string };
  session_detail: { sessionId: string };
};
