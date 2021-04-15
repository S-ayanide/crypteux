import React from 'react';
import { Card } from 'antd';
import { Link } from '../routes';
import cardStyles from '../styles/components/campaign-card.module.css';

const CampaignCard = ({ campaign }) => {
  return (
    <div>
      <Card
        hoverable
        cover={
          <img
            alt='cover-image'
            src={campaign.data.imageURL}
            className={cardStyles.card__cover}
          />
        }
        extra={
          <Link route={`campaign/${campaign.data.campaignContractAddress}`}>
            <a>View Campaign</a>
          </Link>
        }
        title={campaign.data.title}
        className={cardStyles.card__root}
      >
        <div className={cardStyles.card__info}>
          <div className={cardStyles.card__info__item}>
            <h4 style={{color:"rgb(73, 77, 130)", fontWeight:"bold"}}>Campaign Organizer:</h4>
            <span className={cardStyles.card__info__sub}>
              {campaign.data.campaignCreator.name}
            </span>
            <img
              alt='creator-image'
              src={campaign.data.campaignCreator.photoURL}
              className={cardStyles.card__info__image}
            />
          </div>
          <h4 style={{color:"rgb(73, 77, 130)", fontWeight:"bold"}}>Description:</h4>
          <p className={cardStyles.card__info__sub}>
            {campaign.data.description}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CampaignCard;