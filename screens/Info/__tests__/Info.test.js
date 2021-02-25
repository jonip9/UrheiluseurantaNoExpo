import 'react-native-gesture-handler';
import React from 'react';
import Info from '../Info';

import renderer, { act } from 'react-test-renderer';

test('Info renders correctly', async () => {
  const tree = renderer.create(<Info />).toJSON();
  expect(tree).toMatchSnapshot();
});
