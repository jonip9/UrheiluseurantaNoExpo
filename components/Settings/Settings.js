import 'react-native-gesture-handler';
import React, {useState, useContext, useEffect} from 'react';
import {Text, TextInput, View, Button, Modal} from 'react-native';
import {Context} from '../AuthContext';
import {styles} from '../../styles/styles';
import {checkNan} from '../../utils/helpers';
import {useFetch} from '../../hooks/hooks';

export default function Settings({route, navigation}) {
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({
    id: route.params.id,
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const {id} = route.params;
  const {data, error, isLoading} = useFetch(
    'http://192.168.1.102:3000/user/fetch/' + id,
  );
  const {signOut} = useContext(Context);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  async function saveUserInfo(mode, info) {
    console.log('Info: ' + JSON.stringify(info));
    console.log('Mode: ' + mode);
    const url = 'http://192.168.1.102:3000/user/' + mode;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success: ', data);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }

  function checkPasswords() {
    if (
      passwords.oldPassword === data.password &&
      passwords.newPassword === passwords.repeatPassword
    ) {
      saveUserInfo('changepass', passwords);
      setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.centerModal}>
          <View style={styles.modal}>
            <Text>Vanha salasana</Text>
            <TextInput
              secureTextEntry={true}
              value={passwords.oldPassword}
              onChangeText={(text) =>
                setPasswords((state) => ({...state, oldPassword: text}))
              }
            />
            <Text>Uusi salasana</Text>
            <TextInput
              secureTextEntry={true}
              value={passwords.newPassword}
              onChangeText={(text) =>
                setPasswords((state) => ({...state, newPassword: text}))
              }
            />
            <Text>Uusi salasana uudestaan</Text>
            <TextInput
              secureTextEntry={true}
              value={passwords.repeatPassword}
              onChangeText={(text) =>
                setPasswords((state) => ({...state, repeatPassword: text}))
              }
            />
            <View style={styles.buttonModal}>
              <Button title="Tallenna" onPress={() => checkPasswords()} />
            </View>
            <View style={styles.buttonModal}>
              <Button title="Peruuta" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

      <Text>Nimi</Text>
      <TextInput
        value={formData.name}
        onChangeText={(text) =>
          setFormData((state) => ({...state, name: text}))
        }
      />
      <Text>Pituus (cm)</Text>
      <TextInput
        value={checkNan(formData.height)}
        onChangeText={(text) =>
          setFormData((state) => ({...state, height: parseInt(text)}))
        }
      />
      <Text>Paino (kg)</Text>
      <TextInput
        value={checkNan(formData.weight)}
        onChangeText={(text) =>
          setFormData((state) => ({...state, weight: parseInt(text)}))
        }
      />
      <Text>Syntymävuosi</Text>
      <TextInput
        maxLength={4}
        value={checkNan(formData.birthyear)}
        onChangeText={(text) =>
          setFormData((state) => ({...state, birthyear: parseInt(text)}))
        }
      />
      <Button
        title="Tallenna"
        onPress={() => saveUserInfo('modify', formData)}
      />
      <View style={styles.button}>
        <Button title="Vaihda salasana" onPress={() => setModalVisible(true)} />
        <Button title="Kirjaudu ulos" onPress={() => signOut()} />
      </View>
    </View>
  );
}
