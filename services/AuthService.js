import { Amplify, Auth } from 'aws-amplify';
import awsConfig from '../aws-config';

export default class AuthService {
  static initialize() {
    Amplify.configure({
      Auth: {
        mandatorySignIn: true,
        region: awsConfig.cognito.REGION,
        userPoolId: awsConfig.cognito.USER_POOL_ID,
        userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID,
      },
      API: {
        endpoints: [
          {
            name: 'events',
            endpoint: awsConfig.apiGateway.URL,
            region: awsConfig.apiGateway.REGION,
          },
        ],
      },
    });
  }

  static async signUp(username, password) {
    try {
      const response = await Auth.signUp({
        username,
        password,
      });

      return response;
    } catch (error) {
      console.log('error: ', error);
      return error.message;
    }
  }

  static async signIn(username, password) {
    try {
      const response = await Auth.signIn(username, password);

      return response;
    } catch (error) {
      return error.message;
    }
  }

  static async checkSession() {
    try {
      const response = await Auth.currentSession();

      return response;
    } catch (error) {
      return error.message;
    }
  }
}
