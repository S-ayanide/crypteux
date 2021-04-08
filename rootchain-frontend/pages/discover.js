import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import factoryInstance from '../../ethereum/campaignfactory';
import CampaignCard from '../components/CampaignCard';
import { Button, PageHeader, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import { Link, Router } from '../routes';
import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const Discover = ({ campaigns }) => {
  const [campaignsDetail, setCampaignsDetail] = useState(null);

  useEffect(() => {
    db.collection('campaigns').onSnapshot((snapshot) =>
      setCampaignsDetail(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);
  return (
    <div>
      <Layout>
        <div>
          <PageHeader
            title="Active Campaigns"
            subTitle="Support political organizations that are advocating for change."
            extra={[
              <Button
                type="text"
                icon={<PlusOutlined />}
                style={{ color: '#4663ac' }}
                onClick={() => Router.push('/campaign/new')}
              >
                Add Campaign
              </Button>,
            ]}
          ></PageHeader>
          {campaignsDetail && (
            <Row gutter={[32, 32]}>
              {campaignsDetail.map((campaign) => (
                <Col sm={24} md={16} lg={8}>
                  <CampaignCard key={campaign.id} campaign={campaign} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Layout>
    </div>
  );
};
Discover.getInitialProps = async () => {
  const campaigns = await factoryInstance.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Discover;
