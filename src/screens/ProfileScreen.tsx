import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProductsContext} from '../context/productContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import useForm from '../hooks/useForm';
import {AuthContext} from '../context/authContext';
import {StackScreenProps} from '@react-navigation/stack';
import {UsuarioStackParams} from '../../navigation/UserNavigator';
import LoadingScreen from './LoadingScreen';
import {selectContactPhone} from 'react-native-select-contact';
import {PermissionContext} from '../context/permissionContext';
import {CustomSwitch} from '../components/CustomSwitcth';

interface Props extends StackScreenProps<UsuarioStackParams, 'ProfileScreen'> {}

const ProfileScreen = ({navigation}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempUri, setTempUri] = useState<string>();
  const {Usuario, userStoraged} = useContext(AuthContext);
  const {permission, askContactPermission, checkContactPermission} =
    useContext(PermissionContext);
  const {upLoadImageUser, image, newName, updateUser, checkUsuario} =
    useContext(ProductsContext);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [Refresh, setRefresh] = useState<boolean>(false);
  const [number, setNumber] = useState<string>();
  const [isVisibleNumber, setisVisibleNumber] = useState(false);
  const [state, setState] = useState<boolean>(true);

  const user = {
    image: image?.substring(1, 104), //105 total
    nombre: userStoraged?.substr(57, 60).substring(1, 17),
    id: userStoraged?.slice(-27).substring(1, 25),
  };
  useEffect(() => {
    console.log('estos son los datos del userStoraged', userStoraged);
    console.log('esta es la imagen del perfil', image);
  }, []);
  const {_id, _img, newImg, name, setFormValue, form, onChange} = useForm({
    _id: '' || user.id,
    nombre: '' || user.nombre,
    _img: '' || user.image,
    // newImg: Data?.substring(1, 104),
    // name: newName,
  });
  //haciendo el test
  const [uri, setUri] = useState<string | undefined>(newImg);
  //test usuario
  useEffect(() => {
    console.log(JSON.stringify(Usuario));
    console.log('datos almacenados actuales' + userStoraged);
    // console.log('este es el nombre en el perfil ' + Usuario?.nombre);
  }, []);
  useEffect(() => {
    setUri(newImg);
  }, [newImg]);

  const checkData = () => {
    setRefresh(true);
    console.log(newImg?.length);
    // updateUser(usuario.id, newName);
    checkUsuario();
    // loadProducts();
    setRefresh(false);
  };

  // useEffect(() => {
  //   loadDetailUser();
  //   console.log(newImg);
  // }, [name]);

  if (_img?.length === 0) {
    return <LoadingScreen />;
  }
  // const loadDetailUser = () => {
  //   return setFormValue({
  //     _id: usuario.id,
  //     nombre: nombre,
  //     _img: usuario.img,
  //     newImg,
  //     newName: name,
  //   });
  // };

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

          upLoadImageUser(res, _id);
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
              await upLoadImageUser(res, _id);
              setIsLoading(false);
            },
          },
          {text: 'cancel', onPress: () => null},
        ]);
      });
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={Refresh}
          onRefresh={checkData}
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
        {!tempUri && (
          <View
            style={{
              justifyContent: 'center',
              marginTop: 30,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              // source={require('../assets/profile.JPEG')} //local
              source={{
                uri: Usuario?.img
                  ? Usuario.img
                  : _img
                  ? _img
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
              }} //remoto
              style={styles.image}
            />
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={styles.buttonPhoto}
              activeOpacity={0.5}>
              <Icon name="camera-outline" color="white" size={25} />
            </TouchableOpacity>
          </View>
        )}
        {/* este es el loading que carga al subir la imagen */}
        {isLoading && (
          <View style={{top: 90, position: 'absolute', right: 140}}>
            <ActivityIndicator size={20} color="red" />
          </View>
        )}
        {tempUri && (
          <View
            style={{
              justifyContent: 'center',
              marginTop: 30,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={{
                uri: tempUri,
              }}
              style={styles.image}
            />
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={styles.buttonPhoto}
              activeOpacity={0.5}>
              <Icon name="camera-outline" color="white" size={25} />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            marginTop: 30,
            justifyContent: 'flex-start',
          }}>
          {/* <Text style={styles.text}>Name: {newName}</Text> */}
          <Text style={styles.text}>
            Name:{' '}
            {Usuario?.nombre
              ? Usuario.nombre
              : user.nombre
              ? user.nombre
              : 'example'}
          </Text>

          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: 25}}
            onPress={() =>
              navigation.navigate('SettingScreen', {
                id: Usuario?.uid,
                img: _img,
                nombre: Usuario?.nombre
                  ? Usuario.nombre
                  : user.nombre
                  ? user.nombre
                  : '',
                // uri,
                // newName: name,
              })
            }>
            <Icon name="chevron-forward-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.text}>
            Status:{state ? ' Activo' : ' inactivo'}
          </Text>
          <View style={{position: 'absolute', right: 10, top: 75}}>
            <CustomSwitch isOn={true} onChange={value => setState(value)} />
          </View>

          <Text style={styles.text}>{number ? number : 'Add number'}</Text>
          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: 115}}
            onPress={() => setisVisibleNumber(true)}>
            <Icon name="chevron-forward-outline" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.text}>Invita a tus amigos unirse a Paybox</Text>
          <TouchableOpacity
            style={{position: 'absolute', right: 10, top: 160}}
            onPress={() => askContactPermission()}>
            <Icon name="chevron-forward-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* <Text>{JSON.stringify(form, null, 4)}</Text> */}
        {/* <Text>{JSON.stringify(form, null, 4)}</Text> */}
        <Modal
          animationType="slide"
          visible={isVisible}
          //si ponemos el transparent del modal en true se podra ver lo que esta detras del modal y no ocupara toda la vista del screen
          transparent={true}>
          <View
            style={{
              flex: 1,

              // height: 100,
              // width: 100,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                width: '100%',
                height: 200,
                marginTop: 60,
                position: 'absolute',
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.25,
                elevation: 15,
                shadowRadius: 20,
              }}>
              <Text
                style={{
                  position: 'absolute',
                  top: 20,
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                {' '}
                Profile Photo
              </Text>
              <TouchableOpacity
                style={{position: 'absolute', top: 20, left: 10}}
                onPress={() => setIsVisible(false)}>
                <Icon name="chevron-back-outline" size={30} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#93291E',
                  borderRadius: 100,
                  marginRight: 10,
                  padding: 15,
                }}
                onPress={() => {
                  setIsVisible(false);
                  takePhoto();
                }}
                activeOpacity={0.5}>
                <Icon name="camera-outline" color="white" size={30} />
              </TouchableOpacity>
              <Text style={{position: 'absolute', bottom: 40, left: 90}}>
                Camera
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#93291E',
                  borderRadius: 100,
                  marginRight: 10,
                  padding: 15,
                }}
                onPress={() => {
                  setIsVisible(false);
                  takeImage();
                }}
                activeOpacity={0.5}>
                <Icon name="image-outline" color="white" size={30} />
              </TouchableOpacity>
              <Text style={{position: 'absolute', bottom: 40, right: 105}}>
                Galery
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          visible={isVisibleNumber}
          //si ponemos el transparent del modal en true se podra ver lo que esta detras del modal y no ocupara toda la vista del screen
          transparent={true}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                // flexDirection: 'row',
                backgroundColor: 'white',
                width: '100%',
                height: 200,
                marginTop: 60,
                position: 'absolute',
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.25,
                elevation: 15,
                shadowRadius: 20,
              }}>
              {isLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 45,
                  }}>
                  <ActivityIndicator size={25} color="red" />
                </View>
              )}
              <Text
                style={{
                  position: 'absolute',
                  top: 20,
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                {' '}
                Add number
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={{
                    width: 230,
                    height: 40,
                    borderRadius: 5,
                  }}
                  underlineColorAndroid="#000"
                  onChangeText={value => setNumber(value)}
                  value={number}
                />
                <TouchableOpacity
                  onPress={() => {}}
                  activeOpacity={0.5}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: !number ? 'red' : 'green', //TODO debes poner e.target.value con su tipado Event
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginLeft: 5,
                  }}>
                  <Icon name="checkmark-outline" size={30} color="white" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{position: 'absolute', top: 20, left: 10}}
                onPress={() => setisVisibleNumber(false)}>
                <Icon name="chevron-back-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  text: {
    // fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    marginTop: 30,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  buttonPhoto: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: '#93291E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 65,
    top: 80,
  },
});
export default ProfileScreen;
