import '../styles/globals.css';
import React, { useState, createContext, useEffect } from 'react';
import { FirebaseProvider } from '../contexts/FirebaseContext';

export const UserContext = createContext();

const MyApp = ({ Component, pageProps }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uid, setUid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const userContext = {
    isAuthenticated,
    uid,
    setUid,
    setIsAuthenticated,
    displayName,
    setDisplayName,
    email,
    setEmail,
    photoURL,
    setPhotoURL,
  };

  useEffect(() => {
    if (
      localStorage.uid &&
      localStorage.displayName &&
      localStorage.email &&
      localStorage.photoURL
    ) {
      setIsAuthenticated(true);
      setUid(localStorage.uid);
      setDisplayName(localStorage.displayName);
      setEmail(localStorage.email);
      setPhotoURL(localStorage.photoURL);
    }
  }, []);

  return (
    <FirebaseProvider>
      <UserContext.Provider value={userContext}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </FirebaseProvider>
  );
};

export default MyApp;
