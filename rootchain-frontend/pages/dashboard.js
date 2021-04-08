import React, { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { UserContext } from './_app';
import dashboardStyles from '../styles/pages/dashboard.module.css';
import Layout from '../components/Layout';
import { Card } from 'antd';
import firebase from 'firebase';
import 'firebase/firestore';
import PastCampaigns from '../components/PastCampaigns';
import PendingApprovals from '../components/PendingApprovals';
import ActiveCampaigns from '../components/ActiveCampaigns';

const db = firebase.firestore();

const userPorfileTabList = [
  {
    key: 'active',
    tab: 'Active Campaigns',
  },
];
const contributionData = [
  {
    CampaignName: 'Project 1',
    AmountContributed: '$1000',
    AmountColected: '$10000',
  },
  {
    CampaignName: 'Project 2',
    AmountContributed: '$2000',
    AmountColected: '$20000',
  },
  {
    CampaignName: 'Project 3',
    AmountContributed: '$3000',
    AmountColected: '$30000',
  },
  {
    CampaignName: 'Project 4',
    AmountContributed: '$4000',
    AmountColected: '$40000',
  },
];

const Dashboard = () => {
  const [campaignsDetail, setCampaignsDetail] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('active');

  const firebase = useContext(FirebaseContext);
  const {
    uid,
    setUid,
    isAuthenticated,
    setIsAuthenticated,
    displayName,
    setDisplayName,
    email,
    setEmail,
    photoURL,
    setPhotoURL,
  } = useContext(UserContext);
  const [didMount, setDidMount] = useState(false);
  const [logOutSuccess, setLogOutSuccess] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    if (didMount && !isAuthenticated) {
      window.location.href = '/';
    } else if (didMount && isAuthenticated) {
      db.collection('campaigns')
        .where('campaignCreator.uid', '==', uid)
        .onSnapshot((snapshot) =>
          setCampaignsDetail(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    } else {
      setDidMount(true);
    }
  }, [didMount]);

  useEffect(() => {
    db.collection('campaigns')
      .where('campaignCreator.uid', '==', uid)
      .onSnapshot((snapshot) =>
        setCampaignsDetail(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const logOut = async () => {
    const loggedOut = await firebase.logOut();
    if (loggedOut) {
      removeUserStateWrapper();
    }
  };

  const removeUserStateWrapper = () => {
    setUid('');
    setDisplayName('');
    setEmail('');
    setPhotoURL('');
    setIsAuthenticated(false);
    localStorage.removeItem('displayName');
    localStorage.removeItem('photoURL');
    window.location.href = '/';
  };

  const contentListNoTitle = {
    active: <ActiveCampaigns campaignsDetail={campaignsDetail} />,
  };

  return (
    <Layout>
      <div className={dashboardStyles.root}>
        <div className={dashboardStyles.accountInfo}>
          <img
            src={photoURL}
            className={dashboardStyles.profile__picture}
            alt="profile-pic"
          />
          <div className={dashboardStyles.details}>
            <div className={dashboardStyles.details__item}>
              <h1>Name:</h1>
              <span>{displayName}</span>
            </div>
            <div className={dashboardStyles.details__item}>
              <h1>Email:</h1>
              <span>{email}</span>
            </div>
            <div className={dashboardStyles.details__item}>
              <h1>ETH Smart Contract Address:</h1>
              <span>0xD3700c3eD96Bc30caB775f823157Cd96070A5f0D</span>
            </div>
          </div>
        </div>
        <div className={dashboardStyles.dashboardConsole}>
          <h1>Dashboard</h1>
          <Card
            style={{ margin: 'auto', width: '100%' }}
            tabList={userPorfileTabList}
            activeTabKey={dashboardTab}
            onTabChange={(key) => {
              setDashboardTab(key);
            }}
          >
            {contentListNoTitle[dashboardTab]}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
