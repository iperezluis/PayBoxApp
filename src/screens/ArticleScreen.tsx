import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ArticleScreen'> {}

const ArticleScreen = ({route, navigation}: Props) => {
  const {id, img, name, nameSeller, imageSeller, price} = route.params;
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{top: 30, position: 'absolute', left: 15}}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={35} color="black" />
        </TouchableOpacity>
        <Image
          source={{
            uri: imageSeller
              ? imageSeller
              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            position: 'absolute',
            top: 50,
          }}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: 'black',
            position: 'absolute',
            top: 160,
          }}>
          Vendedor:
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: 'black',
            position: 'absolute',
            top: 180,
          }}>
          {nameSeller}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            position: 'absolute',
            top: 215,
          }}>
          {name}
        </Text>
        <Image
          source={{uri: img}}
          style={{width: '100%', height: 500, marginTop: 250}}
        />
        <Text style={{fontWeight: 'bold', fontSize: 25}}>
          Precio: {price + ' USD'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ArticleScreen;
