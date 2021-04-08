import { Layout } from 'antd';
import 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { Link } from '../routes';
import layoutStyles from '../styles/components/layout.module.css';
const { Header, Footer, Sider, Content } = Layout;

export default (props) => {
  const [logOutSuccess, setLogOutSuccess] = useState(false);
  const firebase = useContext(FirebaseContext);
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
    <div>
      <Header className={layoutStyles.discoverHeader}>
        <div className={layoutStyles.discoverHeaderTitle}>
          <Link route="/">
            <a>Crypteux</a>
          </Link>
        </div>
        <div className={layoutStyles.discoverHeaderButtons}>
          <Link route="/discover">
            <a style={{ margin: '1rem' }}>Campaigns </a>
          </Link>
          <Link route="/dashboard">
            <a style={{ margin: '1rem' }}>Profile </a>
          </Link>
          <a style={{ margin: '1rem' }} onClick={logOut}>
            Logout
          </a>
        </div>
      </Header>
      <Layout>
        <Content className={layoutStyles.discoverContent}>
          {props.children}
        </Content>
      </Layout>
    </div>
  );
};
