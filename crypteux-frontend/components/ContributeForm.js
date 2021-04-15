import React, { useContext } from 'react';
import getCampaignInstance from '../../ethereum/campaign';
import { Form, Input, Button, Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import web3 from '../../ethereum/web3';
import firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { Router } from '../routes';
import formStyles from '../styles/components/contribute-form.module.css';

const db = firebase.firestore();

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
};
const validateMessages = {
  required: '${label} is required!',
};

const ContributeForm = ({
  campaignID,
  campaignAddress,
  minimumContribution,
}) => {
  const [form] = Form.useForm();
  const [savingContribution, setSavingContribtuion] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const firebase = useContext(FirebaseContext);

  const onFinish = async (values) => {
    form.resetFields();
    setSavingContribtuion(true);
    const campaignInstance = getCampaignInstance(campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(values.contributionAmount, 'ether'),
      });
      const currentUser = firebase.getCurrentUser();
      db.collection('campaigns')
        .doc(campaignID)
        .collection('contributions')
        .add({
          contributionAmount: values.contributionAmount,
          spendingIdeas: values.spendingIdeas,
          campaignCreator: {
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          },
        })
        .then(() => {
          console.log('Document successfully written!');
        })
        .catch((error) => {
          console.error('Error writing document!', error);
        });
      setSavingContribtuion(false);
      Router.replaceRoute(`/campaign/${campaignAddress}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2 className={formStyles.form__title}>Send us some Ether!</h2>
      <h4 className={formStyles.form__subtitle}>
        Send us a minumum of {minimumContribution} Wei to have a say in how we
        distribute our funds.
      </h4>
      <Form
        {...layout}
        layout="vertical"
        name="create-contribution"
        onFinish={onFinish}
        validateMessages={validateMessages}
        form={form}
        className={formStyles.form__root}
      >
        <Form.Item
          name={'contributionAmount'}
          label="Contribute"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Contribution amount" addonAfter="ether" />
        </Form.Item>
        <Form.Item name={'spendingIdeas'} label="Spending Ideas">
          <Input.TextArea placeholder="Share your thoughts" />
        </Form.Item>

        {savingContribution ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
            <Button
              type="primary"
              htmlType="submit"
              className={formStyles.contribute__button}
            >
              Contribute
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
    </div>
  );
};

export default ContributeForm;
