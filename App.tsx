import 'react-native-gesture-handler';
import React from 'react';
import {Navigator} from './navigation/StackNavigator';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
