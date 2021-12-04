import {Usuario} from '../interfaces/appInterfaces';

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-autheticated';
  user: Usuario | null;
  token: string | null;
  errorMessage: string;
}

type AuthAction =
  //cuando yo haga un signUp me tiene que mandar un payload con los datos siguientes
  | {type: 'SignIn'; payload: {token: string; user: Usuario}}
  | {type: 'addError'; payload: string} //este addError  lo ponemos para cuando el usuario ponga mal la clave o email mandmaos el alert con el error
  | {type: 'removeError'} //este remove error lo ponemos para cuando el usuario depsues de que vea el alert de error y presione ok  limpiemos la pantalla quitando el alert
  | {type: 'notAuthenticated'} //lo vamos a ejecutar cuando por alguna razon el token falla y no logra autenticar el usuario
  | {type: 'logout'}; // cuando querramos salir y ya

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'addError':
      return {
        ...state,
        user: null,
        token: null,
        errorMessage: action.payload,
      };
    case 'removeError':
      return {
        ...state,
        errorMessage: '',
      };
    case 'SignIn':
      return {
        ...state,
        errorMessage: '',
        status: 'authenticated',
        token: action.payload.token,
        user: action.payload.user,
      };
    // Aqui retornmaos lo msimo en los dos casos ya que devolveria lo mismo
    case 'logout':
    case 'notAuthenticated':
      return {
        ...state,
        status: 'not-autheticated',
        token: null,
        user: null,
      };
    default:
      return state;
  }
};
