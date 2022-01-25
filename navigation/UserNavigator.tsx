import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../src/screens/ProfileScreen';
import SettingScreen from '../src/screens/SettingScreen';

//este stackParams sienmpre lo ponemos para pasarle parametros a otra screen por medio del navigation recuerdalo!!
export type UsuarioStackParams = {
  ProfileScreen: undefined;
  SettingScreen: {
    id?: string | undefined;
    nombre: string | undefined;
    img: string | undefined;
    // uri: string | undefined;
    // newName: string | undefined;
  };
};
const Stack = createStackNavigator<UsuarioStackParams>();

export const UserNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          elevation: 0,
          shadowColor: 'transparent',
        },
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;
