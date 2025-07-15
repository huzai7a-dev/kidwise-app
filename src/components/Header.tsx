import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { theme } from "@src/constants/colors";
import KWText from './KWText';
import { AVATARS } from '@src/constants/avatars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
    childName: string;
    onProfilePress: () => void;
    onNotificationPress: () => void;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const Header: React.FC<HeaderProps> = ({ childName, onProfilePress, onNotificationPress }) => {
    const greeting = getGreeting();

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <KWText style={styles.greetingText}>{greeting},</KWText>
                <KWText style={styles.childName}>{childName}</KWText>
            </View>

            <TouchableOpacity onPress={onProfilePress} style={styles.avatarContainer}>
                <Image source={AVATARS[1]} style={styles.avatar} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onNotificationPress} style={styles.iconContainer}>
                <MaterialCommunityIcons name="bell-outline" size={26} color={theme.purple} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingTop: 50,
        backgroundColor: theme.bg,
        marginBottom:20
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
    },
    greetingText: {
        fontSize: 19,
        color: theme.gray,
        fontWeight:"600"
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.black,
    },
    iconContainer: {
        padding: 5,
    },
});

export default Header;
