import React, { FC, useEffect, useState, useCallback } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { FaEthereum } from 'react-icons/fa';
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

  const getData = useCallback(async () => {
    const allContractData = await contract.getAllContractData(account);
    const { subscribedAt } = await contract.getSubscriptionData(account);
    const contractBalance = await contract.getBalance(account);
    const subscribersList = await contract.getAllSubscribers(account);
    setCreationDate(subscribedAt);
    setContractData(allContractData);
    setBalance(contractBalance);
    setSubscribers(subscribersList);
  }, [account, contract]);

  // #region Load initial data
  useEffect(() => {
    getData();
    contract.onSubscriptionSuccess('', getData);

    return () => {
      contract.offSubscriptionSuccess('', getData);
    };
  }, [account, contract, getData]);
  // #endregion

  const withdraw = async () => {
    await contract.withdraw(account);
    getData();
  };

  return (
    <Card border="dark" style={{ width: '32rem' }}>
      <Card.Header>Contract Information</Card.Header>
      <Card.Body>
        <Card.Title>Balance: {balance} WEI</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Cration date: {new Date(Number(creationDate * 1000)).toLocaleString()}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted"># of subscribers: {subscribers.length}</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Subscription price: {contractData.subscriptionValue} WEI</Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Subscription duration: {contractData.subscriptionDuration / 60} min</Card.Subtitle>
      </Card.Body>
      <Card.Body>
        <Card.Text className="text-muted">Subscribers</Card.Text>
        <ListGroup variant="flush" className="subscriber-list">
          {subscribers.map((subscriber) => (
            <ListGroup.Item className="text-muted" key={subscriber}>
              {subscriber}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Body>
        <Button variant="primary" onClick={withdraw} className="d-flex align-items-center">
          <FaEthereum />
          <div>Withdraw</div>
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Admin;
