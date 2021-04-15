import React from 'react';
import { Divider, Row, Col } from 'antd';
import web3 from '../../ethereum/web3';
import ContributeForm from './ContributeForm';
import overviewStyles from '../styles/components/campaign-overview.module.css';

const CampaignOverview = ({
  minimumContribution,
  campaignBalance,
  requestCount,
  campaignContributorsCount,
  uniqueContributors,
  campaign,
  campaignID,
}) => {
  const balanceInEther = web3.utils.fromWei(campaignBalance, 'ether');
  return (
    <div>
      <div className={overviewStyles.overview__info}>
        <Row gutter={32}>
          <Col lg={11}>
            <div className={overviewStyles.header}>
              <h1 className={overviewStyles.overview__title}>
                {campaign.title}
              </h1>
              <p className={overviewStyles.overview__description}>
                {campaign.description}
              </p>
            </div>
          </Col>
          <Col lg={13}>
            <img
              src={campaign.imageURL}
              alt='cover-photo'
              className={overviewStyles.cover__photo}
            />
          </Col>
        </Row>
        <Divider />
        {campaignID && (
          <ContributeForm
            campaignID={campaignID}
            campaignAddress={campaign.campaignContractAddress}
            minimumContribution={minimumContribution}
          />
        )}
        <Divider />
        <Row>
          <Col lg={12}>
            <h2 className={overviewStyles.overview__subtitle}>
              Campaign Information:
            </h2>
            <div className={overviewStyles.overview__item}>
              <h3> Contributers:</h3>
              <span>{uniqueContributors}</span>
            </div>
            <div className={overviewStyles.overview__item}>
              <h3>Total Contributions:</h3>
              <span>{campaignContributorsCount}</span>
            </div>

            <div className={overviewStyles.overview__item}>
              <h3>Current Funding Balance (Ether):</h3>
              <span>{balanceInEther}</span>
            </div>
            <div className={overviewStyles.overview__item}>
              <h3>Spending Requests:</h3> <span>{requestCount}</span>
            </div>
            <div className={overviewStyles.overview__item}>
              <h3>Minimum Contribution for Voting Privileges (Wei):</h3>
              <span>{minimumContribution}</span>
            </div>
            <div className={overviewStyles.overview__item}>
              <h3>ETH Smart Contract Address:</h3>
              <span>{campaign.campaignContractAddress}</span>
            </div>
          </Col>
          <Col lg={12}></Col>
        </Row>
      </div>
    </div>
  );
};

export default CampaignOverview;
