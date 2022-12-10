import 'react-native-gesture-handler';

import React from 'react';
import { Text, View, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Started from "./screens/main/Started";
import Main from "./screens/main/Main";
import {TransitionPresets} from "@react-navigation/stack";


const Stack = createNativeStackNavigator();
export default function App() {

  return (
        <NavigationContainer>
          <Stack.Navigator
              initialRouteName="Started"
                screenOptioms={{
                    animation: 'none'
                  }}
          >
            <Stack.Screen name="Started" options={{headerShown: false,  animation: 'none', ...TransitionPresets.SlideFromRightIOS}} component={Started} />
            <Stack.Screen  name="Main" options={{headerShown: false,  animation: 'none', ...TransitionPresets.SlideFromRightIOS}} component={Main} />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};