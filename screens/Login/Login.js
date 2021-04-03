import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';
import { useAuthContext } from '../../components/AuthContext';
import { styles } from '../../styles/styles';
import { useNavigation } from '@react-navigation/core';
import AuthService from '../../services/AuthService';

export default function Login() {
  const { setIsAuthed } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignIn = async () => {
    await AuthService.signIn(username, password)
      .then(() => {
        setIsAuthed(true);
        navigation.navigate('Urheiluseuranta');
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

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
        <Button title="Kirjaudu" onPress={() => handleSignIn()} />
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
