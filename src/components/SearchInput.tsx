import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import useDebouncedValue from '../hooks/useDebouncedValue';

interface Props {
  style?: StyleProp<ViewStyle>;
  debounced: (value: string) => void;
}

const SearchInput = ({style, debounced}: Props) => {
  const [textValue, setTextValue] = useState('');
  const {top} = useSafeAreaInsets();

  const {debouncedValue} = useDebouncedValue(textValue, 1500);

  useEffect(() => {
    debounced(debouncedValue);
  }, [debouncedValue]);

  return (
    <>
      <View style={style}>
        <TextInput
          placeholder="search..."
          style={styles.TextInput}
          textAlign="center"
          onChangeText={setTextValue}
          value={textValue}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={{position: 'absolute', right: 15, top: top + 15}}>
        <Icon name="search-outline" color="black" size={30} />
      </View>
    </>
  );
};
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

export default SearchInput;
