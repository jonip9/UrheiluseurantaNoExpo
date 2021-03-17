import { createContext, useContext } from 'react';
// import AsyncStorage from '@react-native-community/async-storage';

const Context = createContext(null);

function useAuthContext() {
  return useContext(Context);
}

export { Context, useAuthContext };
