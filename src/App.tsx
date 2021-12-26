import React, { FC, useEffect, useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';
import Subscriber from './components/Subscriber';
import { useAccount } from './context/SmartContractContext';
import './styles/App.scss';

const App: FC = () => {
  const account = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const onSuccess = (ownership: boolean) => {
    setIsSubscribed(true);
    setIsOwner(ownership);
  };

  useEffect(() => {
    setIsOwner(false);
    setIsSubscribed(false);
  }, [account]);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onSuccess={onSuccess} />} />
          <Route path="/admin" element={<PrivateRoute authCondition={isOwner} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="/" element={<PrivateRoute authCondition={isSubscribed} />}>
            <Route path="/" element={<Subscriber />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
