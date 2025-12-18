import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '@src/constants/colors';

type IconType = typeof MaterialIcons | typeof FeatherIcon | typeof AntDesignIcon | typeof Foundation | typeof FontAwesome5 | typeof FontAwesome;

type TabItem = {
  link: string;
  name: string;
  icon: string;
  activeIcon?: string;
  size?: number;
  type: IconType;
};

const BottomNavBar: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const tabs: TabItem[] = [
    { link: 'dashboard', name: 'Home', icon: 'home', type: Foundation },
    { link: 'lesson', name: 'Learning', icon: 'book-open', type: FontAwesome5 },
    { link: 'avatar', name: 'Avatar', icon: 'user-astronaut', activeIcon: 'user-astronaut', type: FontAwesome5 },
    { link: 'pin', name: 'Profile', icon: 'user-alt', type: FontAwesome5 },
  ];

  return (
    <View style={[styles.navContainer]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const IconComponent = tab.type;
          const isActive = route.name === tab.link;
          return (
            <TouchableOpacity key={tab.name} style={styles.navItem} onPress={() => navigation.navigate(tab.link as never)}>
              <IconComponent name={isActive ? tab.activeIcon || tab.icon : tab.icon} size={24} color={isActive ? theme.primary : theme.darkGray} />
              <Text style={{ color: isActive ? theme.primary : theme.darkGray, fontSize: 12, marginTop: 4 }}>{tab.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: theme.bg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    marginTop: 0
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default BottomNavBar;
