import 'react-native-gesture-handler';
import React, {useReducer, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../AuthContext';
import Home from '../Home';
import Login from '../Login';
import Register from '../Register';
import ItemData from '../ItemData';
import Splash from '../Splash';

const Stack = createStackNavigator();

export default function App({navigation}) {
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
    },
  );

  useEffect(() => {
    async function bootstrapAsync() {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
        console.log('restored token: ' + userToken);
        dispatch({type: 'RESTORE_TOKEN', token: JSON.parse(userToken)});
      } catch (error) {
        // error
      }
    }

    bootstrapAsync();
  }, []);

  return (
    <AuthContext dispatch={dispatch}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen name="Aloitus" component={Splash} />
          ) : state.userToken === null ? (
            <>
              <Stack.Screen name="Kirjautuminen" component={Login} />
              <Stack.Screen name="Rekisteröinti" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Urheiluseuranta"
                component={Home}
                initialParams={state.userToken}
              />
              <Stack.Screen name="Tiedot" component={ItemData} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext>
  );
}
