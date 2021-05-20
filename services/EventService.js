import { API } from 'aws-amplify';

const API_NAME = 'Api';

class EventService {
  static async getEvents() {
    const response = await API.get(API_NAME, '/event/get');

    return response;
  }

  static async getEventById(eventId) {
    const response = await API.get(API_NAME, `/event/get/${eventId}`);

    return response;
  }

  static async saveEvent(event, mode) {
    const params = {
      body: event,
    };

    if (mode === 'modify') {
      return await API.post(API_NAME, `/event/modify/${event.eventId}`, params);
    }

    return await API.post(API_NAME, '/event/add', params);
  }

  static async deleteEvent(eventId) {
    const response = await API.post(API_NAME, `/event/delete/${eventId}`);

    return response;
  }
}

export default EventService;
