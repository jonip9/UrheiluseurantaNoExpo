import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Button, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ListItem from '../../components/ListItem';
import { styles } from '../../styles/styles';

export default function List({ route, navigation }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  //const { id } = route.params;
  //const { user } = route.params;
  //const url = 'http://192.168.1.102:3000/event/all/' + id;

  useEffect(() => {
    if (isFocused) {
      //fetchAllEvents();
    }
  }, [isFocused]);

  async function fetchAllEvents() {
    fetch('url', {
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
        renderItem={({ item }) => (
          <ListItem details={item} nav={navigation} refresh={fetchAllEvents} />
        )}
        keyExtractor={(item) => JSON.stringify(item.id)}
        onRefresh={() => handleRefresh()}
        refreshing={refresh}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Lisää"
          onPress={() =>
            navigation.navigate('Tiedot', { userId: 'id', itemData: null })
          }
        />
      </View>
    </View>
  );
}
