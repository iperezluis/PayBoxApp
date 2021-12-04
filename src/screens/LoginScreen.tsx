import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import BackGround from '../components/BackGround';
import Logo from '../components/Logo';
import {AuthContext} from '../context/authContext';
import useForm from '../hooks/useForm';
import {styles} from '../Theme/loginTheme';

interface Props extends StackScreenProps<any, 'Login'> {}

const LoginScreen = ({navigation}: Props) => {
  const {onChange, email, password} = useForm({email: '', password: ''});
  const {signUp, removeError, errorMessage} = useContext(AuthContext);

  //cada vez que haga el dispatch dek errorMessage va a cambiar por lo quye esta en el payload por lo tanto voy a lanzar un alert
  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }
    Alert.alert('Error', errorMessage, [
      {text: 'ok', onPress: () => removeError()},
    ]);
  }, [errorMessage]);

  const onLogin = () => {
    console.log({email, password});
    Keyboard.dismiss();
    //aqui mandamos nuestro signin con lso parametros qye necesitamos enviar en la data del la peticios post de axios
    signUp({correo: email, password: password});
  };
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{flex: 1, justifyContent: 'center', marginBottom: 130}}>
            <BackGround />
            <Logo />
            <Text style={[styles.globalMargin, styles.welcomeTitle]}>
              Welcome to PayBox!
            </Text>
            <Text style={[styles.globalMargin, styles.label]}>Login</Text>
            <Text style={[styles.globalMargin, styles.label]}>Email</Text>
            <TextInput
              placeholder="Ingrese su email"
              placeholderTextColor="#000"
              keyboardType="email-address"
              underlineColorAndroid="black"
              style={[styles.globalMargin, styles.styleInput]}
              // onChange TODOLIST
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={value => onChange(value, 'email')}
              value={email}
            />
            <TextInput
              placeholder="******"
              placeholderTextColor="#000"
              // keyboardType="visible-password"
              underlineColorAndroid="black"
              style={[styles.globalMargin, styles.styleInput]}
              // onChange TODOLIST
              // autoCapitalize="none"
              // autoCorrect={false}
              onChangeText={value => onChange(value, 'password')}
              value={password}
              secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.styleButton}
                onPress={() => onLogin()}>
                <Text style={styles.textButton}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.buttonRegister]}>
              <TouchableOpacity onPress={() => navigation.replace('Register')}>
                <Text>Sign in Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

export default LoginScreen;
