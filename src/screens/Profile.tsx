import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import KWText from '@src/components/KWText';
import { theme } from '@src/constants/colors';
import { AVATARS } from '@src/constants/avatars';

const menuItems = [
  { label: 'Child Profile', icon: 'person-outline', screen: 'child_profile' },
  { label: 'AI Prompt', icon: 'chatbubble-ellipses-outline', screen: 'ai_prompt' },
  { label: 'Voice History', icon: 'call-outline', screen: 'history' },
  { label: 'Progress History', icon: 'bar-chart-outline', screen: 'progress' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'notification' },
  { label: 'Report a Problem', icon: 'bug-outline', screen: 'report_problem' },
  { label: 'Parent Tips', icon: 'bulb-outline', screen: 'parent_tips' },
  { label: 'Learning Schedule', icon: 'calendar-outline', screen: 'schedule' },
  { label: 'Rewards', icon: 'gift-outline', screen: 'rewards' },
];

const Profile = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} color={theme.black} />
        </TouchableOpacity>
        <KWText style={styles.headerTitle}>Profile</KWText>
        <View style={{ width: 26 }} />
      </View>

      {/* Avatar and Name */}
      <View style={styles.profileSection}>
        <Image source={AVATARS[1]} style={styles.avatar} />
      </View>

      {/* Menu Options */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen as never)}
          >
            <Icon name={item.icon} size={20} color={theme.purple} />
            <KWText style={styles.menuText}>{item.label}</KWText>
            <Icon name="chevron-forward-outline" size={20} color={theme.gray} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <KWText style={styles.logoutText}>Logout</KWText>
      </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  menuList: {
    gap: 10,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  menuText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    color: theme.black,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: theme.red,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Profile;
