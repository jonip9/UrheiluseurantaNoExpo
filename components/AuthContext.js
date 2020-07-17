import React, {createContext, useMemo} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const Context = createContext();

function AuthContext({children, dispatch}) {
  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        console.log('Data: ' + JSON.stringify(data));

        fetch('http://192.168.1.102:3000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error');
            }
            return response.json();
          })
          .then(async (data) => {
            console.log('returned data: ' + JSON.stringify(data.token));
            await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
            dispatch({type: 'SIGN_IN', token: data.token});
          })
          .catch((error) => {
            console.error('Error: ', error);
          });
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (data) => {
        console.log('Data: ' + JSON.stringify(data));

        fetch('http://192.168.1.102:3000/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error');
            }
            return response.json();
          })
          .then(async (data) => {
            await AsyncStorage.setItem('userToken', JSON.stringify(data.token));
            dispatch({type: 'SIGN_IN', token: data.token});
          })
          .catch((error) => {
            console.error('Error: ', error);
          });
      },
    }),
    [dispatch],
  );

  return <Context.Provider value={authContext}>{children}</Context.Provider>;
}

export {Context, AuthContext};
