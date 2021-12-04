import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {AuthProvider} from './src/context/authContext';
import {ProductsProvider} from './src/context/productContext';

import {MyTabs} from './navigation/TabNavigator';
import {Navigator} from './navigation/StackNavigator';

const AppState = ({children}: any) => {
  return (
    <AuthProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </AuthProvider>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
}
