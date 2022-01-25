import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  // SafeAreaView,
  // Dimensions,
  ScrollView,
  // ScrollViewComponent,
  // FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
// import Carousel from 'react-native-snap-carousel';
import {ProductsContext} from '../context/productContext';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';
import {Picker} from '@react-native-picker/picker';
import useForm from '../hooks/useForm';
import {useCategories} from '../hooks/useCategories';
import LoadingScreen from './LoadingScreen';
import {Image} from 'react-native';
import {styles} from '../Theme/appTheme';
// import ShowButtons from '../components/ShowButtons';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

const ProductScreen = ({route, navigation}: Props) => {
  // const isMounted = useRef(true);
  const {
    loadProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    upLoadImage,
    loadProducts,
  } = useContext(ProductsContext);
  const {isLoading, Category} = useCategories();
  const {id = '', name} = route.params;
  const [tempUri, setTempUri] = useState<string>();
  const [isUpdating, setIsUpdating] = useState(false);
  // const [price, setPrice] = useState<string>('');
  const {_id, categoryId, nombre, img, onChange, form, price, setFormValue} =
    useForm({
      _id: id,
      categoryId: '',
      nombre: name,
      img: '',
      price: '',
    });

  useEffect(() => {
    loadProduct();
    // return () => {
    //   isMounted.current = false;
    // };
  }, []);

  const DeleteProduct = () => {
    Alert.alert('Eliminar', '¿Seguro que quieres eliminar este procducto?', [
      {
        text: 'ok',
        onPress: () => {
          deleteProduct(_id);
          Alert.alert(
            'Archivo eliminado',
            '¡Se ha eliminado el producto satisfactoriamente!',
            [
              {
                text: 'ok',
                onPress: () => {
                  navigation.navigate('ProductsScreen');
                },
              },
            ],
          );
          console.log('producto eliminado');
        },
      },
      {
        text: 'no',
        onPress: () => null,
      },
    ]);
  };
  const loadProduct = async () => {
    if (id?.length === 0) {
      return;
    }
    try {
      const product = await loadProductById(id);

      return setFormValue({
        _id: id,
        categoryId: product.categoria._id,
        nombre: nombre,
        img: product.img || '',
        price: '',
      });
      console.log('cargo el setForm');
    } catch (error) {
      console.log(error);
    }
  };
  const saveOrUpdate = () => {
    if (id.length > 0) {
      updateProduct(categoryId, nombre, id, price);
    } else {
      // if (categoryId.length === 0) {
      //   onChange(Category[0]._id, 'categoryId');
      // }
      const tempCategoryId = categoryId || Category[0]._id;
      addProduct(tempCategoryId, nombre, price);
    }
  };
  const takePhoto = () => {
    launchCamera(
      {cameraType: 'back', mediaType: 'photo', quality: 0.5},
      res => {
        if (res.didCancel) {
          return;
        }
        if (!res.assets?.map(el => el.uri)) {
          return;
        }
        res.assets.map(el => {
          console.log(el.uri);
          setTempUri(el.uri);
          upLoadImage(res, _id);
        });
      },
    );
  };
  const takeImage = () => {
    launchImageLibrary({mediaType: 'mixed', quality: 0.5}, res => {
      if (res.didCancel) {
        return;
      }
      if (!res.assets?.map(el => el.uri)) {
        return;
      }
      res.assets.map(el => {
        console.log(el.uri);
        setTempUri(el.uri);
        upLoadImage(res, _id);
      });
    });
  };
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isUpdating) {
    return <LoadingScreen />;
  }

  return (
    <>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.lable}>
              {nombre ? nombre : 'Nombre del producto'}
            </Text>

            <TextInput
              style={styles.textInput}
              value={nombre}
              onChangeText={value => onChange(value, 'nombre')}
            />
            <Text style={styles.lable}>
              {price ? price + ' USD' : 'precio del producto'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={value => onChange(value, 'price')}
            />

            {/* <Text>{JSON.stringify(form, null, 4)}</Text> */}

            <Text style={styles.lable}>Seleccione la categoria:</Text>
            <Picker
              selectedValue={categoryId}
              onValueChange={value => onChange(value, 'categoryId')}>
              {Category.map(c => {
                return (
                  <Picker.Item label={c.nombre} value={c._id} key={c._id} />
                );
              })}
            </Picker>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => saveOrUpdate()}
                style={{
                  ...styles.buttonContainer,
                  marginTop: 20,
                  marginBottom: 20,
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.textButton}>Guardar </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={async () => {
                  setIsUpdating(true);
                  await DeleteProduct();
                  setIsUpdating(false);
                }}
                style={{
                  ...styles.buttonContainer,
                  marginTop: 20,
                  marginBottom: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.textButton}>Eliminar </Text>
              </TouchableOpacity>
            </View>
            {id.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={takePhoto}
                  style={{...styles.buttonContainer, marginRight: 15}}>
                  <Icon name="camera-outline" color="white" size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takeImage}
                  activeOpacity={0.5}
                  style={{...styles.buttonContainer}}>
                  <Icon name="images-outline" color="white" size={30} />
                </TouchableOpacity>
              </View>
            ) : null}

            {img.length > 0 && !tempUri && (
              <Image
                source={{uri: img}}
                style={{width: '100%', height: 300, marginTop: 20}}
              />
            )}
            {tempUri ? (
              <Image
                source={{uri: tempUri}}
                style={{
                  width: '100%',
                  height: 300,
                  marginTop: 20,
                }}
              />
            ) : null}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ProductScreen;
