import React from 'react';
import { Button, PageHeader, Row, Col } from 'antd';
import CampaignCard from './CampaignCard';

const ActiveCampaigns = ({ campaignsDetail }) => {
  return (
    <div>
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
  );
};

export default ActiveCampaigns;
