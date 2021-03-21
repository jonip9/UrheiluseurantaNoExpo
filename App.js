import 'react-native-gesture-handler';
import React, { useReducer, useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { Context } from './components/AuthContext/';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import ItemData from './screens/ItemData';
import Splash from './screens/Splash';
import awsConfig from './aws-config';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [isAuthing, setIsAuthing] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

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
    onStartUp();

    // async function bootstrapAsync() {
    //   let userToken;

    //   try {
    //     userToken = await AsyncStorage.getItem('userToken');
    //     dispatch({ type: 'RESTORE_TOKEN', token: JSON.parse(userToken) });
    //   } catch (error) {
    //     // error
    //   }
    // }

    // bootstrapAsync();
  }, []);

  const onStartUp = async () => {
    try {
      await Auth.currentSession();
      setIsAuthed(true);
    } catch (error) {
      if (error !== 'No current user') {
        Alert.alert(error);
      }
    }

    setIsAuthing(false);
  };

  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: awsConfig.cognito.REGION,
      userPoolId: awsConfig.cognito.USER_POOL_ID,
      userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID,
    },
    API: {
      endpoints: [
        {
          name: 'events',
          endpoint: awsConfig.apiGateway.URL,
          region: awsConfig.apiGateway.REGION,
        },
      ],
    },
  });

  return (
    <Context.Provider value={{ isAuthed, setIsAuthed }}>
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
    </Context.Provider>
  );
}
