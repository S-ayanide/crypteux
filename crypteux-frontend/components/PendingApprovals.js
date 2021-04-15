import React from 'react';
import dashboardStyles from '../styles/pages/dashboard.module.css';

const PendingApprovals = ({ contributionData }) => {
  return (
    <table class={dashboardStyles.styledTable}>
      <thead>
        <tr>
          <th>Campaign Name</th>
          <th>Spending Proposal</th>
          <th>Amount Requested</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {contributionData.map((element) => (
          <tr>
            <td>{element.CampaignName}</td>
            <td>{element.AmountContributed}</td>
            <td>
              <button className={dashboardStyles.buttonApprove}>Approve</button>
              <button className={dashboardStyles.buttonReject}>Reject</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PendingApprovals;
