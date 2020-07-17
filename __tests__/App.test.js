import 'react-native';
import React from 'react';
import App from '../App';

import renderer, { act } from 'react-test-renderer';

test('renders correctly', async () => {
  jest.useFakeTimers();
  const tree = renderer.create(<App />).toJSON();
  await act(async () => {});
  expect(tree).toMatchSnapshot();
});
