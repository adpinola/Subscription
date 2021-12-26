import React, { FC, useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useAccount, useSubscriptionContext } from '../context/SmartContractContext';
import IContractData from '../services/ethereum/IContractData';
import '../styles/Admin.scss';

const Admin: FC = () => {
  const account = useAccount();
  const contract = useSubscriptionContext();
  const [contractData, setContractData] = useState<IContractData>({
    owner: '',
    subscriptionValue: 0,
    subscriptionDuration: 0,
  });
  const [creationDate, setCreationDate] = useState(0);
  const [balance, setBalance] = useState(0);
  const [subscribers, setSubscribers] = useState<Array<string>>([]);

  // #region Load initial data
  useEffect(() => {
    const getData = async () => {
      const allContractData = await contract.getAllContractData(account);
      const { subscribedAt } = await contract.getSubscriptionData(account);
      const contractBalance = await contract.getBalance(account);
      const subscribersList = await contract.getAllSubscribers(account);
      setCreationDate(subscribedAt);
      setContractData(allContractData);
      setBalance(contractBalance);
      setSubscribers(subscribersList);
    };

    getData();
    contract.onSubscriptionSuccess('', getData);

    return () => {
      contract.offSubscriptionSuccess('', getData);
    };
  }, [account, contract]);
  // #endregion

  return (
    <Card border="dark" style={{ width: '32rem' }}>
      <Card.Header>Contract Information</Card.Header>
      <Card.Body>
        <Card.Title>Balance: {balance} WEI</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Cration date: {new Date(Number(creationDate * 1000)).toLocaleString()}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted"># of subscribers: {subscribers.length}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Subscription price: {contractData.subscriptionValue} WEI</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Subscription duration: {contractData.subscriptionDuration / 60} min</Card.Subtitle>
        <br />
        <Card.Text className="text-muted">Subscribers</Card.Text>
        <ListGroup variant="flush" className="subscriber-list">
          {subscribers.map((subscriber) => (
            <ListGroup.Item className="text-muted" key={subscriber}>
              {subscriber}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Admin;
