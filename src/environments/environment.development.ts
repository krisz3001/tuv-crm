const baseUrl = 'http://localhost:3000';

export const environment = {
  production: false,
  baseUrl: baseUrl,
  apiUrl: `${baseUrl}/api`,
  fileServerUrl: `${baseUrl}/files`,
  firebase: {
    apiKey: 'AIzaSyAU8k9QKkkZMjKps2Qjt_hAKT5vLoWZfuI',
    authDomain: 'tuv-crm.firebaseapp.com',
    databaseURL: 'https://tuv-crm-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'tuv-crm',
    storageBucket: 'tuv-crm.appspot.com',
    messagingSenderId: '85659119698',
    appId: '1:85659119698:web:8b5f5465ba3ae22046af8b',
    measurementId: 'G-370CTDJYFY',
  },
};
