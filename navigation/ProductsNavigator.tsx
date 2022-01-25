import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProductsScreen} from '../src/screens/ProductsScreen';
import ProductScreen from '../src/screens/ProductScreen';
import SearchScreen from '../src/screens/SearchScreen';
import {AddNewProduct} from '../src/screens/AddNewProduct';
import UserScreen from '../src/screens/UserScreen';
import ArticleScreen from '../src/screens/ArticleScreen';

//este stackParams sienmpre lo ponemos para pasarle parametros a otra screen por medio del navigation recuerdalo!!
export type ProductsStackParams = {
  ProductsScreen: undefined;
  ProductScreen: {
    id?: string | undefined;
    name: string;
  };
  SearchScreen: undefined;
  AddNewProduct: {
    id?: string | undefined;
    name: string;
  };
  UserScreen: {
    id?: string | undefined;
    name: string;
    img: string | undefined;
  };
  ArticleScreen: {
    img: string | undefined;
    id: string | undefined;
    name: string;
    nameSeller: string | undefined;
    imageSeller: string | undefined;
    price: string | undefined;
  };
};
const Stack = createStackNavigator<ProductsStackParams>();

export const ProductsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          elevation: 0,
          shadowColor: 'transparent',
        },
      }}>
      <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="AddNewProduct" component={AddNewProduct} />
      <Stack.Screen name="UserScreen" component={UserScreen} />
      <Stack.Screen name="ArticleScreen" component={ArticleScreen} />
    </Stack.Navigator>
  );
};

export default ProductsNavigator;
