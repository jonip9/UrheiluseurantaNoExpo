import 'react-native-gesture-handler';
import React, { useState, createContext, useReducer, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import { AsyncStorage } from '@react-native-community/async-storage';
import renderer, { act } from 'react-test-renderer';

import App from './App';
import { AuthContext, Login, Register, List, ItemData, Settings, Info, Splash } from './Screens';

it('renders correctly', async () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});