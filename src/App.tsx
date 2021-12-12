import React, { FC } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import Subscriber from './components/Subscriber';
import { SmartContractContextProvider } from './context/SmartContractContext';

const App: FC = () => {
  return (
    <div className="App">
      <SmartContractContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/subscriber" element={<Subscriber />} />
          </Routes>
        </BrowserRouter>
      </SmartContractContextProvider>
    </div>
  );
};

export default App;
