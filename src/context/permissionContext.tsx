import React, {useEffect, useState} from 'react';

import {createContext} from 'react';
import {AppState, Platform} from 'react-native';
import {
  check,
  openSettings,
  PermissionStatus,
  request,
} from 'react-native-permissions';
import {PhoneEntry, selectContactPhone} from 'react-native-select-contact';
import SendSMS from 'react-native-sms';

interface permissionState {
  contactStatus: PermissionStatus;
  smsStatus: PermissionStatus;
  //  contactStatus: PermissionStatus;
}

export const permissionInitialState: permissionState = {
  contactStatus: 'unavailable',
  smsStatus: 'unavailable',
};
//vamos a definir el tipado que vamos a extraer del context
type PermissionContextProps = {
  permission: permissionState;
  askContactPermission: () => void;
  checkContactPermission: () => void;
};
//send sms contac List
const sendSMS = (phone: string, name: string) => {
  SendSMS.send(
    {
      body: `Hola ${name} Te invitamos a unirte a Paybox!`,
      recipients: [phone],
      successTypes: [],
      allowAndroidSendWithoutReadPermission: true,
    },
    (completed, cancelled, error) => {
      if (cancelled) {
        return;
      }
      if (error) {
        return console.log('hubo un error al enviar el sms', error);
      }
      if (completed) {
        return console.log('sms enviado con exito');
      }
    },
  );
};
//select contact List
const selectContact = () => {
  return selectContactPhone().then(selection => {
    if (!selection) {
      return;
    }

    let {contact, selectedPhone} = selection;
    console.log(
      `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`,
    );
    // return selectedPhone.number;
    return sendSMS(selectedPhone.number, contact.name);
  });
};

export const PermissionContext = createContext({} as PermissionContextProps); //permissionContext.

export const PermissionProvider = ({children}: any) => {
  const [permission, setPermission] = useState(permissionInitialState);

  //Ahora vamos a usar un useEffect pára comprobar los settings del sistema operativo y actualizarlos la app cada vez que haya un cambio con el listener 'change'
  useEffect(() => {
    //aqui disparamos nuevamente el check para arreglar el error del loading infinito
    checkContactPermission();
    AppState.addEventListener('change', state => {
      if (state !== 'active') {
        return;
      }
      //vamos a ejecutatr el check cada vez que el usuario se salga de la app
      checkContactPermission();
    });
  }, []);
  const askContactPermission = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      // permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissionStatus = await request('ios.permission.CONTACTS');
    } else {
      // if (Platform.OS === 'android') {
      // permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus = await request('android.permission.READ_CONTACTS');
      permissionStatus = await request('android.permission.READ_SMS');
      // con openSetting mandamos a l usuario a las configuraciones del teklefono tanto en android como en ios
      if (permission.contactStatus === 'blocked') {
        openSettings();
      }
      if (permission.smsStatus === 'blocked') {
        openSettings();
      }
      if (permission.contactStatus === 'granted') {
        // return selectContact();
        return selectContact();
      }
    }
    //aqui vamos a mandar todos los permisos(cuando tengas mas de una) y vamos a actualizar el del location(en este caso)
    setPermission({
      ...permission,
      contactStatus: permissionStatus,
      smsStatus: permissionStatus,
    });
  };
  const checkContactPermission = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === 'ios') {
      // permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissionStatus = await check('ios.permission.CONTACTS');
    } else {
      // if (Platform.OS === 'android') {
      // permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus = await check('android.permission.READ_CONTACTS');
      permissionStatus = await check('android.permission.READ_SMS');
    }
    //aqui vamos a actualizar el estado del permiso, cada vez que salga y entre el useuario de la app con el listener del useEffect
    setPermission({
      ...permission,
      contactStatus: permissionStatus,
      smsStatus: permissionStatus,
    });
  };

  return (
    <PermissionContext.Provider
      value={{permission, askContactPermission, checkContactPermission}}>
      {children}
    </PermissionContext.Provider>
  );
};
