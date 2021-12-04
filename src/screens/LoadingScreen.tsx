import React from 'react';
import {View, ActivityIndicator} from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator color="red" size={30} />
    </View>
  );
};

export default LoadingScreen;
