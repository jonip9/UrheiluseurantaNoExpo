import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../styles/styles';
import { checkNan } from '../../utils/helpers';
import { useFetch } from '../../hooks/hooks';

export default function ItemData({ route, navigation }) {
  const [formData, setFormData] = useState({
    user: route.params.userId,
    date: new Date(),
    sport: 1,
    duration: 0,
    distance: 0,
    comment: '',
  });
  const [submitMode, setSubmitMode] = useState('add');
  const [show, setShow] = useState(false);
  const { data, error, isLoading } = useFetch(
    'http://192.168.1.102:3000/event/types',
  );

  useEffect(() => {
    if (route.params.itemData !== null) {
      setSubmitMode('modify');
      setFormData(route.params.itemData);
      setFormData((state) => ({ ...state, date: new Date(state.date) }));
    }
  }, [route.params.itemData]);

  function onDateChange(event, selectedDate) {
    const currentDate = selectedDate || formData.date;
    setShow(false);
    //setDate(currentDate);
    setFormData((state) => ({ ...state, date: currentDate }));
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
      {show && (
        <DateTimePicker
          value={formData.date}
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
        {data.map((item, i) => {
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
        <Button title="Tallenna" onPress={() => submitEvent(formData)} />
        <Button title="Peruuta" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}
