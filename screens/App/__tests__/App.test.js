import 'react-native';
import React from 'react';
import App from '../App';

import renderer, { act } from 'react-test-renderer';

test('App renders correctly', async () => {
  jest.useFakeTimers();
  jest.mock('react-native', () => 'Image');
  const tree = renderer.create(<App />).toJSON();
  await act(async () => {});
  expect(tree).toMatchSnapshot();
});
