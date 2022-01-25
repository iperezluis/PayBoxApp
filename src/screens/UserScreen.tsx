import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProductsContext} from '../context/productContext';

interface Props extends StackScreenProps<ProductsStackParams, 'UserScreen'> {}
const UserScreen = ({route, navigation}: Props) => {
  const {Product} = useContext(ProductsContext);
  const {id, name, img} = route.params;

  return (
    <View style={{flex: 1, alignItems: 'center', marginTop: 60}}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{position: 'absolute', left: 20, top: 0}}
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" color="black" size={40} />
      </TouchableOpacity>

      <Image
        style={{width: 150, height: 150, borderRadius: 100}}
        source={{
          uri: img
            ? img
            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        }}
      />
      <Text style={{fontWeight: 'bold', fontSize: 30, marginTop: 30}}>
        {name}
      </Text>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 30,
            marginHorizontal: 40,
          }}>
          Seguir
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 30,
            marginHorizontal: 40,
          }}>
          Enviar mensaje
        </Text>
      </View>
    </View>
  );
};

export default UserScreen;
