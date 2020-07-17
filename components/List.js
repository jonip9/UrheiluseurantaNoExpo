import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Text, View, Button, Modal, FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {styles} from '../styles/styles';

export default function List({route, navigation}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const {id} = route.params;
  const {user} = route.params;
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
      });
  }

  function handleRefresh() {
    setRefresh(true);
    fetchAllEvents();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <ListItem details={item} nav={navigation} refresh={fetchAllEvents} />
        )}
        keyExtractor={(item) => JSON.stringify(item.id)}
        onRefresh={() => handleRefresh()}
        refreshing={refresh}
      />
      <View style={{marginTop: 10}}>
        <Button
          title="Lisää"
          onPress={() =>
            navigation.navigate('Tiedot', {userId: id, itemData: null})
          }
        />
      </View>
    </View>
  );
}

function ListItem({details, nav, refresh}) {
  const [modalVisible, setModalVisible] = useState(false);
  const url = 'http://192.168.1.102:3000/event/delete';

  async function deleteEvent() {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: details.id}),
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
              <Button
                title="Ei"
                onPress={() => setModalVisible(!modalVisible)}
              />
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
        <Button
          title="Muokkaa"
          onPress={() =>
            nav.navigate('Tiedot', {userId: details.user, itemData: details})
          }
        />
      </View>
    </View>
  );
}
