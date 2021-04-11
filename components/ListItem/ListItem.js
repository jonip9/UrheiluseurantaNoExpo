import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text, View, Button, Modal } from 'react-native';
import { styles } from '../../styles/styles';
import EventService from '../../services/EventService';

export default function ListItem({ details, nav, refresh }) {
  const [modalVisible, setModalVisible] = useState(false);

  const deleteEvent = () => {
    EventService.deleteEvent(details.eventId)
      .then(() => refresh())
      .catch((errorRes) => console.error(errorRes))
      .finally(() => setModalVisible(false));
  };

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
        <Text>{new Date(details.date).toLocaleDateString()}</Text>
        <Text>{details.sport}</Text>
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
          onPress={() => nav.navigate('Tiedot', { itemData: details })}
        />
      </View>
    </View>
  );
}
