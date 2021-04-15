import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import getCampaignInstance from '../../../ethereum/campaign';
import { Card } from 'antd';
import CampaignOverview from '../../components/CampaignOverview';
import CampaignContributions from '../../components/CampaignContributions';
import CampaignOrganizer from '../../components/CampaignOrganizer';
import CamapignRequests from '../../components/CampaignRequests';
import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const campaignTabList = [
  {
    key: 'overview',
    tab: 'Overview',
  },
  {
    key: 'organizerInfo',
    tab: 'Organizer',
  },
  {
    key: 'allContributions',
    tab: 'Contributions',
  },
  {
    key: 'allRequests',
    tab: 'Spending Requests',
  },
];

const CampaignShow = ({
  minimumContribution,
  campaignBalance,
  campaignContributorsCount,
  uniqueContributors,
  campaignManager,
  campaignAddress,
  requestCount,
  contractRequests,
}) => {
  const [campaign, setCampaign] = useState(null);
  const [campaignID, setCampaignID] = useState(null);
  const [campaignTab, setCampaignTab] = useState('overview');

  useEffect(() => {
    db.collection('campaigns')
      .where('campaignContractAddress', '==', campaignAddress)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCampaignID(doc.id);
          setCampaign(doc.data());
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }, []);

  const contentListNoTitle = {
    overview: (
      <div>
        {campaign && campaignID && (
          <CampaignOverview
            minimumContribution={minimumContribution}
            campaignBalance={campaignBalance}
            requestCount={requestCount}
            campaignContributorsCount={campaignContributorsCount}
            uniqueContributors={uniqueContributors}
            campaignManager={campaignManager}
            campaign={campaign}
            campaignID={campaignID}
          ></CampaignOverview>
        )}
      </div>
    ),
    organizerInfo: (
      <div>
        {campaign && (
          <CampaignOrganizer
            campaign={campaign}
            campaignManager={campaignManager}
          ></CampaignOrganizer>
        )}
      </div>
    ),
    allContributions: (
      <div>
        {campaignID && (
          <CampaignContributions
            campaignID={campaignID}
          ></CampaignContributions>
        )}
      </div>
    ),
    allRequests: (
      <div>
        {campaignID && (
          <CamapignRequests
            campaignID={campaignID}
            campaignAddress={campaignAddress}
            contractRequests={contractRequests}
            requestCount={requestCount}
            campaignContributorsCount={campaignContributorsCount}
            uniqueContributors={uniqueContributors}
          ></CamapignRequests>
        )}
      </div>
    ),
  };

  return (
    <Layout>
      <Card
        style={{ margin: 'auto', width: '100%' }}
        tabList={campaignTabList}
        activeTabKey={campaignTab}
        onTabChange={(key) => {
          setCampaignTab(key);
        }}
      >
        {contentListNoTitle[campaignTab]}
      </Card>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const campaignInstance = getCampaignInstance(props.query.campaignAddress);
  const campaignSummary = await campaignInstance.methods
    .getCampaignSummary()
    .call();
  const requestCount = await campaignInstance.methods.getRequestsCount().call();
  const campaignRequests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaignInstance.methods.requests(index).call();
      })
  );
  console.log(campaignSummary);
  return {
    minimumContribution: campaignSummary['0'],
    campaignBalance: campaignSummary['1'],
    campaignContributorsCount: campaignSummary['3'],
    uniqueContributors: campaignSummary['4'],
    campaignManager: campaignSummary['5'],
    campaignAddress: props.query.campaignAddress,
    requestCount: requestCount,
    contractRequests: campaignRequests,
  };
};

export default CampaignShow;
