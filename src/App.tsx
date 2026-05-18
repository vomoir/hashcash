import React, { useEffect } from 'react';
import { useHashCashStore } from './store/useHashCashStore';
import { subscribeToBlockchain, subscribeToPendingTransactions, subscribeToWallets, auth, loginAnonymously } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Miner from './components/Miner';
import Exchange from './components/Exchange';
import Blockchain from './components/Blockchain';
import Wallet from './components/Wallet';

const App: React.FC = () => {
  const { setBlockchain, setPendingTransactions, setUserAddress, setCurrentUser, setAllWallets, setMyWallets } = useHashCashStore();

  useEffect(() => {
    // 1. Handle Auth
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        loginAnonymously().catch(console.error);
      }
    });

    // 2. Load existing wallet from localStorage (as a default selection)
    const savedAddress = localStorage.getItem('hashcash_address');
    if (savedAddress) {
      setUserAddress(savedAddress);
    }

    // 3. Subscriptions
    const unsubscribeBlockchain = subscribeToBlockchain((blocks) => {
      setBlockchain(blocks);
    });

    const unsubscribePending = subscribeToPendingTransactions((txs) => {
      setPendingTransactions(txs);
    });

    const unsubscribeWallets = subscribeToWallets((wallets) => {
      setAllWallets(wallets);
      // Filter my wallets based on current user
      const currentUser = auth.currentUser;
      if (currentUser) {
        setMyWallets(wallets.filter(w => w.ownerUid === currentUser.uid));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBlockchain();
      unsubscribePending();
      unsubscribeWallets();
    };
  }, [setCurrentUser, setMyWallets]);

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
