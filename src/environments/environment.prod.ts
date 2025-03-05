import { LogLevel } from "app/modules/shared/classes/logs/log.model";

export const environment = {
  applicationName: 'IVO App',
  appVersion: '0.0.1',
  production: true,
  debugger: false,
  apiUrl: 'https://hasura-vomi-dev-169533098123.us-central1.run.app/v1/graphql',
  appUrl: 'https://ivo-176774828270.europe-west4.run.app',
  siteUrl: '',
  siteResetUrl: '',
  logLevel: LogLevel.All,
  logName: "IVO-web-prod",
  showflag: false,
  apiLog: true,
  defaultRole: 'admin',
  encryptSecretKey: 'IVO-APP',
  selectedLang: 'nl',
  firebase: {
    apiKey: "AIzaSyCBDZODCN8CaaZ_iEqzMg2I-b5DaTJHDaU",
    authDomain: "actifyleads-396812.firebaseapp.com",
    projectId: "actifyleads-396812",
    storageBucket: "actifyleads-396812.appspot.com",
    messagingSenderId: "169533098123",
    appId: "1:169533098123:web:b5c79106a7e7ee4fd62c8e",
    measurementId: "G-DXKXSPYT0E"
  },
  vapidKey: 'BKoTG7k0p-rVHiYhm-xm1JbDSnQsexXXMB2Mlrgzpi2e03lI7c2LvR0hV1kTFAXfOI0wwfIx-a3xOodTobl5fL0',
};