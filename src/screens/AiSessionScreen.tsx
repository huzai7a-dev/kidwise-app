import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { theme } from '@src/constants/colors';
import { getSessionsByChild } from '@src/services/sessions.service';
import { Child } from '@src/types/child';
import { fetchChildrenByParent } from '@src/services/child.service';
import Header from '@src/components/Header';
import { Session } from '@src/types/session';
import BottomNavBar from '@src/components/BottomNavbar';

const AiSessionScreen = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [childInfo, setChildInfo] = useState<Child | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchSessions = async () => {
    try {
      const childId = await AsyncStorage.getItem('child_id');
      if (childId) {
        const data = await getSessionsByChild(childId);
        setSessions(data.sessions);
      }
    } catch (err) { }
  };

  const loadChild = async () => {
    const childrens = await fetchChildrenByParent();
    if (childrens.length > 0) {
      const storedChildId = await AsyncStorage.getItem('child_id');
      setChildInfo(
        childrens.find(child => child.id.toString() === storedChildId) ||
        childrens[0],
      );
    }
  };

  useEffect(() => {
    loadChild();
    fetchSessions();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        avatarIndex={childInfo?.avatar_id || 1}
        childName={childInfo?.full_name || 'Child'}
        onProfilePress={() => navigation.navigate('pin')}
        onNotificationPress={() => navigation.navigate('notification')}
        title={`Sessions History ( ${childInfo?.full_name})`}
      />

      <View style={{ paddingHorizontal: 25 }}>
        <FlatList
          data={sessions}
          keyExtractor={item => item?.session_id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('session_detail', {
                  sessionId: item.session_id,
                })
              }
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} >
                <Text style={styles.title}>Session:</Text>
                <Text style={styles.sessionId}>{index + 1}</Text>
              </View>
              <Text style={styles.meta}>
                Started: {new Date(item.started_at).toLocaleString()}
              </Text>
              <Text style={styles.meta}>Total Messages: {item.message_count}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <BottomNavBar />
    </View>
  );
};

export default AiSessionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondaryBg,
  },
  header: {
    color: theme.black,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  card: {
    backgroundColor: theme.white,
    padding: 18,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.lightGray,
  },
  title: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  sessionId: {
    fontSize: 16,
    color: theme.black,
  },
  meta: {
    fontSize: 12,
    marginTop: 6,
    color: theme.black,
  },
});
