import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
  ToastAndroid,
  Text,
} from "react-native";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import KWText from '@src/components/KWText';
import { theme } from '@src/constants/colors';
import { AVATARS } from '@src/constants/avatars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchChildrenByParent } from '@src/services/child.service';
import { Child } from '@src/types/child';

const menuItems = [
  { label: 'Child Profile', icon: 'person-outline', screen: 'update_child_profile' },
  { label: 'Create New Profile', icon: 'child', screen: 'onboarding' },
  { label: 'AI Sessions', icon: 'dependabot', screen: 'ai_sessions' },
  { label: 'Progress History', icon: 'bar-chart-outline', screen: 'progress' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'notification' },
];

const Profile = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const loadChildren = async () => {
    const data = await fetchChildrenByParent();
    setChildren(data);
    const storedChildId = await AsyncStorage.getItem("child_id");
    setSelectedChildId(storedChildId ? Number(storedChildId) : data[0]?.id);
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const switchChild = async (childId: number) => {
    await AsyncStorage.setItem("child_id", String(childId));
    setSelectedChildId(childId);
    ToastAndroid.show("Child profile switched!", ToastAndroid.SHORT);
    setModalVisible(false);
    loadChildren();
  };

  const handleLogout = () => {
    navigation.navigate('login' as never);
  };

  const handleProfileNavigate = async () => {
    const parentId = await AsyncStorage.getItem("user_id");
    navigation.navigate('onboarding', { parentId: parentId, nextRoute: "profile" });
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
        {selectedChildId !== null && children.length > 0 ? (
          <Image
            source={AVATARS[String(children.find(c => c.id === selectedChildId)?.avatar_id || 1) as unknown as keyof typeof AVATARS]}
            style={styles.avatar}
          />
        ) : (
          <Image source={AVATARS[1]} style={styles.avatar} />
        )}
      </View>
      {/* Menu Options */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.screen === "onboarding") handleProfileNavigate();
              else navigation.navigate(item.screen as never);
            }}
          >
            {item.screen === 'ai_sessions' ? (
              <Octicons name={item.icon} size={20} color={theme.primary} />
            ) : item.screen === 'onboarding' ? (
              <FontAwesome name={item.icon} size={20} color={theme.primary} />
            ) : (
              <Icon name={item.icon} size={20} color={theme.primary} />
            )}
            <KWText style={styles.menuText}>{item.label}</KWText>
            <Icon name="chevron-forward-outline" size={20} color={theme.gray} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}

      <View>
        <TouchableOpacity
          style={styles.switchProfileButton}
          onPress={() => setModalVisible(true)}
        >
          <KWText style={styles.switchProfileText}>Switch Profile</KWText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#fff" />
          <KWText style={styles.logoutText}>Logout</KWText>
        </TouchableOpacity>

      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <KWText variant="heading" size={20} style={{ marginBottom: 20 }}>
              Switch Child Profile
            </KWText>

            <FlatList
              data={children}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.childItem,
                    selectedChildId === item.id && styles.selectedChildItem,
                  ]}
                  onPress={() => switchChild(item.id)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Image source={AVATARS[String(item.avatar_id) as unknown as keyof typeof AVATARS]} style={styles.childAvatar} />
                    <KWText style={styles.childName}>{item.full_name}</KWText>
                  </View>
                  {selectedChildId === item.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <KWText style={{ color: "#fff" }}>Close</KWText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.secondaryBg,
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
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  switchProfileButton: {
    marginBottom: 10,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  switchProfileText: {
    color: "#fff",
    fontSize: 16,
  },
  menuList: {
    gap: 10,
    marginBottom: 30,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bg,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    maxHeight: "70%",
  },
  childItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedChildItem: {
    backgroundColor: theme.primary + "20",
    borderRadius: 8,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  childName: {
    fontSize: 16,
  },
  checkmark: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default Profile;
