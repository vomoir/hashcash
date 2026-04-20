import React, { useState, useEffect } from 'react';
import { useHashCashStore } from '../store/useHashCashStore';
import { addBlockToFirestore } from '../services/firebase';

const Miner: React.FC = () => {
  const { mining, setMining, blockchain, userAddress } = useHashCashStore();
  const [level, setLevel] = useState(250);
  const [zeros, setZeros] = useState(2);
  const [status, setStatus] = useState('Idle');
  const [progress, setProgress] = useState({ hashes: 0, time: 0 });
  const [result, setResult] = useState<any>(null);

  const startMining = () => {
    setMining(true);
    setStatus('Mining...');
    setResult(null);

    const salt = Math.floor(Math.random() * 800) + 100;
    const currTime = Date.now();
    const hex_hash_key = `2:${userAddress}:${currTime}:${salt}`;

    const worker = new Worker('/miningWorker.js');
    worker.postMessage({ 
      cmd: 'hash', 
      salt, 
      hex_hash_key, 
      zeros, 
      ipAdd: userAddress, 
      worklevel: level 
    });

    worker.onmessage = async (e) => {
      if (e.data.status === 'progress') {
        setProgress(prev => ({ ...prev, hashes: e.data.appliedHashes }));
      } else if (e.data.status === 'success') {
        const { salt, hash, appliedHashes, timeTaken } = e.data;
        setMining(false);
        setStatus('Success!');
        setProgress({ hashes: appliedHashes, time: timeTaken });
        setResult({ hash, salt });

        if (appliedHashes >= level) {
          // Add to blockchain
          const newBlock = {
            index: blockchain.length,
            timestamp: Date.now(),
            nonce: salt,
            hash: hash,
            previousHash: blockchain.length > 0 ? blockchain[0].hash : '0',
            transactions: [], // In a real scenario, include pending transactions
            miner: userAddress
          };
          await addBlockToFirestore(newBlock);
        } else {
          setStatus('Insufficient work level achieved.');
        }
        worker.terminate();
      }
    };
  };

  return (
    <div className="card p-4">
      <h3>Miner Control</h3>
      <div className="form-group">
        <label>Difficulty (Zeros):</label>
        <input type="number" className="form-control" value={zeros} onChange={(e) => setZeros(Number(e.target.value))} />
      </div>
      <div className="form-group">
        <label>Minimum Work Level:</label>
        <input type="number" className="form-control" value={level} onChange={(e) => setLevel(Number(e.target.value))} />
      </div>
      <button className="btn btn-primary mt-3" onClick={startMining} disabled={mining}>
        {mining ? 'Mining...' : 'Start Mining'}
      </button>

      <div className="mt-4">
        <p>Status: <strong>{status}</strong></p>
        <p>Hashes applied: {progress.hashes}</p>
        {progress.time > 0 && <p>Time taken: {progress.time.toFixed(2)}s</p>}
        {result && (
          <div className="alert alert-info">
            <small>Winning Hash: {result.hash}</small><br/>
            <small>Nonce: {result.salt}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Miner;
