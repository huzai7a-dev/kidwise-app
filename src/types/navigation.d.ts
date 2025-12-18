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
  update_child_profile: undefined,
  onboarding: { parentId: string };
  stories: { id: number };
  lesson: undefined;
  lesson_questions: { lessonId: string };
};
