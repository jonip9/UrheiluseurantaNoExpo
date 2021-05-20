import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, TextInput, View, Button, Modal } from 'react-native';
import { useAuthContext } from '../../components/AuthContext';
import { styles } from '../../styles/styles';
import { checkNan } from '../../utils/helpers';
import AuthService from '../../services/AuthService';

export default function Settings({ route }) {
  const { setIsAuthed } = useAuthContext();
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({
    id: route.params?.id,
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignOut = () => {
    AuthService.signOut()
      .then((response) => setIsAuthed(false))
      .catch((error) => {
        if (error.message !== 'The user is not authenticated') {
          console.error(error.message);
        }
      });
  };

  function checkPasswords() {
    if (
      passwords.oldPassword === data.password &&
      passwords.newPassword === passwords.repeatPassword
    ) {
      //saveUserInfo('changepass', passwords);
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
                setPasswords((state) => ({ ...state, oldPassword: text }))
              }
            />
            <Text>Uusi salasana</Text>
            <TextInput
              secureTextEntry={true}
              value={passwords.newPassword}
              onChangeText={(text) =>
                setPasswords((state) => ({ ...state, newPassword: text }))
              }
            />
            <Text>Uusi salasana uudestaan</Text>
            <TextInput
              secureTextEntry={true}
              value={passwords.repeatPassword}
              onChangeText={(text) =>
                setPasswords((state) => ({ ...state, repeatPassword: text }))
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
          setFormData((state) => ({ ...state, name: text }))
        }
      />
      <Text>Pituus (cm)</Text>
      <TextInput
        value={checkNan(formData.height)}
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, height: parseInt(text) }))
        }
      />
      <Text>Paino (kg)</Text>
      <TextInput
        value={checkNan(formData.weight)}
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, weight: parseInt(text) }))
        }
      />
      <Text>Syntymävuosi</Text>
      <TextInput
        maxLength={4}
        value={checkNan(formData.birthyear)}
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, birthyear: parseInt(text) }))
        }
      />
      <Button title="Tallenna" onPress={() => {}} />
      <View style={styles.button}>
        <Button title="Vaihda salasana" onPress={() => setModalVisible(true)} />
        <Button title="Kirjaudu ulos" onPress={() => handleSignOut()} />
      </View>
    </View>
  );
}
