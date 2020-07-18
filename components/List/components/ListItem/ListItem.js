import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Text, View, Button, Modal} from 'react-native';
import {styles} from '../../../../styles/styles';

export default function ListItem({details, nav, refresh}) {
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