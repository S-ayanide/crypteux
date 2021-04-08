import React, { useState, useEffect } from 'react';
import { PageHeader, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from '../routes';
import CampaignRequestRow from './CampaignRequestRow';

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const CampaignRequests = ({
  campaignID,
  campaignAddress,
  contractRequests,
  requestCount,
  uniqueContributors,
  campaignContributorsCount,
}) => {
  const [requests, setRequests] = useState([]);
  const [switchToggled, setSwitchToggled] = useState(false);

  useEffect(() => {
    db.collection('campaigns')
      .doc(campaignID)
      .collection('spendingRequests')
      .onSnapshot((snapshot) =>
        setRequests(
          snapshot.docs
            .filter((doc) =>
              contractRequests[doc.data().firebaseToContractMap]
                ? contractRequests[doc.data().firebaseToContractMap]
                    .complete === switchToggled
                : true
            )
            .map((doc) => ({
              id: doc.id,
              title: doc.data().description,
              description: doc.data().description,
              recipientAddress: doc.data().recipientAddress,
              spendingAmount: doc.data().spendingAmount,
              requestCreator: doc.data().requestCreator,
              firebaseToContractMap: doc.data().firebaseToContractMap,
              approvalCount:
                contractRequests[doc.data().firebaseToContractMap] &&
                contractRequests[doc.data().firebaseToContractMap]
                  .approvalCount,
              approvalStatus:
                contractRequests[doc.data().firebaseToContractMap] &&
                contractRequests[doc.data().firebaseToContractMap].complete,
            }))
        )
      );
  }, [switchToggled]);

  return (
    <div>
      <PageHeader
        className='requests-page-header'
        title='Spending Requests'
        subTitle='Find out how the campaign is spending its funds!'
        extra={[
          <Link route={`/campaign/request/new/${campaignAddress}`}>
            <a>
              <PlusOutlined style={{ marginRight: '5px' }} />
              Create Request
            </a>
          </Link>,
        ]}
      />
      <div style={{ marginLeft: '25px', marginBottom: '20px' }}>
        <span>Needs approval</span>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          style={{ margin: '0 10px' }}
          onChange={(event) => setSwitchToggled(event)}
        />
        <span>Finalized</span>
      </div>
      <List
        dataSource={requests}
        renderItem={(request) => (
          <CampaignRequestRow
            request={request}
            campaignAddress={campaignAddress}
            requestCount={requestCount}
            campaignContributorsCount={campaignContributorsCount}
            uniqueContributors={uniqueContributors}
          />
        )}
      ></List>
    </div>
  );
};

export default CampaignRequests;
