import React, {useEffect, useState} from 'react';

const useDebouncedValue = (input: string = '', time: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(input);
    }, time);
    return () => {
      //con esto limpiamos la peticion anterior ya que el setTimeout se va a disparar cada vez que haya un cambio en el input a los 1500 sg
      clearTimeout(timeout);
    };
  }, [input]);

  return {debouncedValue};
};

export default useDebouncedValue;
