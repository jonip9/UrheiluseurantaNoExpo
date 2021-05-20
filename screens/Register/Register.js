import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, TextInput, View, Button, Modal } from 'react-native';
import { styles } from '../../styles/styles';
import AuthService from '../../services/AuthService';

export default function Register({ navigation }) {
  const [regInfo, setRegInfo] = useState({
    user: '',
    pass: '',
    name: '',
    year: 1940,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [code, setCode] = useState('');

  const handleSignUp = () => {
    AuthService.signUp(regInfo.user, regInfo.pass)
      .then((response) => {
        console.log('response: ', response);
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error('error: ', error);
      });
  };

  const handleConfirmation = () => {
    AuthService.confirmSignIp(regInfo.user, code)
      .then(() => navigation.goBack())
      .catch((errorRes) => console.log(errorRes));
  };

  return (
    <View style={styles.container}>
      <Modal transparent={false} visible={isModalVisible}>
        <Text>Enter confirmation code</Text>
        <View>
          <TextInput value={code} onChangeText={setCode} />
          <Button title="Submit" onPress={() => handleConfirmation()} />
        </View>
      </Modal>
      <Text>Käyttäjätunnus</Text>
      <TextInput
        value={regInfo.user}
        onChangeText={(text) =>
          setRegInfo((state) => ({ ...state, user: text }))
        }
      />
      <Text>Salasana</Text>
      <TextInput
        secureTextEntry={true}
        value={regInfo.pass}
        onChangeText={(text) =>
          setRegInfo((state) => ({ ...state, pass: text }))
        }
      />
      <Text>Nimi</Text>
      <TextInput
        value={regInfo.name}
        onChangeText={(text) =>
          setRegInfo((state) => ({ ...state, name: text }))
        }
      />
      <Text>Syntymävuosi</Text>
      <TextInput
        maxLength={4}
        keyboardType="numeric"
        placeholder="1940"
        onChangeText={(text) =>
          setRegInfo((state) => ({ ...state, year: parseInt(text) }))
        }
      />
      <View style={styles.buttonModal}>
        <Button title="OK" onPress={() => handleSignUp()} />
      </View>
      <View style={styles.buttonModal}>
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
