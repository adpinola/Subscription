import React, { FC } from 'react';
import { Button, Modal } from 'react-bootstrap';
import MetaMaskIcon from './MetaMaskIcon';

const Home: FC = () => {
  const handleClose = () => {};

  return (
    <Modal show centered>
      <Modal.Header>
        <Modal.Title>Connect your wallet and subscribe!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Contribute with just <b>0.001 ETH</b> and get access to awesome content.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose} className="d-flex">
          <MetaMaskIcon />
          <div>Use MetaMask</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Home;
