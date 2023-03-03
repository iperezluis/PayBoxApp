import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProductsStackParams} from '../../navigation/ProductsNavigator';

import {Picker} from '@react-native-picker/picker';
import {useCategories} from '../hooks/useCategories';
import LoadingScreen from './LoadingScreen';
import useForm from '../hooks/useForm';
import {styles} from '../Theme/appTheme';
// import ShowButtons from '../components/ShowButtons';
import {ProductsContext} from '../context/productContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'AddNewProduct'> {}

export const AddNewProduct = ({route, navigation}: Props) => {
  // const {width} = Dimensions.get('screen');
  const {updateProduct, addProduct, upLoadImage, loadProducts} =
    useContext(ProductsContext);
  const {isLoading, getCategories, Category, setIsLoading} = useCategories();
  const [tempUri, setTempUri] = useState<string>();
  const [Refresh, setRefresh] = useState<boolean>(false);
  //NOTA: En esta screen cambie el "id" por  el "_id" del producto para que pudiera coincidir con el "newproduct._id, _id" y tambien se sustituyo el id por el _id en la funcion saveOrUpdate a diferencia del ProductScreen
  const {_id, categoryId, nombre, img, onChange, setFormValue, price, form} =
    useForm({
      _id: '',
      categoryId: '',
      nombre: '',
      img: '',
      price: '',
    });

  const resetForm = () => {
    setRefresh(true);
    setFormValue({_id: '', img: '', nombre: '', categoryId: '', price: ''});
    // setTempUri('');
    setRefresh(false);
  };

  const saveOrUpdate = async () => {
    if (_id.length > 0) {
      updateProduct(categoryId, nombre, _id, price);
      console.log(categoryId, nombre, _id);
    } else {
      // if (categoryId.length === 0) {
      //   onChange(Category[0]._id, 'categoryId');
      // }
      // setIsLoading(true);
      const tempCategoryId = categoryId || Category[0]._id;
      const newProduct = await addProduct(tempCategoryId, nombre, price);
      onChange(newProduct._id, '_id');
      // setIsLoading(false);
    }
  };
  const takePhoto = () => {
    launchCamera(
      {
        cameraType: 'back',
        mediaType: 'photo',
        quality: 0.5,
        saveToPhotos: true,
      },
      res => {
        if (res.didCancel) {
          return;
        }
        if (!res.assets?.map(el => el.uri)) {
          return;
        }
        res.assets.map(el => {
          console.log(el.uri);

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
        Alert.alert('save image', 'are you sure?', [
          {
            text: 'ok',
            onPress: async () => {
              setIsLoading(true);
              await upLoadImage(res, _id);
              await loadProducts();
              setIsLoading(false);
              resetForm();
            },
          },
          {text: 'cancel', onPress: () => null},
        ]);
      });
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Nuevo producto',
      headerShown: true,
      headerTitleAlign: 'center',
    });
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={Refresh}
          onRefresh={resetForm}
          progressViewOffset={10}
          progressBackgroundColor={'white'}
          colors={['red', 'white', 'yellow', 'green']}
          //de aqui para abajo funcionan solo en ios
          style={{backgroundColor: '#FFFF05'}}
          title="Refreshing"
          tintColor="white"
          titleColor="white"
        />
      }>
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
          {price ? price + ' USD' : 'Precio del producto'}
        </Text>
        <TextInput
          keyboardType="numeric"
          style={styles.textInput}
          value={price}
          onChangeText={value => onChange(value, 'price')}
        />
        <Text style={styles.lable}>Seleccione la categoria:</Text>
        <Picker
          selectedValue={categoryId}
          onValueChange={value => onChange(value, 'categoryId')}>
          {Category.map((c, i) => {
            return <Picker.Item label={c.nombre} value={c._id} key={i} />;
          })}
        </Picker>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => saveOrUpdate()}
            style={{
              ...styles.buttonContainer,
              marginTop: 20,
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.textButton}>Guardar </Text>
          </TouchableOpacity>
        </View>
        {_id.length > 0 && (
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
        )}

        {tempUri && (
          <Image source={{uri: tempUri}} style={{width: '100%', height: 300}} />
        )}
      </View>
      {/* <Text>{JSON.stringify(form, null, 4)}</Text> */}
    </ScrollView>
  );
};
