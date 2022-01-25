import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {UsuarioStackParams} from '../../navigation/UserNavigator';
import {AuthContext} from '../context/authContext';
import {ProductsContext} from '../context/productContext';
import useForm from '../hooks/useForm';

// NOTA: hacer prueba creando un usuario nuevo a ver que foto y nombres carga
interface Props extends StackScreenProps<UsuarioStackParams, 'SettingScreen'> {}
export default function SettingScreen({route}: Props) {
  const {updateUser, checkUsuario} = useContext(ProductsContext);
  const {removeOldName} = useContext(AuthContext);

  const {id, nombre, img} = route.params;
  // const [style, setStyle] = useState<number>();
  const [isVisible, setIsVisible] = useState(false);
  const [Name, setName] = useState<string>(nombre!);
  const [isLoading, setIsLoading] = useState<boolean>();

  const {form, onChange} = useForm({
    Name: '' || nombre,
  });

  const reviewUser = async () => {
    setIsLoading(true);
    setName(Name);
    await Promise.all([updateUser(id, Name), checkUsuario()]);
    onChange(Name, 'Name');
    setIsLoading(false);
    setIsVisible(false);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <KeyboardAvoidingView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Image
            source={{
              uri: img
                ? img
                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
            }}
            style={{width: '100%', height: 300, marginBottom: 20}}
          />
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 15}}>
              Nombre:
            </Text>
            <TextInput
              onTouchStart={() => setIsVisible(true)} //PON UN MODAL ES MEJOR
              style={{
                width: 230,
                height: 40,
                borderRadius: 5,
              }}
              underlineColorAndroid="#000"
              onChangeText={value => setName(value)}
              value={Name}
            />
          </View>
        </View>
        <Modal
          animationType="slide"
          visible={isVisible}
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
                Edit name
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  style={{
                    width: 230,
                    height: 40,
                    borderRadius: 5,
                  }}
                  underlineColorAndroid="#000"
                  onChangeText={value => setName(value)}
                  value={Name}
                />
                <TouchableOpacity
                  onPress={() => reviewUser()}
                  activeOpacity={0.5}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: !nombre ? 'red' : 'green', //TODO debes poner e.target.value con su tipado Event
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginLeft: 5,
                  }}>
                  <Icon name="checkmark-outline" size={30} color="white" />
                </TouchableOpacity>
              </View>

              {/* <Text>{JSON.stringify(form, null, 4)}</Text> */}

              <TouchableOpacity
                style={{position: 'absolute', top: 20, left: 10}}
                onPress={() => setIsVisible(false)}>
                <Icon name="chevron-back-outline" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
