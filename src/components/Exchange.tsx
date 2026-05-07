import React, { useState, useEffect } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';
import { submitTransaction } from '../services/firebase';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Exchange: React.FC = () => {
  const { userAddress, getBalance } = useHashCashStore();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const balance = getBalance(userAddress);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render((decodedText) => {
        setToAddress(decodedText);
        setShowScanner(false);
        if (scanner) {
          scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        }
      }, (error) => {
        // Ignore errors during scanning
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner on unmount", error));
      }
    };
  }, [showScanner]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAddress) {
      setStatus('Please create/load a wallet first.');
      return;
    }
    if (amount <= 0 || !toAddress) return;
    if (amount > balance) {
      setStatus('Insufficient balance!');
      return;
    }

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
    <div className="card p-4 mb-4">
      <h3>Exchange Tokens</h3>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label className="d-flex justify-content-between">
            Recipient Address:
            <button 
              type="button" 
              className={`btn btn-sm ${showScanner ? 'btn-danger' : 'btn-info'}`}
              onClick={() => setShowScanner(!showScanner)}
            >
              {showScanner ? 'Close Scanner' : 'Scan QR Code'}
            </button>
          </label>
          
          {showScanner && <div id="reader" className="mb-2"></div>}

          <input 
            type="text" 
            className="form-control" 
            value={toAddress} 
            onChange={(e) => setToAddress(e.target.value)} 
            placeholder="Paste recipient address here"
          />
        </div>
        <div className="form-group mt-3">
          <label>Amount:</label>
          <input 
            type="number" 
            className="form-control" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))} 
          />
        </div>
        <button type="submit" className="btn btn-success mt-3" disabled={!userAddress}>
          Send Tokens
        </button>
      </form>
      {status && <div className="mt-3 alert alert-info py-2"><small>{status}</small></div>}
    </div>
  );
};

export default Exchange;
