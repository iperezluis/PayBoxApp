import React, {useReducer, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {createContext} from 'react';
import cafeApi from '../api/cafeApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  Usuario,
} from '../interfaces/appInterfaces';
import {authReducer, AuthState} from './authReducer';
import {Alert} from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-autheticated';
  signIn: (registerData: RegisterData) => void;
  signUp: (loginData: LoginData) => void;
  removeError: () => void;
  logout: () => void;
};

//el estado inicial de mi aplicacion cuando la abra por primera vez
// cuando el usuario se salga de la app debes m,antener el estado( token, usuario, etc) entonces usa lo mismo de los privilegios Appereance
export const initialState: AuthState = {
  status: 'checking',
  user: null,
  token: null,
  errorMessage: '',
};
export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>();
  //cargamos nuestro token almacenado en caso de que no venga null
  useEffect(() => {
    checkToken();
  }, []);
  //lo mandmaos a chequear si el token almacenado es null hacemos un dispatch de error
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return dispatch({type: 'notAuthenticated'});
    }
    //si el token no es null, validar el token
    const res = await cafeApi.get('/auth');
    //este token tiene validez de 7 dias lo puedes ver en el backEnd y configurarlo hasta donde quieras, en documentacion lo ves
    if (res.status === 200) {
      dispatch({
        type: 'SignIn',
        payload: {token: res.data.token, user: res.data.usuario},
      });
    } else {
      dispatch({type: 'notAuthenticated'});
    }
  };
  const signUp = async ({correo, password}: LoginData) => {
    try {
      setIsLoading(true);
      const {data} = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'SignIn',
        payload: {token: data.token, user: data.usuario},
      });
      setIsLoading(false);
      //almacenamos nuestro objeto o token aqui
      await AsyncStorage.setItem('token', data.token);
      console.log(data);
      // throw new Error();
    } catch (error) {
      if (!correo || !password) {
        dispatch({type: 'addError', payload: 'Los campos estan vacios'});
      } else {
        dispatch({
          type: 'addError',
          payload: 'usuario o password incorrecto',
        });
      }
      console.log(error);
    }
  };
  const signIn = async ({nombre, password, correo}: RegisterData) => {
    try {
      const {data} = await cafeApi.post<RegisterResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });
      await AsyncStorage.setItem('token', data.token);
      //despues que enviemos la peticion post,  el jwt va a generar un token y ese token es el que vamos a almacenar en el dispatc
      dispatch({
        type: 'SignIn',
        payload: {token: data.token, user: data.usuario},
      });
      console.log({nombre, correo, password});
    } catch (error) {
      if (!nombre || !correo || !password) {
        dispatch({type: 'addError', payload: 'Los campos estan vacios'});
      } else {
        dispatch({type: 'addError', payload: 'El usuario ya esta registrado'});
      }

      console.log(error);
    }
  };
  const removeError = () => {
    console.log('listo');
    dispatch({type: 'removeError'});
  };
  const logout = () => {
    Alert.alert('Are you sure do you want log out?', undefined, [
      {
        text: 'ok',
        onPress: async () => {
          //Destruimos el token almacenado
          await AsyncStorage.removeItem('token');
          dispatch({type: 'logout'});
        },
      },
      {text: 'no', onPress: undefined},
    ]);
  };
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <AuthContext.Provider
      value={{
        //aqui desestructuramos todo lo que esta en el state ya que tinee todo lo que nos pide el provider
        ...state,
        signIn,
        signUp,
        logout,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
