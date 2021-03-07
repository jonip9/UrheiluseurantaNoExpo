import 'react-native-gesture-handler';
import React, { useState, useContext } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { Context } from '../AuthContext';
import { styles } from '../../styles/styles';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(Context);
  console.log('test')

  return (
    <View style={styles.container}>
      <Text>Käyttäjätunnus</Text>
      <TextInput value={username} onChangeText={(text) => setUsername(text)} />
      <Text>Salasana</Text>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonModal}>
        <Button
          title="Kirjaudu"
          onPress={() => signIn({ user: username, pass: password })}
        />
      </View>
      <View style={styles.buttonModal}>
        <Button
          title="Luo tunnus"
          onPress={() => navigation.navigate('Rekisteröinti')}
        />
      </View>
    </View>
  );
}
