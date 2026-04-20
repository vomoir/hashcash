import React, { useEffect } from 'react';
import { useHashCashStore } from './store/useHashCashStore';
import { subscribeToBlockchain } from './services/firebase';
import Miner from './components/Miner';
import Exchange from './components/Exchange';
import Blockchain from './components/Blockchain';

const App: React.FC = () => {
  const { setBlockchain, setUserAddress } = useHashCashStore();

  useEffect(() => {
    // Generate a simple anonymous ID for the user
    const id = 'user_' + Math.random().toString(36).substr(2, 9);
    setUserAddress(id);

    // Subscribe to blockchain updates from Firestore
    const unsubscribe = subscribeToBlockchain((blocks) => {
      setBlockchain(blocks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1>HashCash Simulator</h1>
        <p className="lead">Teaching the basics of Blockchain and Proof of Work</p>
      </header>

      <div className="row">
        <div className="col-md-6">
          <Miner />
          <Exchange />
        </div>
        <div className="col-md-6">
          <Blockchain />
        </div>
      </div>
    </div>
  );
};

export default App;
