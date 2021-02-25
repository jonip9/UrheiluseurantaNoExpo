import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'space-between',
    margin: 10,
    padding: 10,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    //alignItems: "center",
    elevation: 5,
  },
  centerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 5,
  },
  buttonModal: {
    padding: 5,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
  },
});

export { styles };
