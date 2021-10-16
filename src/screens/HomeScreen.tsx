import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// const menuItem = [
//   {
//     name: 'Animation 101',
//     icon: 'cube-outline',
//     components: 'Animation101Screen',
//   },
// ];
// const calculatorVector = (a: number, b: number) => {
//   Math.floor(Math.sqrt(Math.pow(a - b, 2) - Math.pow(a + b, 2)));
//   if (a typeof  Number) {
//     console.log('error');
//   }else{}
// };
// calculatorVector(4, 2);
export const HomeScreen = () => {
  return (
    <View>
      <Text>Home</Text>
      <Icon name="start-outline" size={50} color="black" />
    </View>
  );
};
