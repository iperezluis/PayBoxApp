import React, {useContext} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from '../src/screens/RegisterScreen';
import LoginScreen from '../src/screens/LoginScreen';
import {AuthContext} from '../src/context/authContext';
import LoadingScreen from '../src/screens/LoadingScreen';
import {MyTabs} from './TabNavigator';
// import ProductsNavigator from './ProductsNavigator';

const Stack = createStackNavigator();

export const Navigator = () => {
  //vamos a renderrizar los screen dependiendo del status
  const {status} = useContext(AuthContext);
  if (status === 'checking') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {status === 'authenticated' ? (
        <Stack.Screen name="TabNavigator" component={MyTabs} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
