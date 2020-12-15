import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AddScreen from './screens/AddScreen';
import NotesStack from './screens/NotesStack';
import EditScreen from './screens/EditScreen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none' mode='modal'>
        <Stack.Screen name='Notes Stack' component={NotesStack} />
        <Stack.Screen name='Add Screen' component={AddScreen} />
        <Stack.Screen name='Edit Screen' component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
