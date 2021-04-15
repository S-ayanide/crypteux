import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'antd';
import { List, Avatar } from 'antd';
import { Link, Router } from '../routes';
import web3 from '../../ethereum/web3';
import getCampaignInstance from '../../ethereum/campaign';

const CampaignRequestRow = ({
  request,
  campaignAddress,
  campaignContributorsCount,
  uniqueContributors,
}) => {
  const [errorApproveMessage, setErrorApproveMessage] = React.useState('');
  const [errorFinalizeMessage, setErrorFinalizeMessage] = React.useState('');
  const [approvingRequest, setApprovingRequest] = React.useState(false);
  const [finalizingRequest, setFinalizingRequest] = React.useState(false);

  const acceptSpendingRequest = async (spendingRequestIndex) => {
    const campaignInstance = getCampaignInstance(campaignAddress);
    setApprovingRequest(true);
    setErrorApproveMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods
        .approveSpendingRequest(spendingRequestIndex)
        .send({
          from: accounts[0],
        });
    } catch (error) {
      setErrorApproveMessage(error.message);
    }
    setApprovingRequest(false);
    //Router.replaceRoute(`/campaign/${campaignAddress}`);
  };

  const finalizeSpendingRequest = async (spendingRequestIndex) => {
    const campaignInstance = getCampaignInstance(campaignAddress);
    setFinalizingRequest(true);
    setErrorFinalizeMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods
        .finalizeSpendingRequest(spendingRequestIndex)
        .send({
          from: accounts[0],
        });
    } catch (error) {
      setErrorFinalizeMessage(error.message);
    }
    setFinalizingRequest(false);
  };
  return (
    <div>
      <List.Item
        key={request.id}
        actions={[
          <div>
            {!request.approvalStatus && (
              <Button
                loading={approvingRequest}
                style={{ color: '#4663ac' }}
                onClick={() =>
                  acceptSpendingRequest(request.firebaseToContractMap)
                }
                type="default"
              >
                Accept
              </Button>
            )}
          </div>,
          <div>
            {!request.approvalStatus && (
              <Button
                loading={finalizingRequest}
                style={{ color: '#4663ac' }}
                onClick={() =>
                  finalizeSpendingRequest(request.firebaseToContractMap)
                }
                type="default"
              >
                Finalize
              </Button>
            )}
          </div>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={request.requestCreator.photoURL} />}
          title={<a href="https://ant.design">{request.requestCreator.name}</a>}
          description={
            <div>
              <p>{request.description}</p>
              <p>{`Recipient Address - ${request.recipientAddress}`}</p>
              <p
                style={{ fontWeight: '800' }}
              >{`${request.approvalCount}/${uniqueContributors} Approved`}</p>
              {errorApproveMessage.length > 0 && (
                <Alert
                  message="Error approving spending request. You have either already approved once or are not a campaign contributor."
                  type="error"
                  closable
                  onClose={() => {}}
                  style={{ margin: 'auto', width: '80%' }}
                />
              )}
              {errorFinalizeMessage.length > 0 && (
                <Alert
                  message="Error finalizing spending request. You need to be the campaign manager and have enough approval votings to finalize the request."
                  type="error"
                  closable
                  onClose={() => {}}
                  style={{ margin: 'auto', width: '80%' }}
                />
              )}
            </div>
          }
        />
        <div
          style={{ fontWeight: '500', fontSize: '14px' }}
        >{`${request.spendingAmount} Ether to Spend`}</div>
      </List.Item>
    </div>
  );
};

export default CampaignRequestRow;
