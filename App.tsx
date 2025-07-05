import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DefaultScreen from './screens/DefaultScreen';
import { navData } from './constant/navData';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>

        {
          navData?.map((i)=>(
            <Stack.Screen key={i.id} name={i.name} component={i.component} />
          ))
        }


      </Stack.Navigator>
    </NavigationContainer>
  );
}