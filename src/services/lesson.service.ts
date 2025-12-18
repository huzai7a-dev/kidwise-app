import { server } from "@src/utils/server";

export type Lesson = {
  id: string;
  subject_name: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
};
export type LessonQuestion = {
  id: string;
  lesson_id: string;
  question: string;
  options: { options: string[] };
  correct_answer: string;
  image_url?: string;
};

export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    const { data, error } = await server
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.log("fetchLessons error:", err);
    return [];
  }
};

export const fetchLessonQuestions = async (lessonId: string): Promise<LessonQuestion[]> => {
  try {
    const { data, error } = await server
      .from("lesson_questions")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.log("fetchLessonQuestions error:", err);
    return [];
  }
};

export const saveLessonResponse = async (
  childId: string,
  lessonId: string,
  answers: { question_id: string; selected_answer: string; correct: boolean }[]
) => {
  const correct_count = answers.filter(a => a.correct).length;
  const wrong_count = answers.length - correct_count;

  try {
    const { data, error } = await server
      .from("lesson_responses")
      .insert([{
        child_id: Number(childId),
        lesson_id: lessonId,
        answers: answers,
        correct_count,
        wrong_count,
        total_count: answers.length
      }]);
    if (error) throw error;
    return data;
  } catch (err) {
    console.log("saveLessonResponse error:", err);
    return null;
  }
};

export const fetchTodayLessonResponses = async (childId: string) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await server
      .from("lesson_responses")
      .select("*")
      .eq("child_id", Number(childId))
      .gte("created_at", start)
      .lte("created_at", end)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    console.log("fetchTodayLessonResponses error:", err);
    return [];
  }
};
export const fetchAllLessonResponses = async (childId: string) => {
  try {

    const { data, error } = await server
      .from("lesson_responses")
      .select("*")
      .eq("child_id", Number(childId))
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    console.log("fetchTodayLessonResponses error:", err);
    return [];
  }
};
