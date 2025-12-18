import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { theme } from "@src/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllLessonResponses, fetchLessonQuestions, fetchLessons, Lesson } from "@src/services/lesson.service";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

type LessonAnswer = {
    question: string;
    selected_answer: string;
    correct_answer: string;
    correct: boolean;
};

type LessonResponse = {
    id: string;
    child_id: number;
    lesson_id: string;
    answers: LessonAnswer[];
    correct_count: number;
    wrong_count: number;
    total_count: number;
    created_at: string;
};

const ProgressScreen: React.FC = () => {
    const [responses, setResponses] = useState<LessonResponse[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<LessonResponse | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        const childId = await AsyncStorage.getItem("child_id");
        if (!childId) return;

        const [lessonData, responseData] = await Promise.all([
            fetchLessons(),
            fetchAllLessonResponses(childId),
        ]);

        setLessons(lessonData);
        setResponses(responseData);
        setLoading(false);
    };

    const getSubjectName = (lessonId: string) => {
        const lesson = lessons.find(l => l.id === lessonId);
        return lesson ? lesson.subject_name : `Lesson ${lessonId}`;
    };

const openModal = async (response: LessonResponse) => {
  try {
    const questions = await fetchLessonQuestions(response.lesson_id);
    const answersWithQuestions = response.answers.map(ans => {
      const question = questions.find(q => q.id === ans.question_id);
      return {
        ...ans,
        question: question?.question || "Question not found",
        correct_answer: question?.correct_answer || ans.correct_answer,
      };
    });

    setSelectedResponse({ ...response, answers: answersWithQuestions });
    setModalVisible(true);
  } catch (err) {
    console.log("Error fetching lesson questions:", err);
  }
};

    if (loading)
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );


        console.log(selectedResponse,'selectedResponse')

    return (
        <View style={{ flex: 1, backgroundColor: theme.secondaryBg }}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back" size={28} color={theme.black} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Progress History</Text>
                </View>

                <View style={{ marginBottom: 60 }}>
                    {responses.length === 0 ? (
                        <Text style={styles.empty}>No progress recorded yet 😔</Text>
                    ) : (
                        responses.map((res, index) => {
                            const percent = Math.round((res.correct_count / res.total_count) * 100);

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.card}
                                    onPress={() => openModal(res)}
                                >
                                    <View style={styles.cardHeader}>
                                        <Icon name="book-outline" size={24} color={theme.primary} />
                                        <Text style={styles.lessonName}>{getSubjectName(res.lesson_id)}</Text>

                                        <View
                                            style={[
                                                styles.chip,
                                                { backgroundColor: percent >= 70 ? "#D1FFE0" : "#FFE2E2" },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color: percent >= 70 ? "#0A8A3B" : "#D11A2A",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {percent >= 70 ? "Passed" : "Needs Work"}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${percent}%` }]} />
                                    </View>

                                    <View style={styles.row}>
                                        <Text style={styles.stat}>Correct: {res.correct_count}</Text>
                                        <Text style={styles.stat}>Wrong: {res.wrong_count}</Text>
                                        <Text style={styles.percent}>{percent}%</Text>
                                    </View>

                                    <Text style={styles.date}>
                                        {new Date(res.created_at).toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Quiz: {selectedResponse ? getSubjectName(selectedResponse.lesson_id) : ""}
                        </Text>

                        <FlatList
                            data={selectedResponse?.answers || []}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={({ item, index }) => (
                                <View
                                    style={[
                                        styles.answerRow,
                                        { backgroundColor: item.correct ? "#D1FFE0" : "#FFE2E2" },
                                    ]}
                                >
                                    <Text style={styles.questionText}>
                                        {index + 1}. {item.question}
                                    </Text>
                                    <Text style={[styles.answerText, { color: item.correct ? "green" : "red" }]}>
                                        Your answer: {item.selected_answer} {item.correct ? "✔" : "✖"}
                                    </Text>
                                    {!item.correct && (
                                        <Text style={styles.correctAnswerText}>
                                            Correct answer: {item.correct_answer}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProgressScreen;

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 50 },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 25 },
    title: { fontSize: 30, color: theme.black, fontWeight: "bold" },
    card: {
        backgroundColor: theme.white,
        padding: 20,
        borderRadius: 18,
        marginBottom: 18,
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "space-between" },
    lessonName: { fontSize: 19, fontWeight: "bold", color: theme.primary, flex: 1, marginLeft: 5 },
    progressBar: { width: "100%", height: 10, backgroundColor: "#E9E9E9", borderRadius: 10, overflow: "hidden", marginVertical: 12 },
    progressFill: { height: "100%", backgroundColor: theme.primary, borderRadius: 10 },
    chip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    stat: { fontSize: 16, color: theme.black },
    percent: { fontSize: 18, fontWeight: "bold", color: theme.primary },
    date: { marginTop: 6, color: "gray", fontSize: 12 },
    empty: { textAlign: "center", color: "gray", fontSize: 18, marginTop: 30 },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContent: { backgroundColor: theme.white, borderRadius: 15, padding: 20, maxHeight: "80%" },
    modalTitle: { fontSize: 22, fontWeight: "bold", color: theme.black, marginBottom: 15 },
    answerRow: { marginBottom: 12, padding: 12, borderRadius: 12 },
    questionText: { fontSize: 16, fontWeight: "500", marginBottom: 4,color: theme.black },
    answerText: { fontSize: 15, fontWeight: "500" },
    correctAnswerText: { fontSize: 14, color: "gray" },
    closeButton: { marginTop: 15, backgroundColor: theme.primary, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
    closeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
