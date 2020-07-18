import 'react-native-gesture-handler';
import React, {useState, useContext} from 'react';
import {Text, TextInput, View, Button} from 'react-native';
import {Context} from '../AuthContext';
import {styles} from '../../styles/styles';

export default function Register({navigation}) {
  const [regInfo, setRegInfo] = useState({
    user: '',
    pass: '',
    name: '',
    year: 1940,
  });
  const {signUp} = useContext(Context);

  return (
    <View style={styles.container}>
      <Text>Käyttäjätunnus</Text>
      <TextInput
        value={regInfo.user}
        onChangeText={(text) => setRegInfo((state) => ({...state, user: text}))}
      />
      <Text>Salasana</Text>
      <TextInput
        secureTextEntry={true}
        value={regInfo.pass}
        onChangeText={(text) => setRegInfo((state) => ({...state, pass: text}))}
      />
      <Text>Nimi</Text>
      <TextInput
        value={regInfo.name}
        onChangeText={(text) => setRegInfo((state) => ({...state, name: text}))}
      />
      <Text>Syntymävuosi</Text>
      <TextInput
        maxLength={4}
        keyboardType="numeric"
        placeholder="1940"
        onChangeText={(text) =>
          setRegInfo((state) => ({...state, year: parseInt(text)}))
        }
      />
      <View style={styles.buttonModal}>
        <Button title="OK" onPress={() => signUp(regInfo)} />
      </View>
      <View style={styles.buttonModal}>
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
