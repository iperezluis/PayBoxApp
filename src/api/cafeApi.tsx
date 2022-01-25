import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//esta direccion Ip aveces varia pendiente por si el Error network
const baseURL = 'http://192.168.0.104:8080/api';

const cafeApi = axios.create({baseURL});

//vamos a usar la propiedad interceptors de axios que es un nmiddlewire
cafeApi.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    //si el token existe vamos  amandar un header general para todas las peticiones que hagamos ya que vamos a necesitar el token para todas las operaciones CRUD
    config.headers!['x-token'] = token;
  } else {
    console.log('token expiró');
  }
  return config;
});

export default cafeApi;
