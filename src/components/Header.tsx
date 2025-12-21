import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { theme } from "@src/constants/colors";
import KWText from './KWText';
import { AVATARS } from '@src/constants/avatars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
    childName: string;
    avatarIndex?: number
    onProfilePress: () => void;
    onNotificationPress: () => void;
    title?: string
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const Header: React.FC<HeaderProps> = ({ childName, onProfilePress, onNotificationPress, avatarIndex = 1, title }) => {
    const greeting = getGreeting();

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                {
                    title ?
                        <KWText style={styles.greetingText}>{title}</KWText> :
                        <KWText style={styles.greetingText}>{greeting}, {childName}</KWText>

                }
            </View>

            <TouchableOpacity onPress={onProfilePress} style={styles.avatarContainer}>
                <Image source={AVATARS[avatarIndex as keyof typeof AVATARS]} style={styles.avatar} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onNotificationPress} style={styles.iconContainer}>
                <MaterialCommunityIcons name="bell-outline" size={20} color={theme.white} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        paddingTop: 40,
        backgroundColor: theme.bg,
        marginBottom: 20
    },
    avatarContainer: {
        padding: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 15,
        textAlign: "left"
    },
    greetingText: {
        fontSize: 20,
        color: theme.black,
        fontWeight: "800"
    },
    iconContainer: {
        padding: 5,
        backgroundColor: theme.primary,
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Header;
