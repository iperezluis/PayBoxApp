import React from 'react';
import {View, Text} from 'react-native';

const BackGround = () => {
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          // zIndex: 999,
          backgroundColor: '#93291E',
          width: '100%',
          height: 220,
          top: -20,
          // left: -40,
          borderBottomRightRadius: 150,
          // transform: [{rotate: '25deg'}, {translateX: -10}, {translateY: -50}],
        }}
      />
      <View
        style={{
          backgroundColor: '#93291E',
          position: 'absolute',
          height: 200,
          // borderTopLeftRadius: 90,
          top: 200,
          width: '100%',
        }}
      />
      <View
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          // zIndex: 999,
          height: 400,
          borderTopLeftRadius: 90,
          top: 200,
          width: '100%',
        }}
      />
    </View>
  );
};

export default BackGround;
