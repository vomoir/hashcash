import React, { useEffect } from 'react';
import { useHashCashStore } from './store/useHashCashStore';
import { subscribeToBlockchain, subscribeToPendingTransactions } from './services/firebase';
import Miner from './components/Miner';
import Exchange from './components/Exchange';
import Blockchain from './components/Blockchain';
import Wallet from './components/Wallet';

const App: React.FC = () => {
  const { setBlockchain, setPendingTransactions, setUserAddress } = useHashCashStore();

  useEffect(() => {
    // Try to load existing wallet from localStorage
    const savedAddress = localStorage.getItem('hashcash_address');
    if (savedAddress) {
      setUserAddress(savedAddress);
    }

    // Subscribe to blockchain updates from Firestore
    const unsubscribeBlockchain = subscribeToBlockchain((blocks) => {
      setBlockchain(blocks);
    });

    // Subscribe to pending transactions pool
    const unsubscribePending = subscribeToPendingTransactions((txs) => {
      setPendingTransactions(txs);
    });

    return () => {
      unsubscribeBlockchain();
      unsubscribePending();
    };
  }, []);

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1>HashCash Simulator</h1>
        <p className="lead">Teaching the basics of Blockchain and Proof of Work</p>
      </header>

      <div className="row">
        <div className="col-md-5">
          <Wallet />
          <Miner />
        </div>
        <div className="col-md-7">
          <Exchange />
          <Blockchain />
        </div>
      </div>
    </div>
  );
};

export default App;
