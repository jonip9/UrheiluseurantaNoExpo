import {useState, useEffect} from 'react';

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
        });
    };

    fetchSportTypes();
  }, []);

  return {types, typesError};
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
        });
    };

    fetchUserInfo();
  }, []);

  return {data, error};
}

export {useFetchSportTypes, useFetchUserInfo};
