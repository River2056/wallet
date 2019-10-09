import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import * as serviceWorker from './serviceWorker';
const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
  apiKey: "AIzaSyDNS2UzhovI2_wWsuJ3tJI1A3OcNlhXkyY",
  authDomain: "wallet-e404e.firebaseapp.com",
  databaseURL: "https://wallet-e404e.firebaseio.com",
  projectId: "wallet-e404e",
  storageBucket: "wallet-e404e.appspot.com",
  messagingSenderId: "341690726519",
  appId: "1:341690726519:web:ba6f78967abb74744e6e72",
  measurementId: "G-YL29YY77V6"
});
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
