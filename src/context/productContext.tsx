import {useNavigation} from '@react-navigation/core';
import React, {createContext, useEffect, useContext, useState} from 'react';
import {Alert} from 'react-native';
import {ImagePickerResponse} from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import {Producto, ProductResponse} from '../interfaces/appInterfaces';
import {AuthContext} from './authContext';

type ProductsContextProps = {
  Product: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (Id: string) => Promise<void>;
  loadProductById: (Id: string) => Promise<Producto>;
  upLoadImage: (data: any, Id: string) => Promise<void>; // CAMBIAR ANY;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [Product, setProduct] = useState<Producto[]>([]);
  const navigation = useNavigation() as any;
  useEffect(() => {
    loadProducts();
  }, []);
  const loadProducts = async () => {
    const res = await cafeApi.get<ProductResponse>('/productos?limite=50');
    setProduct(res.data.productos);
    console.log(res.data.productos);
  };
  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    console.log(categoryId, productName);

    const res = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProduct([...Product, res.data]);

    return res.data;
  };
  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    console.log(categoryId, productName, productId);
    try {
      const res = await cafeApi.put<Producto>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
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
      Alert.alert('Eliminar', '¿Seguro que quieres eliminar este procducto?', [
        {
          text: 'ok',
          onPress: async () => {
            const res = await cafeApi.delete(`/productos/${Id}`);
            setProduct(
              Product.map(el => {
                return el._id === Id ? res.data : el;
              }),
            );
            navigation.navigate('ProductsScreen');
          },
        },
        {
          text: 'no',
          onPress: () => null,
        },
      ]);
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

  return (
    <ProductsContext.Provider
      value={{
        Product,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        upLoadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
