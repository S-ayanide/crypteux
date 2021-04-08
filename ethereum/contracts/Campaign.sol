// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 _minimumContribution) public {
        Campaign newCampaign = new Campaign(_minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct SpendingRequest {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) requestApprovers;
    }

    SpendingRequest[] public requests;
    address public campaignManager;
    uint256 public minimumContribution;
    mapping(address => bool) public campaignContributors;
    uint256 public campaignContributorsCount;
    uint256 public uniqueContributors;

    modifier restricted() {
        require(msg.sender == campaignManager);
        _;
    }

    constructor(uint256 _minimumContribution, address campaignCreator) {
        campaignManager = campaignCreator;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (campaignContributors[msg.sender]) {
            campaignContributorsCount++;
        } else {
            campaignContributors[msg.sender] = true;
            uniqueContributors++;
            campaignContributorsCount++;
        }
    }

    function createSpendingRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        SpendingRequest storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveSpendingRequest(uint256 requestIndex) public {
        SpendingRequest storage requestToApprove = requests[requestIndex];

        require(campaignContributors[msg.sender]);
        require(!requestToApprove.requestApprovers[msg.sender]);

        requestToApprove.requestApprovers[msg.sender] = true;
        requestToApprove.approvalCount++;
    }

    function finalizeSpendingRequest(uint256 requestIndex) public restricted {
        SpendingRequest storage requestToFinalize = requests[requestIndex];

        require(requestToFinalize.approvalCount > (uniqueContributors / 2));
        require(!requestToFinalize.complete);

        requestToFinalize.recipient.transfer(requestToFinalize.value);
        requestToFinalize.complete = true;
    }

    function getCampaignSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            campaignContributorsCount,
            uniqueContributors,
            campaignManager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
