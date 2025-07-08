import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navData } from '@src/constants/navData';
import type { RootStackParamList } from '@src/types/navigation';
import { useAuth } from '@src/hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { isLoggedIn } = useAuth()

  const screens = navData.filter(screen => isLoggedIn ? screen.isPrivate : !screen.isPrivate);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        {
          screens?.map((i) => (
            <Stack.Screen key={i.id} name={i.name} component={i.component} />
          ))
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}