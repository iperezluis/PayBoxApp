import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  // AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/authContext';
import {ProductsContext} from '../context/productContext';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Usuario} from '../interfaces/appInterfaces';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}
export const ProductsScreen = ({navigation}: Props) => {
  //mandamos a traer nuestro token u objeto almacenado
  const {logout, userStoraged} = useContext(AuthContext);
  const {Product, loadProducts, loadUsers, image, users, removeStorage} =
    useContext(ProductsContext);
  const [Refresh, setRefresh] = useState(false);
  const {top} = useSafeAreaInsets();
  // const [imgUser, setImgUser] = useState<Usuario>();

  //vamos a pasar los ultimso productos comoi primeros
  const loadProductsFromBackend = async () => {
    setRefresh(true);
    await Promise.all([loadProducts, loadUsers]);
    setRefresh(false);
  };
  //my uid
  const id = userStoraged?.slice(-27).substring(1, 25);
  //my profile image
  const imageProfile = image?.substring(1, 104); //105 total

  //esta funcion la cree para que cuando toque la imagen lo lleve al screen de editar product si el producto lo creo  el usuario de lo ocntrario lo lleva al screen del producto del seller
  const viewArticle = (
    myId: string | undefined,
    idSeller: string,
    idProduct: string | undefined,
    imageProduct: string | undefined,
    nameProduct: string,
    nameSeller: string | undefined,
    imageSeller: string | undefined,
    price: string | undefined,
  ) => {
    if (myId !== idSeller) {
      navigation.navigate('ArticleScreen', {
        id: idProduct,
        img: imageProduct,
        name: nameProduct,
        nameSeller: nameSeller,
        imageSeller: imageSeller,
        price: price,
      });
    } else {
      navigation.navigate('ProductScreen', {id: idProduct, name: nameProduct});
    }
  };
  return (
    <>
      {/* <Image source={require('../assets')} /> */}

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate('SearchScreen')}
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: top + 10,
          marginHorizontal: 10,
        }}>
        <Icon name="search-outline" color="black" size={30} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        style={{...styles.logout, top: top + 5}}
        onPress={() => {
          logout();
          removeStorage();
        }}>
        <Icon name="log-out-outline" color="black" size={40} />
      </TouchableOpacity>

      <View style={{top: 60}}>
        <FlatList
          data={Product}
          keyExtractor={({_id}) => _id}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                viewArticle(
                  id,
                  item.usuario._id,
                  item._id,
                  item.img,
                  item.nombre,
                  item.usuario.nombre,
                  item.usuario.usuario?.img,
                  item.precio,
                )
              }
              style={{marginTop: 10}}>
              <Text style={{marginHorizontal: 10}}>{item.nombre}</Text>
              {item.img && (
                <Image
                  source={{uri: item.img}}
                  style={{width: '100%', height: 300}}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Image
                  source={{
                    uri:
                      id === item.usuario._id
                        ? imageProfile
                        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    marginRight: 5,
                  }}
                />
                <Text style={{fontSize: 10}}>Publicado por </Text>
                {/* <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                    {!usuario.newName ? usuario.nombre : usuario.newName}
                  </Text> */}
                <Text
                  style={{fontSize: 10, fontWeight: 'bold', marginRight: 5}}>
                  {item.usuario.nombre}
                </Text>
                <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                  Desde: {' ' + item.precio}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <Text style={{color: 'black'}}>
              ___________________________________________
            </Text>
          )}
          ListFooterComponentStyle={{marginBottom: 140, alignItems: 'center'}}
          ListFooterComponent={
            <Text>
              _____________________________________________________________________
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={Refresh}
              onRefresh={loadProductsFromBackend}
              progressViewOffset={10}
              progressBackgroundColor={'white'}
              colors={['red', 'white', 'yellow', 'green']}
              //de aqui para abajo funcionan solo en ios
              style={{backgroundColor: '#FFFF05'}}
              title="Refreshing"
              tintColor="white"
              titleColor="white"
            />
          }
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    // top: 10,
  },
  title: {
    marginBottom: 20,
    fontSize: 15,
  },
  logout: {
    position: 'absolute',
    right: 10,
  },
});
