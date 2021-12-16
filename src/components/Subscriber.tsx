import React, { FC, useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { useAccount, useSubscriptionContext } from '../context/SmartContractContext';
import IContractData from '../services/ethereum/IContractData';
import ISubscriberData from '../services/ethereum/ISubscriberData';

const Subscriber: FC = () => {
  const account = useAccount();
  const contract = useSubscriptionContext();
  const [subscriberData, setSubscriberData] = useState<ISubscriberData>({
    isSubscribed: false,
    payedAmount: 0,
    subscribedAt: 0,
  });
  const [contractData, setContractData] = useState<IContractData>({
    owner: '',
    subscriptionValue: 0,
    subscriptionDuration: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const allContractData = await contract.getAllContractData(account);
      const data = await contract.getSubscriberData(account);
      setSubscriberData(data);
      setContractData(allContractData);
    };

    getData();
  }, [account, contract]);

  return (
    <Card border="dark" style={{ width: '32rem' }}>
      <Card.Header>Your subscription</Card.Header>
      <Card.Body>
        <Card.Title>{account}</Card.Title>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <b>Payed amount:</b> {subscriberData.payedAmount} WEI
          </ListGroup.Item>
          <ListGroup.Item>
            <b>Valid From:</b> {new Date(Number(subscriberData.subscribedAt * 1000)).toLocaleString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <b>To:</b> {new Date((Number(subscriberData.subscribedAt) + Number(contractData.subscriptionDuration)) * 1000).toLocaleString()}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Subscriber;
