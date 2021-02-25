import 'react-native-gesture-handler';
import React from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../../styles/styles';

export default function Splash() {
  return (
    <View style={styles.splash}>
      <Text>Odota...</Text>
      <Image source={require('./img/android_image.png')} />
    </View>
  );
}
