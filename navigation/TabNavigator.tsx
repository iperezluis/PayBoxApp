import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '../src/screens/ProfileScreen';
import ProductsNavigator from './ProductsNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import {AddNewProduct} from '../src/screens/AddNewProduct';

const Tab = createBottomTabNavigator();

export const MyTabs = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{backgroundColor: 'white'}}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#000',
          borderWidth: 0,
          elevation: 0,
          height: 70,
          marginBottom: 0,

          borderTopLeftRadius: 70,
          borderTopRightRadius: 70,
          borderStartWidth: 0,
        },

        tabBarLabelStyle: {bottom: 10},
      }}>
      <Tab.Screen
        name="ProductsNavigator"
        component={ProductsNavigator}
        options={{
          tabBarIcon: () => (
            <Icon name="compass-outline" size={25} color="white" />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="AddNewProduct"
        component={AddNewProduct}
        options={{
          tabBarIcon: () => <Icon name="add-outline" size={25} color="white" />,
          tabBarLabel: 'Add Product',
          tabBarItemStyle: {bottom: 15},
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Icon name="people-outline" size={20} color="white" />
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
