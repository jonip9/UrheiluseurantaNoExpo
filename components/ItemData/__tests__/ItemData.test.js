import 'react-native';
import React from 'react';
import ItemData from '../ItemData';

import renderer, {act} from 'react-test-renderer';

test('ItemData renders correctly', async () => {
  const dummyData = {
    userId: 'user',
    date: '2020-01-01',
    sport: 1,
    duration: 0,
    distance: 0,
    comment: 'comment',
  };

  jest.useFakeTimers();
  const tree = renderer
    .create(<ItemData route={{params: {itemData: dummyData}}} />)
    .toJSON();
  await act(async () => {});
  expect(tree).toMatchSnapshot();
});
