import React, { useState } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';

const Wallet: React.FC = () => {
  const { userAddress, setUserAddress, getBalance } = useHashCashStore();
  const [inputAddress, setInputAddress] = useState('');

  const createWallet = () => {
    const newId = 'user_' + Math.random().toString(36).substr(2, 9);
    setUserAddress(newId);
    localStorage.setItem('hashcash_address', newId);
  };

  const loadWallet = () => {
    if (inputAddress.trim()) {
      setUserAddress(inputAddress.trim());
      localStorage.setItem('hashcash_address', inputAddress.trim());
    }
  };

  const balance = getBalance(userAddress);

  return (
    <div className="card p-4 mb-4 border-primary">
      <h3>Your Wallet</h3>
      {userAddress ? (
        <div>
          <p className="mb-1">Address: <code>{userAddress}</code></p>
          <p className="display-4 text-success">{balance.toFixed(2)} HC</p>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setUserAddress('')}>
            Switch Wallet
          </button>
        </div>
      ) : (
        <div>
          <button className="btn btn-primary btn-block mb-3" onClick={createWallet}>
            Create New Wallet
          </button>
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Or enter existing address" 
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-secondary" onClick={loadWallet}>Load</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
