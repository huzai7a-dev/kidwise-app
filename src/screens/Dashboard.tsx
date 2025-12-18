import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Image,
    Pressable,
    Text
} from "react-native";
import BottomNavBar from "@src/components/BottomNavbar";
import Header from "@src/components/Header";
import KWText from "@src/components/KWText";
import { theme } from "@src/constants/colors";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { RootStackParamList } from "@src/types/navigation";
import { fetchChildrenByParent } from "@src/services/child.service";
import { Child } from "@src/types/child";
import AsyncStorage from "@react-native-async-storage/async-storage";
import brainImg from '@assets/home/brain.png'
import alphabet from '@assets/home/alphabet.png'
import superman from '@assets/home/superman.png'
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { fetchAllLessonResponses, fetchTodayLessonResponses } from "@src/services/lesson.service";

const Dashboard = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [childInfo, setChildInfo] = useState<Child | null>(null);
    const [attemptedQuizes, setAttemptedQuizes] = useState<number>(0);
    const [allAttemptedQuize, setAllAttemptedQuize] = useState<number>(0);

    useEffect(() => {
        const loadChild = async () => {
            const childrens = await fetchChildrenByParent()
            if (childrens.length > 0) {
                const storedChildId = await AsyncStorage.getItem("child_id");
                const child = childrens.find(c => c.id.toString() === storedChildId) || childrens[0];
                setChildInfo(child);

                if (child) {
                    const responses = await fetchTodayLessonResponses(child.id.toString());
                    const allResponses = await fetchAllLessonResponses(child.id.toString());
                    setAttemptedQuizes(responses.length);
                    setAllAttemptedQuize(allResponses.length);
                }
            }
        };
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

            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Banner Section */}
                <View style={styles.bannerCard}>
                    <View style={styles.bannerContent}>
                        <KWText style={styles.bannerText}>
                            Find amazing lessons for your kids
                        </KWText>
                        <Pressable
                            onPress={() => navigation.navigate("lesson")}
                            style={styles.bannerBtn}
                        >
                            <Text style={styles.bannerBtnText}>Find Now</Text>
                        </Pressable>
                    </View>
                    <Image source={brainImg} />
                </View>

                {/* Attempt Quiz */}
                <View style={styles.whiteCard}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.grayText}>Attempted Quizes</Text>
                        <Text style={styles.boldText}>{allAttemptedQuize}</Text>
                    </View>

                    <View style={styles.challengeRow}>
                        <View style={styles.trophyIconWrapper}>
                            <Entypo name="trophy" size={20} color={theme.primary} />
                        </View>
                        <View>
                            <Text style={styles.boldText}>Today's Challenge</Text>
                            <Text style={styles.challengeSub}>Complete {attemptedQuizes} Quiz</Text>
                        </View>
                    </View>
                </View>

                {/* Alphabet Progress */}
                <View style={styles.whiteCard}>
                    <View style={styles.rowBetween}>
                        <View style={styles.row}>
                            <Image source={alphabet} style={styles.alphabetImg} />
                            <Text style={styles.boldText}>Alphabet</Text>
                        </View>
                        <Image source={superman} style={styles.alphabetImg} />
                    </View>

                    <View style={styles.progressBg}>
                        <View style={styles.progressFill} />
                    </View>

                    <Pressable
                        onPress={() => navigation.navigate("lesson")}
                        style={styles.primaryBtn}
                    >
                        <Text style={styles.primaryBtnText}>Find Now</Text>
                    </Pressable>
                </View>

                {/* Learning Modes */}
                <View style={styles.section}>
                    <KWText style={styles.sectionTitle}>Learning Modes</KWText>

                    <Pressable
                        onPress={() => navigation.navigate("stories", { id: 1 })}
                        style={styles.itemCard}
                    >
                        <View style={styles.row}>
                            <View style={[styles.iconBg, styles.greenBg]}>
                                <FontAwesome name="video-camera" size={20} color={theme.darkGreen} />
                            </View>
                            <Text style={styles.itemTitle}>Rhymes</Text>
                        </View>
                        <Entypo name="chevron-thin-right" size={20} color={theme.darkGray} />
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("lesson")}
                        style={styles.itemCard}
                    >
                        <View style={styles.row}>
                            <View style={[styles.iconBg, styles.blueBg]}>
                                <FontAwesome name="tasks" size={20} color={theme.primary} />
                            </View>
                            <Text style={styles.itemTitle}>Quizes</Text>
                        </View>
                        <Entypo name="chevron-thin-right" size={20} color={theme.darkGray} />
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("avatar")}
                        style={styles.itemCard}
                    >
                        <View style={styles.row}>
                            <View style={[styles.iconBg, styles.orangeBg]}>
                                <FontAwesome5 name="user-astronaut" size={20} color="#EA580C" />
                            </View>
                            <Text style={styles.itemTitle}>AI Experience</Text>
                        </View>
                        <Entypo name="chevron-thin-right" size={20} color={theme.darkGray} />
                    </Pressable>
                </View>

                {/* Parent Dashboard */}
                <View style={styles.sectionBottom}>
                    <Pressable
                        onPress={() => navigation.navigate("pin")}
                        style={styles.parentRow}
                    >
                        <View style={styles.row}>
                            <View style={styles.parentIcon}>
                                <FontAwesome6 name="person-chalkboard" size={20} color={theme.white} />
                            </View>
                            <View>
                                <Text style={styles.itemTitle}>Parent Dashboard</Text>
                                <Text style={styles.grayText}>
                                    Track progress & activities
                                </Text>
                            </View>
                        </View>
                        <Entypo name="chevron-thin-right" size={20} color={theme.darkGray} />
                    </Pressable>
                </View>

            </ScrollView>

            <BottomNavBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.secondaryBg },

    scrollViewContent: { flexGrow: 1, paddingBottom: 20 },

    section: { marginBottom: 20, paddingHorizontal: 20 },

    bannerCard: {
        backgroundColor: theme["light-primary"],
        height: 150,
        marginHorizontal: 20,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        marginBottom: 20
    },
    bannerContent: { flex: 1, justifyContent: "center" },
    bannerText: { color: theme.white, fontSize: 20.94, fontWeight: "bold" },
    bannerBtn: {
        marginTop: 10,
        backgroundColor: theme.white,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 100,
        alignSelf: "flex-start"
    },
    bannerBtnText: { color: theme.primary },

    whiteCard: {
        backgroundColor: theme.white,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 15,
        marginBottom: 20
    },

    row: { flexDirection: "row", alignItems: "center", gap: 15 },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    grayText: { color: theme.darkGray, fontSize: 12 },
    boldText: { color: theme.black, fontWeight: "bold", fontSize: 15 },

    challengeRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 15 },

    trophyIconWrapper: {
        minWidth: 35,
        minHeight: 35,
        backgroundColor: theme.skyBlue,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    challengeSub: { color: theme.darkGray, fontSize: 12, marginTop: 3 },

    alphabetImg: { width: 60, height: 60 },

    progressBg: {
        backgroundColor: theme.lightGray,
        height: 8,
        borderRadius: 100,
        marginTop: 20
    },
    progressFill: {
        backgroundColor: theme.primary,
        width: "50%",
        height: "100%",
        borderRadius: 100
    },

    primaryBtn: {
        marginTop: 20,
        backgroundColor: theme.primary,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    primaryBtnText: { color: theme.white },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.black,
        marginBottom: 15
    },

    itemCard: {
        backgroundColor: theme.white,
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    iconBg: { padding: 10, borderRadius: 10 },
    greenBg: { backgroundColor: "#DCFCE7" },
    blueBg: { backgroundColor: "#DBEAFE" },
    orangeBg: { backgroundColor: "#FFEDD5" },

    itemTitle: { color: theme.black, fontWeight: "bold", fontSize: 16 },

    parentRow: {
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    parentIcon: {
        backgroundColor: theme.primary,
        padding: 10,
        borderRadius: 10
    },

    sectionBottom: { marginBottom: 100, paddingHorizontal: 20 }
});

export default Dashboard;
