import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalPortal } from 'react-native-modals';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();
import RootNavigator from './navigation/Routes';
export default function App() {
  return (
    <NavigationContainer>
      <ModalPortal />
      <RootNavigator />
    </NavigationContainer>
  );
}
