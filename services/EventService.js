import { API } from 'aws-amplify';

const API_NAME = 'Api';

class EventService {
  static async getEvents() {
    const response = await API.get(API_NAME, '/event/get');
    console.log(response);

    return response;
  }

  static async getEventById(eventId) {
    const response = await API.get(API_NAME, `/event/get/${eventId}`);
    console.log(response);

    return response;
  }

  static async saveEvent(event, mode) {
    const params = {
      body: event,
    };
    console.log('params: ', params);
    console.log('mode: ', mode);

    if (mode === 'modify') {
      return await API.post(API_NAME, `/event/modify/${event.eventId}`, params);
    }

    return await API.post(API_NAME, '/event/add', params);
  }

  static async deleteEvent(eventId) {
    const response = await API.post(API_NAME, `/event/delete/${eventId}`);
    console.log(response);

    return response;
  }
}

export default EventService;
