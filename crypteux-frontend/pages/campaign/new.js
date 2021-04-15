import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { Form, Input, Button, Alert, Spin, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import factoryInstance from '../../../ethereum/campaignfactory';
import web3 from '../../../ethereum/web3';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import { FirebaseContext } from '../../contexts/FirebaseContext';
import { Router } from '../../routes';
import newStyles from '../../styles/pages/campaign-new.module.css';

const db = firebase.firestore();
const objectStorage = firebase.storage();

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

const CampaignNew = () => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [savingContract, setSavingContract] = React.useState(false);
  const firebase = useContext(FirebaseContext);

  const onFinish = async (values) => {
    form.resetFields();
    setSavingContract(true);
    const createBlockchainCampaign = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        await factoryInstance.methods
          .createCampaign(values.minimumContribution)
          .send({
            from: accounts[0],
          });
        const campaigns = await factoryInstance.methods
          .getDeployedCampaigns()
          .call();
        const campaignContractAddress = campaigns.slice(-1)[0];
        const imageURL = await uploadImage(values.upload.file.originFileObj);
        const currentUser = firebase.getCurrentUser();
        db.collection('campaigns')
          .add({
            title: values.title,
            email: values.email,
            minimumContribution: values.minimumContribution,
            description: values.description,
            imageURL: imageURL,
            campaignContractAddress: campaignContractAddress,
            campaignCreator: {
              name: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              uid: currentUser.uid,
              bio: values.organizerBio,
            },
          })
          .then(() => {
            console.log('Document successfully written!');
          })
          .catch((error) => {
            console.error('Error writing document!', error);
          });
        Router.pushRoute('/discover');
      } catch (error) {
        setErrorMessage(error.message);
      }
      setSavingContract(false);
    };
    createBlockchainCampaign();
  };

  const uploadImage = async (image) => {
    const storageRef = objectStorage.ref();
    const fileRef = storageRef.child(image.name);
    const metadata = { contentType: image.type };
    await fileRef.put(image, metadata);
    const fileURL = await fileRef.getDownloadURL();
    return fileURL;
  };

  return (
    <Layout>
      <div className={newStyles.form__content}>
        <Row gutter={32}>
          <Col md={14}>
            <h1 className={newStyles.form__title}>Create a Campaign</h1>
            <p className={newStyles.form__subtitle}>
              Change the world by starting a grassroot organization that others
              can contribute to.
            </p>
            <Form
              {...layout}
              layout='vertical'
              name='create-organization'
              onFinish={onFinish}
              validateMessages={validateMessages}
              form={form}
            >
              <Form.Item
                name={'title'}
                label='Title'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder='Please enter campaign title' />
              </Form.Item>
              <Form.Item
                name={'email'}
                label='Organization Email'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder='Please enter orginzation email' />
              </Form.Item>
              <Form.Item
                name={'minimumContribution'}
                label='Contribution To Vote'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  placeholder='Please enter minimum contribution amount'
                  addonAfter='wei'
                />
              </Form.Item>
              <Form.Item name={'description'} label='Description'>
                <Input.TextArea placeholder='Please enter a description for the campaign' />
              </Form.Item>
              <Form.Item name={'organizerBio'} label='Organizer Biography'>
                <Input.TextArea placeholder='Please enter a biography' />
              </Form.Item>
              <Form.Item name='upload' label='Upload'>
                <Upload accept='image/png, image/jpeg' listType='picture'>
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
              {savingContract ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className={newStyles.create__button}
                  >
                    Create Organization
                  </Button>
                </Form.Item>
              )}

              {errorMessage.length > 0 && (
                <Alert
                  message='Error Saving Contract'
                  description={errorMessage}
                  type='error'
                  closable
                  onClose={() => {}}
                  style={{ margin: 'auto', width: '30%' }}
                />
              )}
            </Form>
          </Col>
          <Col md={10} className={newStyles.image__container}>
            <img
              alt='voting-illustration'
              src='/voting-illustration.png'
              style={{ width: '100%', height: 'auto' }}
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default CampaignNew;
