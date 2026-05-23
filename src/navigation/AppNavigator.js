import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotesListScreen from '../screens/NotesListScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const modalOptions = {
  presentation: Platform.OS === 'ios' ? 'modal' : 'card',
  animation: 'slide_from_bottom',
  gestureDirection: 'vertical',
  animationMatchesGesture: true,
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen
        name="NoteEditor"
        component={NoteEditorScreen}
        options={modalOptions}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={modalOptions}
      />
    </Stack.Navigator>
  );
}
