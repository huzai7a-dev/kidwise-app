import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ToastAndroid } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "@src/types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchLessonQuestions, LessonQuestion, saveLessonResponse } from "@src/services/lesson.service";
import { theme } from "@src/constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";

type LessonRouteProp = RouteProp<RootStackParamList, "lesson_questions">;

const QuestionsScreen = () => {
    const route = useRoute<LessonRouteProp>();
    const navigation = useNavigation();
    const { lessonId } = route.params;

    const [questions, setQuestions] = useState<LessonQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ question_id: string; selected_answer: string; correct: boolean }[]>([]);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        const loadQuestions = async () => {
            const qs = await fetchLessonQuestions(lessonId);
            setQuestions(qs);
        };
        loadQuestions();
    }, [lessonId]);

    const handleOptionSelect = (option: string) => {
        const currentQuestion = questions[currentIndex];
        const correct = option === currentQuestion.correct_answer;

        setSelectedOption(option);
        setIsCorrect(correct);

        if (currentIndex === questions.length - 1) {
            setTimeout(async () => {
                const childId = await AsyncStorage.getItem("child_id");
                if (!childId) return;
                await saveLessonResponse(childId, lessonId, [
                    ...answers,
                    { question_id: currentQuestion.id, selected_answer: option, correct },
                ]);
                ToastAndroid.show("Great job! You've completed the lesson.", ToastAndroid.SHORT);
                navigation.goBack();
            }, 3000);
        }
    };


    const handleNext = async () => {
        if (selectedOption === null) return;

        const currentQuestion = questions[currentIndex];
        const correct = selectedOption === currentQuestion.correct_answer;
        setAnswers(prev => [...prev, { question_id: currentQuestion.id, selected_answer: selectedOption, correct }]);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            const childId = await AsyncStorage.getItem("child_id");
            if (!childId) return;

            await saveLessonResponse(childId, lessonId, [...answers, { question_id: currentQuestion.id, selected_answer: selectedOption, correct }]);
            ToastAndroid.show("Great job! You've completed the lesson.", ToastAndroid.SHORT);
            navigation.goBack();
        }
    };

    if (!questions.length) return <Text>Loading questions...</Text>;

    const q = questions[currentIndex];

    return (
        <View style={styles.container}>
            {/* Progress bar */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 20 }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" style={{ color: theme.darkGray }} size={24} />
                </Pressable>
                <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
                    {questions.map((_, idx) => (
                        <View
                            key={idx}
                            style={{
                                flex: 1,
                                height: 10,
                                backgroundColor: idx <= currentIndex ? theme.primary : theme.lightGray,
                                borderRadius: 5,
                            }}
                        />
                    ))}
                </View>
            </View>

            <Text style={styles.questionText}>{q.question}</Text>
            {q.image_url && <Image source={{ uri: q.image_url }} style={styles.questionImage} />}

            {/* Feedback */}
            {selectedOption && (
                <View
                    style={{
                        padding: 10,
                        backgroundColor: isCorrect ? "green" : "red",
                        marginBottom: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                        {isCorrect ? "Correct!" : `Wrong! Correct answer: ${q.correct_answer}`}
                    </Text>
                </View>
            )}

            {/* Options */}
            <View style={styles.optionsWrapper}>
                {q.options.options.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.optionButton,
                            selectedOption === option &&
                            { backgroundColor: option === q.correct_answer ? "green" : "red" },
                        ]}
                        disabled={!!selectedOption} // disable after selection
                        onPress={() => handleOptionSelect(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Next Button */}
            {selectedOption && (
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={{ fontSize: 18, textAlign: "center", color: "#fff" }}>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 50 },
    questionText: { fontSize: 20, fontWeight: "bold", marginBottom: 30, color: theme.black },
    questionImage: { width: "100%", height: 200, marginBottom: 10, resizeMode: "contain" },
    optionsWrapper: { marginTop: 20, flexDirection: "row", flexWrap: "wrap" },
    optionButton: {
        paddingHorizontal: 15,
        paddingVertical: 25,
        backgroundColor: theme.primary,
        borderRadius: 10,
        marginBottom: 10,
        width: "47%",
        marginRight: 10,
    },
    optionText: { fontSize: 18, color: theme.white, textAlign: "center" },
    nextButton: {
        position: "absolute",
        bottom: 30,
        left: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: theme.primary,
        borderRadius: 10,
        width: "100%",
    },
});

export default QuestionsScreen;
