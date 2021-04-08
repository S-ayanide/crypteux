import React from 'react';
import { Divider } from 'antd';
import organizerStyles from '../styles/components/campaign-organizer.module.css';

const CampaignOrganizer = ({ campaign, campaignManager }) => {
  return (
    <div className={organizerStyles.root}>
      <h1 className={organizerStyles.heading}>Meet the Organizer:</h1>
      <img
        src={campaign.campaignCreator.photoURL}
        alt="profile-pic"
        className={organizerStyles.organizer__image}
      />
      <h1 className={organizerStyles.subheading}>
        {campaign.campaignCreator.name}
      </h1>
      <h4>Biography:</h4>
      {campaign.campaignCreator.bio ? (
        <p>{campaign.campaignCreator.bio}</p>
      ) : (
        <p className={organizerStyles.missing__bio}>
          No biography was entered.
        </p>
      )}
      <Divider />
      <h1 className={organizerStyles.heading}>Contact Information:</h1>
      <div className={organizerStyles.info__item}>
        <h4>Email Address:</h4>
        <span>{campaign.campaignCreator.email}</span>
      </div>
      <div className={organizerStyles.info__item}>
        <h4>ETH Smart Contract Address:</h4>
        <span>{campaignManager}</span>
      </div>
    </div>
  );
};

export default CampaignOrganizer;
