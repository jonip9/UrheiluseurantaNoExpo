import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../styles/styles';
import { checkNan } from '../../utils/helpers';
import EventService from '../../services/EventService';

const types = [
  { id: 0, type: 'Jogging' },
  { id: 1, type: 'Biking' },
];

export default function ItemData({ route, navigation }) {
  const [formData, setFormData] = useState({
    date: new Date().getTime(),
    sport: 0,
    duration: 0,
    distance: 0,
    comment: '',
  });
  const [submitMode, setSubmitMode] = useState('add');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (route.params.itemData !== null) {
      setSubmitMode('modify');
      setFormData(route.params.itemData);
      setFormData((state) => ({ ...state, date: state.date }));
    }
  }, [route.params.itemData]);

  function onDateChange(event, selectedDate) {
    const currentDate = selectedDate.getTime() || formData.date;
    setShow(false);
    setFormData((state) => ({ ...state, date: currentDate }));
  }

  const submitEvent = () => {
    EventService.saveEvent(formData, submitMode)
      .then(() => navigation.goBack())
      .catch((errorRes) => console.log('error: ', errorRes));
  };

  return (
    <View style={styles.container}>
      <Text>Päivämäärä</Text>
      <Text>{new Date(formData.date).toLocaleDateString()}</Text>
      <Button title="Muuta päiväys" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={new Date(formData.date)}
          mode="date"
          display="calendar"
          onChange={onDateChange}
        />
      )}
      <Text>Laji</Text>
      <Picker
        selectedValue={formData.sport}
        onValueChange={(itemValue, itemIndex) =>
          setFormData((state) => ({ ...state, sport: parseInt(itemValue) }))
        }>
        {types.map((item, i) => {
          return (
            <Picker.Item key={item.id} label={item.type} value={item.id} />
          );
        })}
      </Picker>
      <Text>Kesto (h)</Text>
      <TextInput
        value={checkNan(formData.duration)}
        keyboardType="numeric"
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, duration: parseInt(text) }))
        }
      />
      <Text>Matka (km)</Text>
      <TextInput
        value={checkNan(formData.distance)}
        keyboardType="numeric"
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, distance: parseInt(text) }))
        }
      />
      <Text>Kommentti</Text>
      <TextInput
        value={formData.comment}
        onChangeText={(text) =>
          setFormData((state) => ({ ...state, comment: text }))
        }
      />
      <View style={styles.button}>
        <Button title="Tallenna" onPress={() => submitEvent()} />
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
