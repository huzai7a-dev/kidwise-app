import React, { useRef } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import KWText from '@src/components/KWText';

const CategoryCard = ({ item }: { item: { title: string; icon: string; color: string } }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => console.log('Category pressed:', item.title)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={{ marginRight: 15 }}
    >
      <Animated.View
        style={{
          width: 150,
          height: 150,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: item.color,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <KWText style={{ fontSize:25, marginBottom: 10 }}>{item.icon}</KWText>
        <KWText style={{ fontSize: 14, fontWeight: '600', color: '#FFF', textAlign: 'center' }}>
          {item.title}
        </KWText>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
