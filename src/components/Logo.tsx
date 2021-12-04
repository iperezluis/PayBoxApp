import React from 'react';
import {View, Text, Image} from 'react-native';

const Logo = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <Image
        style={{
          width: 120,
          height: 120,
          resizeMode: 'center',
          top: 40,
          // position: 'absolute',
        }}
        source={require('../assets/logoPayBox.png')}
      />
    </View>
  );
};

export default Logo;
