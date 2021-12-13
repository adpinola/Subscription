import React, { FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import MetaMaskIcon from './MetaMaskIcon';
import { useMetaMask, useSubscriptionContext, useAccount } from '../context/SmartContractContext';

const Home: FC = () => {
  const navigate = useNavigate();
  const connect = useMetaMask();
  const subscriptionContract = useSubscriptionContext();
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);

  const checkAccount = useCallback(async () => {
    if (!account) return;
    const contractData = await subscriptionContract.getAllContractData(account);
    if (contractData.owner === account) {
      navigate('/admin');
    } else {
      const amISubscribed = await subscriptionContract.amISubscribed(account);
      if (amISubscribed) {
        navigate('/subscriber');
      }
    }
    setIsConnected(true);
  }, [account, navigate, subscriptionContract]);

  useEffect(() => {
    checkAccount();
  }, [checkAccount]);

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>Connect your wallet and subscribe!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Contribute with just <b>0.001 ETH</b> and get access to awesome content.
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        {isConnected ? (
          <>
            Connected with wallet <b>{account}</b>
            <Button variant="secondary" className="d-flex">
              <div>Subscribe Now!!</div>
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={connect} className="d-flex">
            <MetaMaskIcon />
            <div>Connect with MetaMask</div>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Home;
