import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Button, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ListItem from '../../components/ListItem';
import { styles } from '../../styles/styles';
import EventService from '../../services/EventService';

export default function List({ navigation }) {
  const [data, setData] = useState([]);
  //const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchAllEvents();
    }
  }, [isFocused]);

  const fetchAllEvents = () => {
    EventService.getEvents()
      .then((dataRes) => setData(dataRes))
      .catch((errorRes) => console.log('error:', errorRes))
      .finally(() => setRefresh(false));
  };

  function handleRefresh() {
    setRefresh(true);
    fetchAllEvents();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            details={item}
            nav={navigation}
            refresh={fetchAllEvents}
          />
        )}
        keyExtractor={(item) => JSON.stringify(item.id)}
        onRefresh={() => handleRefresh()}
        refreshing={refresh}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Lisää"
          onPress={() => navigation.navigate('Tiedot', { itemData: null })}
        />
      </View>
    </View>
  );
}
