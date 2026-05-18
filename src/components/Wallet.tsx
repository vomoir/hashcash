import React, { useState } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';
import { QRCodeSVG } from 'qrcode.react';
import { registerWallet } from '../services/firebase';

const Wallet: React.FC = () => {
  const { userAddress, setUserAddress, getBalance, currentUser, myWallets, authError } = useHashCashStore();
  const [inputAddress, setInputAddress] = useState('');

  const createWallet = async () => {
    const newId = 'user_' + Math.random().toString(36).substr(2, 9);
    if (currentUser) {
      await registerWallet(newId, currentUser.uid);
    }
    setUserAddress(newId);
    localStorage.setItem('hashcash_address', newId);
  };

  const loadWallet = (address: string) => {
    setUserAddress(address);
    localStorage.setItem('hashcash_address', address);
  };

  const balance = getBalance(userAddress);

  return (
    <div className="card p-4 mb-4 border-primary shadow-sm">
      <div className="mb-3">
        <h3 className="mb-0">Your Wallet</h3>
      </div>

      {authError && (
        <div className="alert alert-danger py-2 small mb-3">
          {authError}. Make sure Google and Anonymous Auth are enabled in Firebase.
        </div>
      )}

      {userAddress ? (
        <div className="text-center">
          <div className="mb-3">
            <QRCodeSVG value={userAddress} size={128} />
          </div>
          <p className="mb-1 text-muted small">Active Address:</p>
          <p className="mb-2 text-break"><code>{userAddress}</code></p>
          <p className="display-4 text-success mb-3">{balance.toFixed(2)} HC</p>
          <div className="d-grid gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setUserAddress('')}>
              Switch to Another Wallet
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn btn-primary w-100 mb-3" onClick={createWallet}>
            <i className="bi bi-plus-circle me-2"></i>Create New Wallet
          </button>
          
          <div className="input-group mb-4">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter address manually" 
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={() => loadWallet(inputAddress.trim())}>Load</button>
          </div>

          {myWallets.length > 0 && (
            <div>
              <h5 className="mb-3 text-secondary">My Wallets</h5>
              <div className="list-group list-group-flush">
                {myWallets.map(wallet => (
                  <button 
                    key={wallet.address} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    onClick={() => loadWallet(wallet.address)}
                  >
                    <div>
                      <div className="fw-bold text-truncate" style={{maxWidth: '150px'}}>{wallet.label}</div>
                      <code className="small">{wallet.address}</code>
                    </div>
                    <span className="badge bg-success rounded-pill">
                      {getBalance(wallet.address).toFixed(1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
