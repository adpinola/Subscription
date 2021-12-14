import React, { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import MetaMaskIcon from './MetaMaskIcon';
import { useMetaMask, useAccount, useSubscriptionContext } from '../context/SmartContractContext';

const Home: FC = () => {
  const connect = useMetaMask();
  const account = useAccount();
  const contract = useSubscriptionContext();

  const subscribe = async () => {
    const { subscriptionValue } = await contract.getAllContractData(account);
    await contract.subscribe(account, subscriptionValue);
  };

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>Connect your wallet and subscribe!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Contribute with just <b>0.001 ETH</b> and get access to awesome content.
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        {account.length ? (
          <>
            Connected with wallet <b>{account}</b>
            <Button variant="secondary" onClick={subscribe} className="d-flex">
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
