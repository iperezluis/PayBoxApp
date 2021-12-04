import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  lable: {
    marginTop: 20,
  },
  textInput: {
    marginTop: 5,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
  },
  textButton: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#93291E',
    width: 90,
    height: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 9,
  },
});
