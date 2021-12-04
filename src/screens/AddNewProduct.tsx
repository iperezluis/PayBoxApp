import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
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

interface Props
  extends StackScreenProps<ProductsStackParams, 'AddNewProduct'> {}

export const AddNewProduct = ({route, navigation}: Props) => {
  // const {width} = Dimensions.get('screen');
  const {updateProduct, addProduct} = useContext(ProductsContext);
  const {isLoading, getCategories, Category} = useCategories();
  const [tempUri, setTempUri] = useState<string>();

  //NOTA: En esta screen cambie el "id" por  el "_id" del producto para que pudiera coincidir con el "newproduct._id, _id" y tambien se sustituyo el id por el _id en la funcion saveOrUpdate a diferencia del ProductScreen
  const {_id, categoryId, nombre, img, onChange, form} = useForm({
    _id: '',
    categoryId: '',
    nombre: '',
    img: '',
  });
  const saveOrUpdate = async () => {
    if (_id.length > 0) {
      updateProduct(categoryId, nombre, _id);
      console.log(categoryId, nombre, _id);
    } else {
      // if (categoryId.length === 0) {
      //   onChange(Category[0]._id, 'categoryId');
      // }
      const tempCategoryId = categoryId || Category[0]._id;
      const newProduct = await addProduct(tempCategoryId, nombre);
      onChange(newProduct._id, '_id');
    }
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
      <Text>{JSON.stringify(form, null, 4)}</Text>
    </ScrollView>
  );
};
