import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

type IconType = typeof MaterialIcons | typeof FeatherIcon | typeof AntDesignIcon;

type TabItem = {
  link: string;
  name: string;
  icon: string;
  activeIcon?: string;
  size?: number;
  type: IconType;
};

const BottomNavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();

  const tabs: TabItem[] = [
    { link: 'dashboard', name: 'Home', icon: 'home', type: AntDesignIcon },
    { link: 'Categories', name: 'Categories', icon: 'grid-view', type: MaterialIcons },
    { link: 'Add', name: 'Add', icon: 'pluscircleo', activeIcon: 'pluscircle', type: AntDesignIcon, size: 30 },
    { link: 'Calendar', name: 'Calendar', icon: 'calendar', type: FeatherIcon },
    { link: 'profile', name: 'Profile', icon: 'user', type: FeatherIcon },
  ];

  return (
    <View style={[styles.navContainer, { paddingBottom: insets.bottom }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const IconComponent = tab.type;
          const isActive = route.name === tab.link;
          return (
            <TouchableOpacity key={tab.name} style={styles.navItem} onPress={() => navigation.navigate(tab.link as never)}>
              <IconComponent
                name={isActive ? tab.activeIcon || tab.icon : tab.icon}
                size={tab.size || 24}
                color={isActive ? '#FFA500' : 'gray'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default BottomNavBar;
