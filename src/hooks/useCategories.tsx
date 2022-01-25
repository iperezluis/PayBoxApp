import {useEffect, useState} from 'react';
import cafeApi from '../api/cafeApi';
import {Categoria, ResponseCategories} from '../interfaces/appInterfaces';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [Category, setCategory] = useState<Categoria[]>([]);

  useEffect(() => {
    getCategories();
  }, []);
  const getCategories = async () => {
    try {
      const res = await cafeApi.get<ResponseCategories>('/categorias');
      setCategory(res.data.categorias);
      setIsLoading(false);
      console.log(res.data.categorias);
      if (res.status !== 200) {
        return;
      }
    } catch (error) {
      throw new Error();
      console.log(error);
    }
  };

  return {
    getCategories,
    Category,
    isLoading,
    setIsLoading,
  };
};
