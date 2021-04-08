import React, { createContext } from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from '../config/firebase.js';

const FirebaseContext = createContext();

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const authProvider = new firebase.auth.GoogleAuthProvider();

const Firebase = {
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  signIn: async () => {
    try {
      const loginSuccess = await firebase.auth().signInWithPopup(authProvider);
      return loginSuccess;
    } catch (error) {
      throw new Error(error);
    }
  },
  logOut: async () => {
    try {
      await firebase.auth().signOut();
      return true;
    } catch (error) {
      console.error('Error logging out!', error);
    }
    return false;
  },
};

const FirebaseProvider = (props) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseContext, FirebaseProvider };
