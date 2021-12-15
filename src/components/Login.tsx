import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import MetaMaskIcon from './MetaMaskIcon';
import { useMetaMask, useAccount, useSubscriptionContext } from '../context/SmartContractContext';

enum LoginStatus {
  Disconnected = 'DISCONNECTED',
  Connected = 'CONNECTED',
  Succeeded = 'SUCCEEDED',
}

interface ILogin {
  onSuccess: () => void;
}

const Login: FC<ILogin> = ({ onSuccess }: ILogin) => {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Disconnected);
  const connect = useMetaMask();
  const account = useAccount();
  const navigate = useNavigate();
  const contract = useSubscriptionContext();

  contract.onSubscriptionSuccess(account, (data: any) => {
    const { from, subscribedAt } = data.returnValues;
    console.log({ event: data.event, from, subscribedAt });
    setLoginStatus(LoginStatus.Succeeded);
  });

  const subscribe = async () => {
    const { subscriptionValue } = await contract.getAllContractData(account);
    if (await contract.isSubscriptionValid(account)) {
      setLoginStatus(LoginStatus.Succeeded);
    } else {
      await contract.subscribe(account, subscriptionValue);
    }
  };

  const connectWallet = async () => {
    await connect();
    setLoginStatus(LoginStatus.Connected);
  };

  const access = async () => {
    navigate('/');
  };

  useEffect(() => {
    if (loginStatus !== LoginStatus.Succeeded) return;
    onSuccess();
  }, [loginStatus, onSuccess]);

  useEffect(() => {
    if (!account) return;
    if (loginStatus !== LoginStatus.Disconnected) return;
    setLoginStatus(LoginStatus.Connected);
  }, [account, loginStatus]);

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>Connect your wallet and subscribe!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Contribute with just <b>0.001 ETH</b> and get access to awesome content.
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        {loginStatus === LoginStatus.Disconnected && (
          <Button variant="primary" onClick={connectWallet} className="d-flex">
            <MetaMaskIcon />
            <div>Connect with MetaMask</div>
          </Button>
        )}
        {loginStatus === LoginStatus.Connected && (
          <>
            Connected with wallet <b>{account}</b>
            <Button variant="secondary" onClick={subscribe} className="d-flex">
              <div>Subscribe Now!!</div>
            </Button>
          </>
        )}
        {loginStatus === LoginStatus.Succeeded && (
          <>
            Connected with wallet <b>{account}</b>
            <Button variant="secondary" onClick={access} className="d-flex">
              <div>Access Site</div>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
