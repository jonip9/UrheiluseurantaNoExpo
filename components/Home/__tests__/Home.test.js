import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../Home';

import renderer, {act} from 'react-test-renderer';

test('Home renders correctly', async () => {
  jest.useFakeTimers();
  const tree = renderer
    .create(
      <NavigationContainer>
        <Home route={{params: {}}} />
      </NavigationContainer>,
    )
    .toJSON();
  await act(async () => {});
  expect(tree).toMatchSnapshot();
});
