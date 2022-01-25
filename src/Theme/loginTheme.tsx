import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  globalMargin: {
    marginHorizontal: 40,
  },
  welcomeTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    top: 100,
  },
  label: {
    color: '#000',
    fontSize: 15,
    top: 90,
    marginTop: 10,
  },
  styleInput: {
    top: 85,
    borderBottomWidth: 0.5,
    borderColor: '#93291E',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 95,
  },
  styleButton: {
    width: 90,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#93291E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.4,
    elevation: 7,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
    justifyContent: 'center',
  },
  buttonRegister: {
    alignItems: 'center',
    top: 95,
    marginHorizontal: 10,
    marginTop: 10,
  },
});
