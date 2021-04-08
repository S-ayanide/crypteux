import React, { useState, useEffect } from 'react';
import { List, Avatar } from 'antd';
import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const CampaignContributions = ({ campaignID }) => {
  const [contributions, setContributions] = useState([]);
  useEffect(() => {
    db.collection('campaigns')
      .doc(campaignID)
      .collection('contributions')
      .onSnapshot((snapshot) =>
        setContributions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);
  return (
    <div>
      <List
        dataSource={contributions}
        renderItem={(contribution) => (
          <List.Item key={contribution.id}>
            <List.Item.Meta
              avatar={
                <Avatar src={contribution.data.campaignCreator.photoURL} />
              }
              title={
                <a href='https://ant.design'>
                  {contribution.data.campaignCreator.name}
                </a>
              }
              description={contribution.data.spendingIdeas}
            />
            <div
              style={{ fontWeight: '600', fontSize: '20px' }}
            >{`${contribution.data.contributionAmount} Ether`}</div>
          </List.Item>
        )}
      ></List>
    </div>
  );
};

export default CampaignContributions;
