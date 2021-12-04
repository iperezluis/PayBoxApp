import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  // AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/authContext';
import {ProductsContext} from '../context/productContext';

import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {Producto, ProductResponse} from '../interfaces/appInterfaces';
import cafeApi from '../api/cafeApi';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}
export const ProductsScreen = ({navigation}: Props) => {
  //mandamos a traer nuestro token u objeto almacenado
  const {logout} = useContext(AuthContext);
  const {Product, loadProducts} = useContext(ProductsContext);
  const [Refresh, setRefresh] = useState(false);
  const {top} = useSafeAreaInsets();

  const loadProductsFromBackend = async () => {
    setRefresh(true);
    await loadProducts();
    setRefresh(false);
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
        onPress={logout}>
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
                navigation.navigate('ProductScreen', {
                  id: item._id,
                  name: item.nombre,
                })
              }
              style={{marginTop: 10}}>
              <Text style={{marginHorizontal: 10}}>{item.nombre}</Text>
              {item.img && (
                <Image
                  source={{uri: item.img}}
                  style={{width: '100%', height: 300}}
                />
              )}
              <View style={{flexDirection: 'row', marginHorizontal: 10}}>
                <Text style={{fontSize: 10}}>Publicado por</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                  {' ' + item.usuario.nombre}
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
