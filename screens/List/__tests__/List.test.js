import 'react-native';
import React from 'react';
import List from '../List';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import renderer, { act } from 'react-test-renderer';

test('App renders correctly', async () => {
  jest.useFakeTimers();
  const { Screen, Navigator } = createBottomTabNavigator();

  const tree = renderer
    .create(
      <NavigationContainer>
        <Navigator>
          <Screen name="List" component={List} initialParams={{ id: 0 }} />
        </Navigator>
      </NavigationContainer>,
    )
    .toJSON();
  await act(async () => {});
  expect(tree).toMatchSnapshot();
});
