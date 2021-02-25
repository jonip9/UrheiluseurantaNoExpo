import 'react-native-gesture-handler';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles/styles';

export default function Info() {
  return (
    <View style={styles.container}>
      <Text>Urheiluseuranta</Text>
      <Text>Joni Pössi</Text>
      <Text />
      <Text>Toimintolista</Text>
      <Text>ID: 1 OK</Text>
      <Text>ID: 2 OK</Text>
      <Text>ID: 3 OK</Text>
      <Text>ID: 4 OK</Text>
      <Text>ID: 5 OK</Text>
      <Text>ID: 6 OK</Text>
      <Text>ID: 7 OK</Text>
      <Text>ID: 8 OK</Text>
      <Text>ID: 9 OK</Text>
      <Text>ID: 10 Puuttuu</Text>
      <Text>ID: 11 Puuttuu</Text>
      <Text>ID: 12 OK</Text>
      <Text>ID: 13 OK</Text>
      <Text>ID: 14 OK</Text>
    </View>
  );
}
