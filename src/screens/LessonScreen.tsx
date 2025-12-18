import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import BottomNavBar from "@src/components/BottomNavbar";
import Header from "@src/components/Header";
import { theme } from "@src/constants/colors";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "@src/types/navigation";
import { fetchChildrenByParent } from "@src/services/child.service";
import { Child } from "@src/types/child";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchLessons, Lesson } from "@src/services/lesson.service";
import alphabets from "@assets/lessons/alphabets.png";
import animals from "@assets/lessons/animals.png";
import birds from "@assets/lessons/birds.png";
import colorsImg from "@assets/lessons/colors.png";
import fruits from "@assets/lessons/fruits.png";
import math from "@assets/lessons/math.png";
import vegetables from "@assets/lessons/vegetables.png";
import vehicles from "@assets/lessons/vehicles.png";

const lessonImages: Record<string, any> = {
    "Math": math,
    "Vehicles": vehicles,
    "Colors": colorsImg,
    "Animal": animals,
    "Fruits": fruits,
    "Vegetables": vegetables,
    "Birds": birds,
    "Alphabets": alphabets,
};

const LessonScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [childInfo, setChildInfo] = useState<Child | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const lessonColors = ["#EBF6F0", "#FBF2E9", "#FFF6EF", "#E5F3FC", "#F7F1FF"];
    const getRandomColor = () => lessonColors[Math.floor(Math.random() * lessonColors.length)];

    const loadLessons = async () => {
        const allLessons = await fetchLessons();
        setLessons(allLessons);
    };

    useEffect(() => {
        const loadChild = async () => {
            const childrens = await fetchChildrenByParent();
            if (childrens.length > 0) {
                const storedChildId = await AsyncStorage.getItem("child_id");
                setChildInfo(childrens.find(child => child.id.toString() === storedChildId) || childrens[0]);
            }
        };
        loadLessons();
        loadChild();
    }, []);

    return (
        <View style={styles.container}>
            <Header
                avatarIndex={childInfo?.avatar_id || 1}
                childName={childInfo?.full_name || "Child"}
                onProfilePress={() => navigation.navigate("pin")}
                onNotificationPress={() => navigation.navigate("notification")}
            />

            <TextInput
                placeholder="Search for lessons"
                placeholderTextColor={theme.gray}
                style={styles.searchInput}
            />

            <View style={styles.lessonWrapper}>
                {lessons.map((lesson) => (
                    <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonTouchable}
                        onPress={() => navigation.navigate("lesson_questions", { lessonId: lesson.id })}
                    >
                        <View style={[styles.lessonCard, { backgroundColor: getRandomColor() }]}>
                            <Image source={lessonImages[lesson.subject_name] || null} />
                            <Text style={styles.lessonText}>{lesson.subject_name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.secondaryBg,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: theme.gray,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 25,
        marginBottom: 10,
    },
    lessonWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
    },
    lessonTouchable: {
        width: "50%",
        padding: 10,
    },
    lessonCard: {
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        padding: 10,
        height: 127,
        justifyContent: "center",
    },
    lessonText: {
        fontSize: 16,
        fontWeight: "medium",
        marginTop:10,
        color: theme.black,
    },
});

export default LessonScreen;
