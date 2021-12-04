import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'SearchScreen'> {}
const SearchScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const {width} = Dimensions.get('screen');
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{position: 'absolute', top: top + 10}}
        activeOpacity={0.5}
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" color="black" size={40} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          top: top + 10,
          width: width,
        }}>
        <TextInput
          placeholder="search..."
          style={styles.TextInput}
          textAlign="center"
        />
      </View>
      <View style={{position: 'absolute', right: 15, top: top + 15}}>
        <Icon name="search-outline" color="black" size={30} />
      </View>
    </View>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  TextInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    width: 190,
    height: 45,
    // justifyContent: 'center',
    // position: 'absolute',
  },
});
