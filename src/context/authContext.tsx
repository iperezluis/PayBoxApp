import React, {useReducer, useState, useEffect, createContext} from 'react';
import {Alert} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import cafeApi from '../api/cafeApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  Usuario,
} from '../interfaces/appInterfaces';

import {authReducer, AuthState} from './authReducer';
import LoadingScreen from '../screens/LoadingScreen';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  userStoraged: string | undefined;
  Usuario: Usuario | undefined;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-autheticated';
  signIn: (registerData: RegisterData) => void;
  signUp: (loginData: LoginData) => void;
  removeError: () => void;
  logout: () => void;
  removeOldName: () => Promise<void>;
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
  const [Usuario, setUsuario] = useState<Usuario>();
  const [userStoraged, setUserStorage] = useState<string>(); //cargamos nuestro token almacenado en caso de que no venga null
  useEffect(() => {
    checkToken();
  }, []);

  //lo mandmaos a chequear si el token almacenado es null hacemos un dispatch de error
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log('token no existe');
      return dispatch({type: 'notAuthenticated'});
    }

    const usuarioStorage = await AsyncStorage.getItem('usuario');
    if (usuarioStorage) {
      JSON.parse(usuarioStorage);
      setUserStorage(usuarioStorage);
      console.log('estos son los datop almacenados hoy' + userStoraged);
      // console.log('estos son los datos del usuario: ' + usuario);
    } else {
      console.log('no se pudo traer lso datos del usuario');
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
    setIsLoading(true);
    try {
      const res = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'SignIn',
        payload: {token: res.data.token, user: res.data.usuario},
      });
      setUsuario(res.data.usuario);
      console.log(
        'este es el nombre del usuario actual' + res.data.usuario.nombre,
      );
      console.log(
        'estos son los datos del usuario actual' +
          JSON.stringify(res.data.usuario),
      );
      // console.log(JSON.stringify(res.data.usuario));
      setIsLoading(false);
      //almacenamos nuestro objeto o token aqui
      await AsyncStorage.setItem('token', res.data.token);
      // await AsyncStorage.setItem('usuario', res.data.usuario);
      await AsyncStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      if (res.status === 500) {
        dispatch({
          type: 'addError',
          payload: 'Hubo un error en la conexion. Falla en la comunicacion',
        });
      }
      // throw new Error();
    } catch (error) {
      if (!correo || !password) {
        setIsLoading(false);
        dispatch({type: 'addError', payload: 'Los campos estan vacios'});
      } else {
        setIsLoading(false);

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
      setUsuario(data.usuario);
      console.log(JSON.stringify(data.usuario));
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('usuario', data.usuario.nombre);
      //despues que enviemos la peticion post,  el jwt va a generar un token y ese token es el que vamos a almacenar en el dispatc
      dispatch({
        type: 'SignIn',
        payload: {token: data.token, user: data.usuario},
      });
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
          await AsyncStorage.removeItem('usuario');
          // await AsyncStorage.removeItem('usuario');
          dispatch({type: 'logout'});
        },
      },
      {text: 'no', onPress: undefined},
    ]);
  };
  const removeOldName = async () => {
    //para ejecutar este remove primero ienes que separar el asynStorage('usuario') en dos unio para el nombre y el otro poara el idy   depsues lo mandas desde el context porque si no al ejecutarlo asi con el usuario te va remover el id y el name y solo queremos remover el old name
    await AsyncStorage.removeItem('usuario');
  };
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <AuthContext.Provider
      value={{
        ...state,
        userStoraged,
        Usuario,
        signIn,
        signUp,
        logout,
        removeError,
        removeOldName,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
