import React, { useEffect } from 'react';
import { useHashCashStore } from './store/useHashCashStore';
import { subscribeToBlockchain, subscribeToPendingTransactions, subscribeToWallets, auth, logout } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Miner from './components/Miner';
import Exchange from './components/Exchange';
import Blockchain from './components/Blockchain';
import Wallet from './components/Wallet';
import Login from './components/Login';
import GodMode from './components/GodMode';

const App: React.FC = () => {
  const { 
    setBlockchain, 
    setPendingTransactions, 
    setUserAddress, 
    setCurrentUser, 
    setAuthError,
    setAuthLoading,
    setAllWallets, 
    setMyWallets,
    currentUser,
    allWallets,
    authLoading,
    isAdmin,
    userAddress
  } = useHashCashStore();

  useEffect(() => {
    // 1. Handle Auth
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      if (user) {
        setAuthError(null);
        // Only store serializable parts of the user object
        setCurrentUser({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName: user.displayName
        });
      } else {
        setCurrentUser(null);
      }
    });

    // 2. Load existing wallet from localStorage
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
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBlockchain();
      unsubscribePending();
      unsubscribeWallets();
    };
  }, [setBlockchain, setPendingTransactions, setUserAddress, setCurrentUser, setAllWallets, setAuthLoading, setAuthError]);

  // 4. Update myWallets whenever currentUser or allWallets changes
  useEffect(() => {
    if (currentUser && allWallets.length > 0) {
      const filtered = allWallets.filter(w => w.ownerUid === currentUser.uid);
      setMyWallets(filtered);

      // If no wallet is currently selected, but the user has wallets, auto-select the first one
      if (!userAddress && filtered.length > 0) {
        setUserAddress(filtered[0].address);
        localStorage.setItem('hashcash_address', filtered[0].address);
      }
    } else {
      setMyWallets([]);
    }
  }, [currentUser, allWallets, setMyWallets, setUserAddress, userAddress]);

  if (authLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="container py-5">
      <header className="d-flex justify-content-between align-items-center mb-5">
        <div className="text-start">
          <h1>HashCash Simulator</h1>
          <p className="lead mb-0">Teaching the basics of Blockchain and Proof of Work</p>
        </div>
        <div className="text-end">
          <div className="small text-muted mb-1">
            Logged in as: <strong>{currentUser.displayName || (currentUser.isAnonymous ? 'Guest' : currentUser.email)}</strong>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      {isAdmin && <GodMode />}

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
