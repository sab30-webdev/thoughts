import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0rutivzxnaYz_3pWUVrW90tpv2G6-x94",
  authDomain: "thoughts-f86ca.firebaseapp.com",
  projectId: "thoughts-f86ca",
  storageBucket: "thoughts-f86ca.appspot.com",
  messagingSenderId: "922016476882",
  appId: "1:922016476882:web:bd363f73e21ba9c371870b",
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

export const db = firebaseApp.firestore();

export default firebaseApp;
