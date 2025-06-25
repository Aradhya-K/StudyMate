import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

import AuthStack from './AuthStack';
import MainTab from './MainTab';
import TimerScreen from '../screens/TimerScreen';
import QuizHomeScreen from '../screens/QuizHomeScreen';
import QuizPlayScreen from '../screens/QuizPlayScreen';
import QuizReviewScreen from '../screens/QuizReviewScreen';
import { lightTheme, darkTheme } from '../themes';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // ✅ Now inside component
  const systemTheme = useColorScheme();

  const selectedTheme =
    theme === 'system'
      ? systemTheme === 'dark'
        ? darkTheme
        : lightTheme
      : theme === 'dark'
      ? darkTheme
      : lightTheme;

  return (
    <NavigationContainer theme={selectedTheme}>
      {userToken ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTab" component={MainTab} />
          <Stack.Screen name="Timer" component={TimerScreen} />
          <Stack.Screen name="Quiz" component={QuizHomeScreen} />
          <Stack.Screen name="QuizPlay" component={QuizPlayScreen} />
          <Stack.Screen name="QuizReview" component={QuizReviewScreen} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

