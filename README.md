# Crypteux

An innovative approach to promote grassroots political engagement in the 21st century. Crypteux is a decentralized and transparent web application built using
Ethereum Blockchain, Smart Contracts, Next.js, and Firebase.

## Problems with the state of the art: Crowdfunding
- As crowdfunding platforms gain popularity, the number of frauds and scams increases by the day, making potential donors and contributors skeptical and even drive them away. With no unbiased middle-man to keep organizer's accountable, the funds they raise can easily be spent incorrectly.
- Another flaw in the existing system of raising money is that these platforms keep up to 5% of the crowdfunded money as profit for themselves and deduct another 5% in transactions fees.
- Lastly, any centralized service allows free-will. As we have seen, large tech companies have been notorious in stepping in and censoring/removing content.

## Our Inspiration 
- Our team wanted to create a way for users to quickly find grassroot political organizations whose campaign and vision statements resonate with them, and contribute to their growth while also having a say in their spending decisions.
- This lead to the birth of Crypteux, which democratizes crowdfunding campaigns by allowing contributors to, after donating a minimum amount, become a vital part of the daily operations of these organizations.
- They do so by overseeing and verifying the legitimacy of their spending decisions, and by approving or rejecting them accordingly.

## How does Crypteux solve the aforementioned problems?
- We built our payment and voting services using Ethereum Smart Contracts. The immutable nature of Smart Contracts combined with the cryptographic difficulty in mining blockchains in general ensures that fraudulence is near impossible.
- Our voting service allows contributors to have a say in what the organization spends their money on. Campaign creators are not able to use the funds raised for their organization unless it is approved by more than 50% of contributors. This brings democracy and transparency to the table.
- The decentralized nature of blockchain technology is a trend that is revolutionizing the web— and we're in full support of this. Without a centralized server in our backend services, users can ensure that Crypteux can never tamper with existing data.

## What it does
- Crypteux allows campaign owners to create a page about their campaign, describing their cause in detail. 
- Users can then find campaigns that interest them and choose to contribute to their organization using cause using cryptocurrency. On donating a minimum amount, contributors gain voting privileges and have a say in what the organization spends their raised funds on. 
- To ensure 100% transparency on where and how the money is spent, campaign creators can never directly access it. They create spending requests with the recipient's unique transaction id preset, which the contributors can view and decide to either approve or reject. 
- Transactions are only finalized when the spending requests are approved by at least 50% of the unique contributors.
- **Since Crypteux operates on a decentralized technology, there is no third-party transaction fee and 100% of the collected money goes to the organizations.**

## How we built it
- Leveraged Ethereum Smart Contracts to power our backend services. We set up a Node.js environment and utilized Solidity, web3, Ganache/TestRPC, and Mocha to create, test, compile, & deploy our smart contract to the Rinkeby Test Network. 
- Within our smart contract, we stored all campaign information in the contracts storage, which we call the "Campaign Factory".
- With respect to our web application, we also stored additional information about the users using Google Firebase's Firestore and Storage, which maps to the contract's data seamlessly.
- We then built our user-interface with Next.js for a server-side-rendered web-application. 
- We also leveraged Ant Design UI library to deliver more of an immersive user experience.

## Challenges we ran into
- We quickly ran into roadblocks after realizing that Blockchain technology is quite new relative to other technologies, and that the community is quickly iterating. When developing the smart contract for the backend, a lot of answers and help online ended up being deprecated. 

## Accomplishments that we're proud of
We knew nothing about the technologies we used before we started this hackathon. 
- Learned how to setup an environment for developing, compiling, and deploying smart contracts using web3, Solidity, Ganache/TestRPC, and Mocha
- Learned how to use Next.js and how it's SSR capabilities differ from a standard React application.

## What we learned
* Utilized React.js with Next.js to provide better performance by Server-side rendering instead of client-side rendering normally done by React.
* Built smart contracts for the backend infrastructure, and deployed them to the Rinkeby test network.
Provided blockchain features such as sending / receiving crypto currency.

## What's next for Crypteux
- We plan to extend this platform for small business, startups and student projects in the near future. This would be a game-changer as the existing ways to raise money have the aforementioned flaws. 
- The front-end can be divided into separate views for political organizations, business and startups to make the user experience smooth and easy.
- We also plan to integrate Crypteux with platforms like Coinbase to give users a seamless ability to buy crypto from the platform and allow new users to create crypto wallets. 
