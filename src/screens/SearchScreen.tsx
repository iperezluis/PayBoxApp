import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import {ProductsContext} from '../context/productContext';
import {Usuario} from '../interfaces/appInterfaces';
import SearchInput from '../components/SearchInput';

interface Props extends StackScreenProps<ProductsStackParams, 'SearchScreen'> {}
const SearchScreen = ({navigation}: Props) => {
  const {top} = useSafeAreaInsets();
  const {users} = useContext(ProductsContext);
  const {width} = Dimensions.get('screen');
  const [Term, setTerm] = useState<string>('');
  const [userFiltered, setUserFiltered] = useState<Usuario[]>([]);

  useEffect(() => {
    if (Term?.length === 0) {
      return;
    }
    //filtramos por nombre
    if (isNaN(Number(Term))) {
      return setUserFiltered(
        users.filter(user =>
          user.nombre.toLowerCase().includes(Term?.toLowerCase()),
        ),
      );
    }
  }, [Term]);

  return (
    // <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{position: 'absolute', top: top + 10}}
        activeOpacity={0.5}
        onPress={() => navigation.goBack()}>
        <Icon name="chevron-back-outline" color="black" size={40} />
      </TouchableOpacity>
      <SearchInput
        debounced={value => setTerm(value)}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          top: top + 10,
          width: width,
        }}
      />
      <View>
        <FlatList
          //ponemos en la data del flatList el arreglo vacio para que no aparezca nada en la pantalla yel simplePokemonList solo lo vamos a mostar con el filtro
          data={userFiltered}
          keyExtractor={item => item.uid.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('UserScreen', {
                  id: item.uid,
                  name: item.nombre,
                  img: item.img,
                })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Image
                  source={{
                    uri: item.img
                      ? item.img
                      : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                  }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 100,
                    marginLeft: 20,
                  }}
                />
                <Text style={{marginHorizontal: 20, fontSize: 20}}>
                  {item.nombre}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={1}
          ListHeaderComponent={
            <Text
              style={{
                top: top + 60,
                marginBottom: top + 60,
                fontWeight: 'bold',
                fontSize: 25,
                marginHorizontal: 15,
              }}>
              {Term}
            </Text>
          }
          ListFooterComponent={<Text>{'    '}</Text>}
          ListFooterComponentStyle={{marginBottom: 100}}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* <View>
          <Text>{JSON.stringify(users, null, 4)}</Text>
        </View> */}
    </View>
    // </ScrollView>
  );
};

export default SearchScreen;
