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
            name: 'Api',
            endpoint: awsConfig.apiGateway.URL,
            region: awsConfig.apiGateway.REGION,
            custom_header: async () => {
              return {
                Authorization: `Bearer ${(await Auth.currentSession())
                  .getIdToken()
                  .getJwtToken()}`,
              };
            }
          },
        ],
      },
    });
  }

  static async signUp(username, password) {
    return await Auth.signUp(username, password);
    //try {
      //const response = await Auth.signUp({
        //username,
        //password,
      //});

      //return Promise.resolve(response);
    //} catch (error) {
      //return Promise.reject(error);
    //}
  }

  static async signIn(username, password) {
    return await Auth.signIn(username, password);
    //try {
      //return await Auth.signIn(username, password);
    //} catch (error) {
      //throw new Error(error);
    //}
  }

  static async signOut() {
      return await Auth.signOut();
    //try {
    //return await Auth.signOut();
    //} catch (error) {
    //throw new Error(error);
    //}
  }

  static async checkSession() {
    return await Auth.currentSession();
    //try {
    //return await Auth.currentSession();
    //} catch (error) {
    //throw new Error(error);
    //}
  }
}
