import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {AuthProvider} from './src/context/authContext';
import {ProductsProvider} from './src/context/productContext';

import {MyTabs} from './navigation/TabNavigator';
import {Navigator} from './navigation/StackNavigator';
import {PermissionProvider} from './src/context/permissionContext';

const AppState = ({children}: any) => {
  return (
    <AuthProvider>
      <PermissionProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </PermissionProvider>
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
