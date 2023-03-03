import React, {createContext, useEffect, useState} from 'react';

import {ImagePickerResponse} from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import {
  GetUsuarios,
  Producto,
  ProductResponse,
  Usuario,
} from '../interfaces/appInterfaces';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Usuario, Usuarios, ProductResponse } from '../interfaces/appInterfaces';

type ProductsContextProps = {
  image: string | undefined;
  users: Usuario[];
  newName: string | undefined;
  Product: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (
    categoryId: string,
    productName: string,
    price: string,
  ) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
    price: string,
  ) => Promise<void>;
  deleteProduct: (Id: string) => Promise<void>;
  loadProductById: (Id: string) => Promise<Producto>;
  upLoadImage: (data: any, Id: string) => Promise<void>; // CAMBIAR ANY;
  upLoadImageUser: (
    data: ImagePickerResponse,
    Id: string | undefined,
  ) => Promise<void>;
  updateUser: (
    Id: string | undefined,
    name: string | undefined,
  ) => Promise<void>;
  checkUsuario: () => Promise<void>;
  loadUsers: () => Promise<void>;
  removeStorage: () => Promise<void>;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [image, setImage] = useState<string>();
  const [newName, setNewname] = useState<string>();
  const [Product, setProduct] = useState<Producto[]>([]);
  // const navigation = useNavigation() as any;
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  // TO DO quitar ese checkusuario y mandar a llamar la database desde aca ewl conetxt
  useEffect(() => {
    checkUsuario();
  }, []);
  useEffect(() => {
    loadUsers();
  }, []);

  const checkUsuario = async () => {
    try {
      const imageStorage = await AsyncStorage.getItem('image');
      const nuevoNombre = await AsyncStorage.getItem('nuevonombre');
      if (nuevoNombre) {
        JSON.parse(nuevoNombre);
        setNewname(nuevoNombre);
        console.log('este es el nombre almacenado: ' + nuevoNombre);
      }
      if (imageStorage) {
        JSON.parse(imageStorage);
        setImage(imageStorage);
        console.log('esta es la imagen que se acaba de almacenar: ' + image);
      } else {
        console.log('no se encontro la imagen');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await cafeApi.get<ProductResponse>('/productos?limite=50');
      setProduct(res.data.productos);
      SplashScreen.hide();
      console.log(res.data.productos);
    } catch (error) {
      console.log(error);
    }
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
    price: string,
  ): Promise<Producto> => {
    console.log(categoryId, productName);

    const res = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
      precio: price,
    });
    setProduct([...Product, res.data]);

    return res.data;
  };
  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
    price: string,
  ) => {
    console.log(categoryId, productName, productId);
    try {
      const res = await cafeApi.put<Producto>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
        precio: price,
      });
      setProduct(
        Product.map(el => {
          return el._id === productId ? res.data : el;
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };
  const deleteProduct = async (Id: string) => {
    try {
      const res = await cafeApi.delete<ProductResponse>(`/productos/${Id}`);
      // setProduct(res.data.productos);
      setProduct(
        Product.filter(product => {
          const newList = product._id !== Id;
          return newList;
        }),
      );
    } catch (error) {
      const token = await cafeApi.get('/auth');
      if (token) {
        console.log(' token existe');
      } else {
        console.log('token vencido');
      }
      console.log(error);
    }
  };
  const loadProductById = async (Id: string): Promise<Producto> => {
    const res = await cafeApi.get<Producto>(`/productos/${Id}`);

    return res.data;
  };
  const upLoadImage = async (data: ImagePickerResponse, Id: string) => {
    let formData;
    data.assets?.map(el => {
      const fileToUpload = {
        uri: el.uri,
        type: el.type,
        name: el.fileName,
      };
      formData = new FormData();
      formData.append('archivo', fileToUpload);
    });
    try {
      const res = await cafeApi.put(`/uploads/productos/${Id}`, formData);
    } catch (error) {
      console.log({error});
    }
  };
  const upLoadImageUser = async (
    data: ImagePickerResponse,
    Id: string | undefined,
  ) => {
    let formData;
    data.assets?.map(el => {
      const fileToUpload = {
        uri: el.uri,
        type: el.type,
        name: el.fileName,
      };
      formData = new FormData();
      formData.append('archivo', fileToUpload);
    });
    try {
      const res = await cafeApi.put<Usuario>(
        `/uploads/usuarios/${Id}`,
        formData,
      );
      // setData(res.data.img);
      await AsyncStorage.setItem('image', JSON.stringify(res.data.img));
      console.log(
        'esta es la imagen que se acaba de actualizar: ' + res.data.img,
      );
    } catch (error) {
      console.log({error});
    }
  };
  const updateUser = async (
    Id: string | undefined,
    name: string | undefined,
  ) => {
    try {
      const res = await cafeApi.put<Usuario>(`/usuarios/${Id}`, {
        id_: Id,
        nombre: name,
      });
      setNewname(res.data.nombre);
      console.log('este es el nuevo nombre' + res.data.nombre);
      AsyncStorage.setItem('nuevonombre', res.data.nombre);
    } catch (error) {
      console.log(error);
    }
  };
  const loadUsers = async () => {
    try {
      const res = await cafeApi.get<GetUsuarios>('/usuarios?limite=50');
      setUsers(res.data.usuarios);
      console.log(res.data.usuarios);
    } catch (error) {
      console.log(error);
    }
  };
  const removeStorage = async () => {
    await AsyncStorage.removeItem('image');
    await AsyncStorage.removeItem('nombre');
  };
  return (
    <ProductsContext.Provider
      value={{
        image,
        newName,
        Product,
        users,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        upLoadImage,
        upLoadImageUser,
        updateUser,
        checkUsuario,
        loadUsers,
        removeStorage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
