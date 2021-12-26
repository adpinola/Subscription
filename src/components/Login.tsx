import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import MetaMaskIcon from './MetaMaskIcon';
import { useMetaMask, useAccount, useSubscriptionContext } from '../context/SmartContractContext';
import '../styles/Login.scss';

enum LoginStatus {
  Disconnected = 'DISCONNECTED',
  Connected = 'CONNECTED',
  Succeeded = 'SUCCEEDED',
}

interface ILogin {
  onSuccess: (isOwner: boolean) => void;
}

const Login: FC<ILogin> = ({ onSuccess }: ILogin) => {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.Disconnected);
  const [isOwner, setIsOwner] = useState(false);
  const connect = useMetaMask();
  const account = useAccount();
  const navigate = useNavigate();
  const contract = useSubscriptionContext();

  // #region Account Change
  useEffect(() => {
    const onAccountChange = async () => {
      if (!account || !contract) {
        setLoginStatus(LoginStatus.Disconnected);
        return;
      }
      const { owner } = await contract.getAllContractData(account);
      setIsOwner(owner.toUpperCase() === account.toUpperCase());
      const { subscribed } = await contract.getSubscriptionData(account);
      setLoginStatus(subscribed ? LoginStatus.Succeeded : LoginStatus.Connected);
    };
    onAccountChange();
  }, [account, contract]);
  // #endregion

  // #region Login Success
  useEffect(() => {
    if (loginStatus === LoginStatus.Succeeded) onSuccess(isOwner);
  }, [loginStatus, isOwner, onSuccess]);
  // #endregion

  // #region SubscriptionSuccess event handling
  const loginSuccess = (data: any) => {
    const { from, subscribedAt } = data.returnValues;
    console.log({ event: data.event, from, subscribedAt });
    setLoginStatus(LoginStatus.Succeeded);
  };

  useEffect(() => {
    contract.onSubscriptionSuccess(account, loginSuccess);
    return () => {
      contract.offSubscriptionSuccess(account, loginSuccess);
    };
  }, [contract, account]);
  // #endregion

  // #region Buttons Callback
  const connectWallet = async () => {
    await connect();
    setLoginStatus(LoginStatus.Connected);
  };

  const subscribe = async () => {
    const { subscriptionValue } = await contract.getAllContractData(account);
    const { subscribed } = await contract.getSubscriptionData(account);
    if (subscribed) {
      setLoginStatus(LoginStatus.Succeeded);
    } else {
      await contract.subscribe(account, subscriptionValue);
    }
  };

  const access = async () => {
    navigate('/');
  };

  const goToAdminPage = async () => {
    navigate('/admin');
  };
  // #endregion

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>Connect your wallet and subscribe!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Contribute with just <b>0.01 ETH</b> and get access to awesome content.
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
            <Button variant="primary" onClick={goToAdminPage} className="d-flex align-items-center" disabled={!isOwner}>
              <FaLock />
              <div>Admin Page</div>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
