import { BranchesOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row } from 'antd';
import firebase from 'firebase';
import 'firebase/firestore';
import Head from 'next/head';
import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';
import LandingIllustration from '../public/landing-illustration.svg';
import { Link } from '../routes';
import landingStyles from '../styles/pages/landing.module.css';
import { UserContext } from './_app';
const { Header } = Layout;

const db = firebase.firestore();

const Landing = () => {
  const firebase = useContext(FirebaseContext);
  const {
    isAuthenticated,
    setUid,
    setDisplayName,
    setEmail,
    setPhotoURL,
  } = useContext(UserContext);
  const [signInError, setSignInError] = useState(false);

  const signIn = async () => {
    try {
      const result = await firebase.signIn();
      const { uid, email, displayName, photoURL } = await result.user;
      setSignInError(false);
      writeUserToFirebase(uid, displayName, email, photoURL);
    } catch (error) {
      setSignInError(true);
    }
  };

  const writeUserToFirebase = (uid, displayName, email, photoURL) => {
    db.collection('users')
      .add({
        uid: uid,
        displayName: displayName,
        email: email,
        photoURL: photoURL,
      })
      .then(() => {
        console.log('User successfully written');
        setUserStateAndRedirect(uid, displayName, email, photoURL);
      })
      .catch((error) => {
        console.error('Error writing user', error);
      });
  };

  const setUserStateAndRedirect = (uid, displayName, email, photoURL) => {
    setUid(uid);
    setDisplayName(displayName);
    setEmail(email);
    setPhotoURL(photoURL);
    localStorage.setItem('uid', uid);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('email', email);
    localStorage.setItem('photoURL', photoURL);
    window.location.href = '/dashboard';
  };

  const removeUserStateWrapper = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('displayName');
    localStorage.removeItem('photoURL');
    window.location.href = '/';
  };

  const logOut = async () => {
    const loggedOut = await firebase.logOut();
    if (loggedOut) {
      removeUserStateWrapper();
    }
  };

  return (
    <Layout className={landingStyles.root}>
      <Head>
        <title>Welcome to crypteux!</title>
      </Head>
      <Header className={landingStyles.discoverHeader}>
        <div className={landingStyles.discoverHeaderTitle}>
          <Link route='/'>
            <a>
              <BranchesOutlined className={landingStyles.branches__icon} />
              crypteux
            </a>
          </Link>
        </div>
        {isAuthenticated && (
          <div className={landingStyles.discoverHeaderButtons}>
            <Link route='/discover'>
              <a style={{ margin: '1rem' }}>Campaigns </a>
            </Link>
            <Link route='/dashboard'>
              <a style={{ margin: '1rem' }}>Profile </a>
            </Link>
            <a style={{ margin: '1rem' }} onClick={logOut}>
              Logout
            </a>
          </div>
        )}
      </Header>

      <div className={landingStyles.cover}>
        <Row className={landingStyles.row}>
          <Col md={12}>
            <LandingIllustration />
          </Col>
          <Col md={12} className={landingStyles.cover__text}>
            <h1 className={landingStyles.title}>
              crypteux <span className={landingStyles.copyright}>&copy;</span>
            </h1>
            <h3 className={landingStyles.subtitle}>
              A transparent, democratized, and secure funding platform for
              grassroots political campaigns.
            </h3>
            {signInError && <p>Error sigining in with Google.</p>}
            <Button onClick={signIn} className={landingStyles.oauth__button}>
              <GoogleOutlined />
              Sign in with Google
            </Button>
          </Col>
        </Row>
      </div>
      <div className={landingStyles.features}>
        <Row
          gutter={32}
          className={`${landingStyles.row} ${landingStyles.row__cards}`}
        >
          <Col md={6} className={landingStyles.feature__item}>
            <h1>Transparency</h1>
            <img
              alt='knowledge-img'
              src='/feature-knowledge.png'
              className={landingStyles.feature__img}
            />
            <p>
              Our voting service allows contributors to have a say in what the
              organization spends their money on. Campaign creators are not able
              to use the funds raised for their organization unless it is
              approved by more than 50% of contributors.
            </p>
          </Col>
          <Col md={6} className={landingStyles.feature__item}>
            <h1>Security</h1>
            <img
              alt='security-img'
              src='/feature-security.png'
              className={landingStyles.feature__img}
            />
            <p>
              We built our payment and voting services using Ethereum Smart
              Contracts. The immutable nature of Smart Contracts combined with
              the cryptographic difficulty in mining blockchains in general
              ensures that fraudulence is near impossible.
            </p>
          </Col>
          <Col md={6} className={landingStyles.feature__item}>
            <h1>Decentralized</h1>
            <img
              alt='decentralized-img'
              src='/feature-decentralized.png'
              className={landingStyles.feature__img}
            />
            <p>
              The decentralized nature of blockchain technology is a trend that
              is revolutionizing the web— and we're in full support of this.
              Without a centralized server in our backend services, users can
              ensure that Crypteux can never tamper with existing data.
            </p>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Landing;
