import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../../components/Layout';
import { Form, Input, Button, Alert, Spin, PageHeader, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import getCampaignInstance from '../../../../ethereum/campaign';
import { Router } from '../../../routes';
import web3 from '../../../../ethereum/web3';
import firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseContext } from '../../../contexts/FirebaseContext';
import newStyles from '../../../styles/pages/spending-request-new.module.css';

const db = firebase.firestore();
const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const validateMessages = {
  required: '${label} is required!',
};

const NewSpendingRequest = ({ campaignAddress, requestCount }) => {
  const [campaignID, setCampaignID] = useState(null);
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [savingContract, setSavingContract] = React.useState(false);
  const firebase = useContext(FirebaseContext);

  const onFinish = async (values) => {
    form.resetFields();
    const campaign = getCampaignInstance(campaignAddress);
    setSavingContract(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createSpendingRequest(
          values.description,
          web3.utils.toWei(values.spendingAmount, 'ether'),
          values.recipientAddress
        )
        .send({
          from: accounts[0],
        });
      const currentUser = firebase.getCurrentUser();
      db.collection('campaigns')
        .doc(campaignID)
        .collection('spendingRequests')
        .add({
          title: values.title,
          description: values.description,
          spendingAmount: values.spendingAmount,
          recipientAddress: values.recipientAddress,
          requestCreator: {
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          },
          firebaseToContractMap: requestCount,
        })
        .then(() => {
          console.log('Document successfully written!');
        })
        .catch((error) => {
          console.error('Error writing document!', error);
        });
      Router.pushRoute(`/campaign/${campaignAddress}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSavingContract(false);
  };

  useEffect(() => {
    db.collection('campaigns')
      .where('campaignContractAddress', '==', campaignAddress)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setCampaignID(doc.id);
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }, []);
  return (
    <Layout>
      <div className={newStyles.form__content}>
        <Row gutter={32}>
          <Col md={14}>
            <h1 className={newStyles.form__title}>Create a Spending Request</h1>
            <p className={newStyles.form__subtitle}>
              Suggest what the campaign should contribute to.
            </p>
            <Form
              {...layout}
              layout="vertical"
              name="create-spending-requrdy"
              onFinish={onFinish}
              validateMessages={validateMessages}
              form={form}
            >
              <Form.Item
                name={'title'}
                label="Title"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Please enter request title" />
              </Form.Item>
              <Form.Item
                name={'description'}
                label="Description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea placeholder="Please enter a description for the request" />
              </Form.Item>
              <Form.Item
                name={'spendingAmount'}
                label="Amount to Spend"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  placeholder="Please enter request amount"
                  addonAfter="ether"
                />
              </Form.Item>
              <Form.Item
                name={'recipientAddress'}
                label="Recipient Address"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Please enter your ETH Smart Contract address" />
              </Form.Item>

              {savingContract ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={newStyles.create__button}
                  >
                    Create Request
                  </Button>
                </Form.Item>
              )}

              {errorMessage.length > 0 && (
                <Alert
                  message="Error Saving Contract"
                  description={errorMessage}
                  type="error"
                  closable
                  onClose={() => {}}
                  style={{ margin: 'auto', width: '30%' }}
                />
              )}
            </Form>
          </Col>
          <Col md={10} className={newStyles.image__container}>
            <img
              alt="money-transfer-illustration"
              src="/money-transfer-illustration.png"
              style={{ width: '100%', height: 'auto' }}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

NewSpendingRequest.getInitialProps = async (props) => {
  const campaignInstance = getCampaignInstance(props.query.campaignAddress);
  const requestCount = await campaignInstance.methods.getRequestsCount().call();
  return {
    campaignAddress: props.query.campaignAddress,
    requestCount: requestCount,
  };
};

export default NewSpendingRequest;
