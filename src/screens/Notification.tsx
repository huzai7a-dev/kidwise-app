import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import KWText from '@src/components/KWText';
import { theme } from '@src/constants/colors';

const notifications = [
    {
        id: '1',
        title: 'New Rhymes Added!',
        description: 'Check out the latest rhymes in the Rhymes section.',
        time: '5 mins ago',
    },
    {
        id: '2',
        title: 'Learning Goal Achieved 🎉',
        description: 'Alex completed 10 learning activities!',
        time: '2 hours ago',
    },
    {
        id: '3',
        title: 'Daily Reminder',
        description: 'Don’t forget to check in for today’s learning session.',
        time: 'Yesterday',
    },
];

const Notification = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={26} color={theme.black} />
                </TouchableOpacity>
                <KWText style={styles.headerTitle}>Notifications</KWText>
                <View style={{ width: 26 }} />
            </View>

            {/* Notifications List */}
            {notifications.map((item) => (
                <View key={item.id} style={styles.card}>
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <KWText style={styles.title}>{item.title}</KWText>
                        <KWText style={styles.time}>{item.time}</KWText>
                    </View>
                    <KWText style={styles.description}>{item.description}</KWText>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 22,
        color: theme.black,
    },
    card: {
        backgroundColor: '#F7F7F7',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.black,
    },
    description: {
        fontSize: 14,
        color: theme.gray,
        marginTop: 5,
    },
    time: {
        fontSize: 12,
        color: theme.gray,
    },
});

export default Notification;
