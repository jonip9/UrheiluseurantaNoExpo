import 'react-native-gesture-handler';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import List from '../List';
import Settings from '../Settings';
import Info from '../Info';

const Tab = createBottomTabNavigator();

export default function Home({ route }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tapahtumat"
        component={List}
        initialParams={route.params}
      />
      <Tab.Screen
        name="Asetukset"
        component={Settings}
        initialParams={route.params}
      />
      <Tab.Screen name="Tietoa" component={Info} />
    </Tab.Navigator>
  );
}
