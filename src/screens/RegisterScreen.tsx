import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BackGround from '../components/BackGround';
import useForm from '../hooks/useForm';
import {styles} from '../Theme/loginTheme';
import {AuthContext} from '../context/authContext';

interface Props extends StackScreenProps<any, 'Register'> {}
const RegisterScreen = ({navigation}: Props) => {
  const {signIn, errorMessage, removeError} = useContext(AuthContext);
  const {onChange, name, email, password} = useForm({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }
    Alert.alert('Error', errorMessage, [
      {text: 'ok', onPress: () => removeError()},
    ]);
  }, [errorMessage]);

  const onRegister = () => {
    console.log({email, password, name});
    Keyboard.dismiss();
    //aqui el nombre, correo y password asi mismo lo escribiste en el backEnd y asi mismo espérará en el response de la peticion en el fronEnd solo que aqui lo estas igualando a name, email y paswwords porque asi lo pusiste en el useForm
    signIn({nombre: name, correo: email, password});
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <BackGround />

          <View style={{flex: 1, justifyContent: 'center', marginBottom: 130}}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{top: 20, position: 'absolute'}}
              onPress={() => navigation.navigate('Login')}>
              <Icon name="chevron-back-outline" size={30} color="white" />
            </TouchableOpacity>

            <View
              style={{
                ...styles.globalMargin,
                justifyContent: 'center',
                alignItems: 'center',
                top: 25,
              }}>
              <Image
                style={{width: 70, height: 70}}
                source={require('../assets/logoPayBox.png')}
              />
            </View>

            <Text
              style={{
                ...styles.globalMargin,
                fontSize: 12,
                color: 'white',
                fontWeight: 'bold',
                top: 30,
              }}>
              "Ser rico no es imposible, solo debes pertenecer a un sistema
              monetario perfecto, y eso somos...
            </Text>
            <Text
              style={{
                ...styles.globalMargin,
                fontSize: 12,
                color: 'white',
                fontWeight: 'bold',
                top: 30,
              }}>
              - PayBox Founder & CEO
            </Text>
            <Text style={[styles.globalMargin, styles.welcomeTitle]}>
              Welcome to PayBox!
            </Text>
            <Text style={[styles.globalMargin, styles.label]}>
              Create a PayBox account now!
            </Text>
            <TextInput
              placeholder="name"
              placeholderTextColor="#000"
              underlineColorAndroid="black"
              style={[styles.globalMargin, styles.styleInput]}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={value => onChange(value, 'name')}
              value={name}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#000"
              keyboardType="email-address"
              underlineColorAndroid="black"
              style={[styles.globalMargin, styles.styleInput]}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={value => onChange(value, 'email')}
              value={email}
            />
            <TextInput
              placeholder="******"
              placeholderTextColor="#000"
              underlineColorAndroid="black"
              style={[styles.globalMargin, styles.styleInput]}
              onChangeText={value => onChange(value, 'password')}
              value={password}
              secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.styleButton}
                onPress={() => onRegister()}>
                <Text style={styles.textButton}>Register </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.buttonRegister]}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => navigation.replace('Login')}>
                <Text style={{fontSize: 10}}>
                  ¿Do you have already account?
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'red',
                  }}>
                  Login Here!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default RegisterScreen;
