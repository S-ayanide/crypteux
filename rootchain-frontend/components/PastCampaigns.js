import React from 'react';
import dashboardStyles from '../styles/pages/dashboard.module.css';

const PastCampaigns = ({ contributionData }) => {
  return (
    <table class={dashboardStyles.styledTable}>
      <thead>
        <tr>
          <th>Campaign Name</th>
          <th>Amount Contributed</th>
          <th>Total Amount Collected</th>
        </tr>
      </thead>
      <tbody>
        {contributionData.map((element) => (
          <tr>
            <td>{element.CampaignName}</td>
            <td>{element.AmountContributed}</td>
            <td>{element.AmountColected}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PastCampaigns;
