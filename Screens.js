import 'react-native-gesture-handler';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Modal, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AuthContext = createContext();

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Käyttäjätunnus</Text>
      <TextInput value={username} onChangeText={text => setUsername(text)} />
      <Text>Salasana</Text>
      <TextInput secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
      <View style={styles.buttonModal}>
        <Button title="Kirjaudu" onPress={() => signIn({ user: username, pass: password })} />
      </View>
      <View style={styles.buttonModal}>
        <Button title="Luo tunnus" onPress={() => navigation.navigate('Rekisteröinti')} />
      </View>
    </View>
  );
}

function Register({ navigation }) {
  const [regInfo, setRegInfo] = useState({ user: '', pass: '', name: '', year: 1940 });
  const { signUp } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Käyttäjätunnus</Text>
      <TextInput value={regInfo.user} onChangeText={text => setRegInfo(state => ({ ...state, user: text }))} />
      <Text>Salasana</Text>
      <TextInput secureTextEntry={true} value={regInfo.pass} onChangeText={text => setRegInfo(state => ({ ...state, pass: text }))} />
      <Text>Nimi</Text>
      <TextInput value={regInfo.name} onChangeText={text => setRegInfo(state => ({ ...state, name: text }))} />
      <Text>Syntymävuosi</Text>
      <TextInput maxLength={4} keyboardType="numeric" placeholder="1940" onChangeText={text => setRegInfo(state => ({ ...state, year: parseInt(text) }))} />
      <View style={styles.buttonModal}>
        <Button title="OK" onPress={() => signUp(regInfo)} />
      </View>
      <View style={styles.buttonModal}>
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function List({ route, navigation }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const { id } = route.params;
  const { user } = route.params;
  const url = 'http://192.168.1.102:3000/event/all/' + id;

  useEffect(() => {
    if (isFocused) {
      fetchAllEvents();
    }
  }, [isFocused]);

  async function fetchAllEvents() {
    fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setRefresh(false);
        console.log('Success: ', data);
      })
      .catch((error) => {
        setError(error);
        setRefresh(false);
        console.error('Error: ', error);
      })
  }

  function handleRefresh() {
    setRefresh(true);
    fetchAllEvents();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem details={item} nav={navigation} refresh={fetchAllEvents} />}
        keyExtractor={item => JSON.stringify(item.id)}
        onRefresh={() => handleRefresh()}
        refreshing={refresh} />
      <View style={{ marginTop: 10 }}>
        <Button title="Lisää" onPress={() => navigation.navigate('Tiedot', { userId: id, itemData: null })} />
      </View>
    </View>
  );
}

function ListItem({ details, nav, refresh }) {
  const [modalVisible, setModalVisible] = useState(false);
  const url = 'http://192.168.1.102:3000/event/delete';

  async function deleteEvent() {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: details.id })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        setModalVisible(false);
        refresh();
        console.log('Success: ', data);
      })
      .catch((error) => {
        setModalVisible(false);
        console.error('Error: ', error);
      });
  }

  return (
    <View style={styles.container}>
      <Modal transparent={true} visible={modalVisible} style={styles.modal}>
        <View style={styles.centerModal}>
          <View style={styles.modal}>
            <Text>Haluatko varmasti poistaa tapahtuman?</Text>
            <View style={styles.buttonModal}>
              <Button title="Kyllä" onPress={() => deleteEvent()} />
            </View>
            <View style={styles.buttonModal}>
              <Button title="Ei" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <Text>{details.date.slice(0, 10)}</Text>
        <Text>{details.type}</Text>
      </View>
      <View>
        <Text>Aika: {details.duration} h</Text>
        <Text>Matka: {details.distance} km</Text>
        <Text>{details.comment}</Text>
      </View>
      <View style={styles.button}>
        <Button title="Poista" onPress={() => setModalVisible(true)} />
        <Button title="Muokkaa" onPress={() => nav.navigate('Tiedot', { userId: details.user, itemData: details })} />
      </View>
    </View>
  );
}

function ItemData({ route, navigation }) {
  const [formData, setFormData] = useState({ user: route.params.userId, date: new Date(), sport: 1, duration: 0, distance: 0, comment: '' });
  const [submitMode, setSubmitMode] = useState('add');
  const [show, setShow] = useState(false);
  const { types, typesError } = useFetchSportTypes();

  useEffect(() => {
    if (route.params.itemData !== null) {
      setSubmitMode('modify');
      setFormData(route.params.itemData);
      setFormData(state => ({ ...state, date: new Date(state.date) }));
    }
  }, [route.params.itemData]);

  function onDateChange(event, selectedDate) {
    const currentDate = selectedDate || formData.date;
    setShow(false);
    //setDate(currentDate);
    setFormData(state => ({ ...state, date: currentDate }));
  }

  async function submitEvent(data) {
    fetch('http://192.168.1.102:3000/event/' + submitMode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then((data) => {
        navigation.goBack();
        console.log('Success: ', data);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }

  return (
    <View style={styles.container}>
      <Text>Päivämäärä</Text>
      <Text>{formData.date.toLocaleDateString()}</Text>
      <Button title="Muuta päiväys" onPress={() => setShow(true)} />
      {show && (<DateTimePicker value={formData.date} mode="date" display="calendar" onChange={onDateChange} />)}
      <Text>Laji</Text>
      <Picker selectedValue={formData.sport} onValueChange={(itemValue, itemIndex) => setFormData(state => ({ ...state, sport: parseInt(itemValue) }))}>
        {types.map((item, i) => {
          return (
            <Picker.Item key={item.id} label={item.type} value={item.id} />
          );
        })}
      </Picker>
      <Text>Kesto (h)</Text>
      <TextInput value={checkNan(formData.duration)} keyboardType="numeric" onChangeText={text => setFormData(state => ({ ...state, duration: parseInt(text) }))} />
      <Text>Matka (km)</Text>
      <TextInput value={checkNan(formData.distance)} keyboardType="numeric" onChangeText={text => setFormData(state => ({ ...state, distance: parseInt(text) }))} />
      <Text>Kommentti</Text>
      <TextInput value={formData.comment} onChangeText={text => setFormData(state => ({ ...state, comment: text }))} />
      <View style={styles.button}>
        <Button title="Tallenna" onPress={() => submitEvent(formData)} />
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function Settings({ route, navigation }) {
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ id: route.params.id, oldPassword: '', newPassword: '', repeatPassword: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = route.params;
  const { data, error } = useFetchUserInfo(id);
  const { signOut } = useContext(AuthContext);

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
      })
  }

  function checkPasswords() {
    if (passwords.oldPassword === data.password && passwords.newPassword === passwords.repeatPassword) {
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
            <TextInput secureTextEntry={true} value={passwords.oldPassword} onChangeText={text => setPasswords(state => ({ ...state, oldPassword: text }))} />
            <Text>Uusi salasana</Text>
            <TextInput secureTextEntry={true} value={passwords.newPassword} onChangeText={text => setPasswords(state => ({ ...state, newPassword: text }))} />
            <Text>Uusi salasana uudestaan</Text>
            <TextInput secureTextEntry={true} value={passwords.repeatPassword} onChangeText={text => setPasswords(state => ({ ...state, repeatPassword: text }))} />
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
      <TextInput value={formData.name} onChangeText={text => setFormData(state => ({ ...state, name: text }))} />
      <Text>Pituus (cm)</Text>
      <TextInput value={checkNan(formData.height)} onChangeText={text => setFormData(state => ({ ...state, height: parseInt(text) }))} />
      <Text>Paino (kg)</Text>
      <TextInput value={checkNan(formData.weight)} onChangeText={text => setFormData(state => ({ ...state, weight: parseInt(text) }))} />
      <Text>Syntymävuosi</Text>
      <TextInput maxLength={4} value={checkNan(formData.birthyear)} onChangeText={text => setFormData(state => ({ ...state, birthyear: parseInt(text) }))} />
      <Button title="Tallenna" onPress={() => saveUserInfo('modify', formData)} />
      <View style={styles.button}>
        <Button title="Vaihda salasana" onPress={() => setModalVisible(true)} />
        <Button title="Kirjaudu ulos" onPress={() => signOut()} />
      </View>
    </View>
  );
}

function Info() {
  return (
    <View style={styles.container}>
      <Text>Urheiluseuranta</Text>
      <Text>Joni Pössi</Text>
      <Text></Text>
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

function Splash() {
  return (
    <View style={styles.splash}>
      <Text>Odota...</Text>
      <Image source={ require('./img/android_image.png') } />
    </View>
  );
}

function useFetchSportTypes() {
  const [types, setTypes] = useState([]);
  const [typesError, setTypesError] = useState('');
  const url = 'http://192.168.1.102:3000/event/types';

  useEffect(() => {
    const fetchSportTypes = async () => {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          return response.json();
        })
        .then((data) => {
          setTypes(data);
          console.log('Success: ', data);
        })
        .catch((error) => {
          setTypesError(error);
          console.error('Error: ', error);
        })
    }

    fetchSportTypes();
  }, []);

  return { types, typesError }
}

function useFetchUserInfo(uid) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const url = 'http://192.168.1.102:3000/user/fetch/' + uid;

  useEffect(() => {
    const fetchUserInfo = async () => {
      fetch(url, {
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
          console.log('Success: ', data);
        })
        .catch((error) => {
          setError(error);
          console.error('Error: ', error);
        })
    }

    fetchUserInfo();
  }, []);

  return { data, error }
}

function checkNan(str) {
  return isNaN(str) | str === null ? '' : str.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'space-between',
    margin: 10,
    padding: 10,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    //alignItems: "center",
    elevation: 5,
  },
  centerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 5,
  },
  buttonModal: {
    padding: 5,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
  }
});

export { AuthContext, Login, Register, List, ItemData, Settings, Info, Splash }