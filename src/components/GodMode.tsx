import React, { useState } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';
import { submitTransaction } from '../services/firebase';

const GodMode: React.FC = () => {
  const { allWallets, isAdmin } = useHashCashStore();
  const [amount, setAmount] = useState(100);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const distributeTokens = async () => {
    if (allWallets.length === 0) {
      setStatus('No wallets to distribute to.');
      return;
    }

    setLoading(true);
    setStatus(`Distributing ${amount} HC to ${allWallets.length} wallets...`);

    try {
      const promises = allWallets.map(wallet => {
        const tx = {
          from: 'GOD_MOD_BENEFACTOR',
          to: wallet.address,
          amount: amount,
          timestamp: Date.now(),
          status: 'pending',
          isGodMode: true
        };
        return submitTransaction(tx);
      });

      await Promise.all(promises);
      setStatus(`Successfully distributed tokens to ${allWallets.length} wallets!`);
    } catch (error: any) {
      console.error("Distribution error:", error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-warning mb-4 shadow-sm bg-light">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <h5 className="mb-0"><i className="bi bi-lightning-charge-fill me-2"></i>God Mode: Benefactor</h5>
        <span className="badge bg-dark">Admin Active</span>
      </div>
      <div className="card-body">
        <p className="card-text small text-muted">
          As a god-like benefactor, you can distribute tokens to every wallet in the directory simultaneously.
        </p>
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <label className="col-form-label fw-bold">Amount per Wallet:</label>
          </div>
          <div className="col-auto">
            <input 
              type="number" 
              className="form-control form-control-sm" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="col-auto">
            <button 
              className="btn btn-warning btn-sm fw-bold" 
              onClick={distributeTokens}
              disabled={loading || allWallets.length === 0}
            >
              {loading ? 'Distributing...' : `Bless ${allWallets.length} Wallets`}
            </button>
          </div>
        </div>
        {status && <div className="mt-3 alert alert-info py-1 px-2 small mb-0">{status}</div>}
      </div>
    </div>
  );
};

export default GodMode;
