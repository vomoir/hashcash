import React, { useState } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';
import { submitTransaction } from '../services/firebase';

const Exchange: React.FC = () => {
  const { userAddress, balance } = useHashCashStore();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !toAddress) return;

    const tx = {
      from: userAddress,
      to: toAddress,
      amount: amount,
      timestamp: Date.now(),
      status: 'pending'
    };

    setStatus('Submitting transaction...');
    await submitTransaction(tx);
    setStatus('Transaction submitted to pending pool!');
    setAmount(0);
    setToAddress('');
  };

  return (
    <div className="card p-4 mt-4">
      <h3>Exchange Tokens</h3>
      <p>Your Balance: <strong>{balance} HC</strong></p>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label>Recipient Address:</label>
          <input 
            type="text" 
            className="form-control" 
            value={toAddress} 
            onChange={(e) => setToAddress(e.target.value)} 
            placeholder="Enter address"
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input 
            type="number" 
            className="form-control" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))} 
          />
        </div>
        <button type="submit" className="btn btn-success mt-3">Send Tokens</button>
      </form>
      {status && <div className="mt-3 alert alert-secondary">{status}</div>}
    </div>
  );
};

export default Exchange;
