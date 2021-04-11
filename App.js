import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Context } from './components/AuthContext/';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import ItemData from './screens/ItemData';
import Splash from './screens/Splash';
import { Alert } from 'react-native';
import AuthService from './services/AuthService';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [isAuthing, setIsAuthing] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    AuthService.initialize();
    AuthService.checkSession()
      .then((response) => {
        console.log('sess res: ', response);
        setIsAuthed(true);
      })
      .catch((error) => {
        console.log('error ', error);
        if (error !== 'No current user') {
          Alert.alert(error.message);
        }
      })
      .finally(() => setIsAuthing(false));
  }, []);

  return (
    <Context.Provider value={{ isAuthed, setIsAuthed }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthing ? (
            <Stack.Screen name="Aloitus" component={Splash} />
          ) : !isAuthed ? (
            <>
              <Stack.Screen name="Kirjautuminen" component={Login} />
              <Stack.Screen name="Rekisteröinti" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen name="Urheiluseuranta" component={Home} />
              <Stack.Screen name="Tiedot" component={ItemData} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}
