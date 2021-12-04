import {useState} from 'react';

const useForm = <T extends Object>(initState: T) => {
  const [state, setState] = useState(initState);

  const onChange = (value: string, field: keyof T) => {
    setState({...state, [field]: value});
  };

  const setFormValue = (form: T) => {
    setState({
      ...state,
      ...form,
    });
  };

  return {...state, form: state, onChange, setFormValue};
};

export default useForm;
