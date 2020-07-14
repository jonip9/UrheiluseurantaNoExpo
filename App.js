import 'react-native-gesture-handler';
import React, { useState, createContext, useReducer, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext, Login, Register, List, ItemData, Settings, Info, Splash } from './Screens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      userToken: null,
    }
  );

  useEffect(() => {
    async function bootstrapAsync() {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        console.log('restored token: ' + userToken);
      } catch (error) {
        // error
      }
      dispatch({ type: 'RESTORE_TOKEN', token: JSON.parse(userToken) });
    };

    bootstrapAsync();
  }, []);

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
          .then((data) => {
            console.log('returned data: ' + JSON.stringify(data.token));
            AsyncStorage.setItem('userToken', JSON.stringify(data.token));
            dispatch({ type: 'SIGN_IN', token: data.token });
          })
          .catch((error) => {
            console.error('Error: ', error);
          });
      },
      signOut: () => {
        AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
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
          .then((data) => {
            AsyncStorage.setItem('userToken', JSON.stringify(data.token));
            dispatch({ type: 'SIGN_IN', token: data.token });
          })
          .catch((error) => {
            console.error('Error: ', error);
          });
      },
    }), []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen name="Aloitus" component={Splash} />
          ) : state.userToken == null ?
              (
                <>
                  <Stack.Screen name="Kirjautuminen" component={Login} />
                  <Stack.Screen name="Rekisteröinti" component={Register} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Urheiluseuranta" component={Home} initialParams={state.userToken} />
                  <Stack.Screen name="Tiedot" component={ItemData} />
                </>
              )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

function Home({ route }) {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Tapahtumat" component={List} initialParams={route.params} />
      <Tab.Screen name="Asetukset" component={Settings} initialParams={route.params} />
      <Tab.Screen name="Tietoa" component={Info} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
