import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Pressable,
    TextInput,
    TouchableOpacity,
    Keyboard,
    KeyboardEvent
} from "react-native";
import { theme } from "@src/constants/colors";
import { askAI, getSessionDetails } from "@src/services/sessions.service";
import { SessionMessage } from "@src/types/session";
import avatar from "@assets/avatar.png";
import Entypo from "react-native-vector-icons/Entypo";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SessionDetailScreen = ({
    route,
}: {
    route: { params: { sessionId: string } };
}) => {
    const { sessionId } = route.params;
    const [messages, setMessages] = useState<SessionMessage[]>([]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp<any>>();
    const flatListRef = useRef<FlatList>(null);

    const fetchMessages = async () => {
        try {
            const res = await getSessionDetails(sessionId);
            setMessages(res.messages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const sendQuery = async () => {
        if (!input.trim()) return;

        setLoading(true);

        try {
            const parentId = await AsyncStorage.getItem("user_id");
            const childId = await AsyncStorage.getItem("child_id");

            const userMessage: SessionMessage = {
                role: "user",
                content: input,
                created_at: new Date().toISOString()
            };
            setMessages((prev) => [...prev, userMessage]);
            setInput("");
            flatListRef.current?.scrollToEnd({ animated: true });

            const aiMessageIndex = messages.length + 1;
            setMessages((prev) => [
                ...prev,
                { role: "assistant" as const, content: "", created_at: new Date().toISOString() },
            ]);
            flatListRef.current?.scrollToEnd({ animated: true });
            const answer = await askAI(parentId!, childId!, input);
            let i = 0;
            const interval = setInterval(() => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[aiMessageIndex].content = answer.slice(0, i + 1);
                    return updated;
                });
                i++;
                flatListRef.current?.scrollToEnd({ animated: true });
                if (i >= answer.length) clearInterval(interval);
            }, 40);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
            setKeyboardHeight(e.endCoordinates.height + 40);
        });
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <View style={styles.container} >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image source={avatar} style={styles.avatar} />
                    <View>
                        <Text style={styles.kidWiseText}>
                            Kid <Text style={styles.primaryText}>Wise</Text>
                        </Text>
                        <View style={styles.statusRow}>
                            <View style={styles.statusDot}></View>
                            <Text style={styles.statusText}>Online</Text>
                        </View>
                    </View>
                </View>
                <Pressable onPress={() => navigation.goBack()}>
                    <Entypo name="cross" size={20} color={theme.black} />
                </Pressable>
            </View>

            {/* Messages */}
            <View style={styles.messagesWrapper}>
                <FlatList
                    ref={flatListRef}
                    contentContainerStyle={styles.messagesContainer}
                    data={messages}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.msgBubble,
                                item.role === "assistant" ? styles.assistant : styles.user,
                            ]}
                        >
                            <Text
                                style={
                                    item.role === "assistant" ? styles.assistantText : styles.userText
                                }
                            >
                                {item.content}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

            {/* Input Field */}
            <View style={[
                styles.inputContainer,
                { marginBottom: keyboardHeight },
            ]}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type your message..."
                    style={styles.input}
                    multiline
                    placeholderTextColor={theme.darkGray}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendQuery}
                    disabled={loading}
                >
                    <Entypo name="paper-plane" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SessionDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.secondaryBg,
    },
    header: {
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    avatar: {
        height: 68,
        width: 68,
    },
    kidWiseText: {
        color: theme.black,
        fontSize: 14,
        fontWeight: "700",
    },
    primaryText: {
        color: theme.primary,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 3,
    },
    statusDot: {
        backgroundColor: theme.green,
        width: 6,
        height: 6,
        borderRadius: 100,
    },
    statusText: {
        color: theme.black,
    },
    messagesWrapper: {
        flex: 1,
    },
    messagesContainer: {
        padding: 20,
    },
    msgBubble: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: "80%",
    },
    assistant: {
        alignSelf: "flex-start",
        backgroundColor: theme.white,
    },
    user: {
        alignSelf: "flex-end",
        backgroundColor: theme.primary,
    },
    assistantText: {
        color: theme.black,
    },
    userText: {
        color: theme.white,
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: theme.secondaryBg,
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: theme.white,
        borderRadius: 25,
        paddingHorizontal: 25,
        paddingVertical: 10,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: theme.gray,
        color: theme.black
    },
    sendButton: {
        backgroundColor: theme.primary,
        padding: 12,
        borderRadius: 25,
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
