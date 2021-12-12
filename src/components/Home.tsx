import React, { FC, useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import MetaMaskIcon from './MetaMaskIcon';
import { useWeb3Context } from '../context/SmartContractContext';

const Home: FC = () => {
  const web3 = useWeb3Context();
  const [account, setAccount] = useState<string>();
  const [isConnected, setIsConnected] = useState(false);

  const connectToMetaMask = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setIsConnected(true);
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const isAlreadyConnected = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
      }
    };

    isAlreadyConnected();
  });

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
          <Button variant="primary" onClick={connectToMetaMask} className="d-flex">
            <MetaMaskIcon />
            <div>Connect with MetaMask</div>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Home;
