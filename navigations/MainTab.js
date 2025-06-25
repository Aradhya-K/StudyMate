import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotesScreen from '../screens/NotesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import QuizHomeScreen from '../screens/QuizHomeScreen';
import QueueScreen from '../screens/QueueScreen';

const Tab = createBottomTabNavigator();

export default function MainTab() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator screenOptions  = {{
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Queue" component={QueueScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Quiz" component={QuizHomeScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


