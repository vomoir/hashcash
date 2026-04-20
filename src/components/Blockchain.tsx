import React from 'react';
import { useHashCashStore } from '../store/useHashCashStore';

const Blockchain: React.FC = () => {
  const { blockchain } = useHashCashStore();

  return (
    <div className="mt-4">
      <h3>Blockchain Ledger</h3>
      <div className="list-group">
        {blockchain.map((block, idx) => (
          <div key={idx} className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">Block #{block.index}</h5>
              <small>{new Date(block.timestamp).toLocaleString()}</small>
            </div>
            <p className="mb-1 text-truncate">Hash: <code>{block.hash}</code></p>
            <small>Nonce: {block.nonce} | Miner: {block.miner || 'Unknown'}</small>
          </div>
        ))}
        {blockchain.length === 0 && <p className="text-muted">No blocks mined yet.</p>}
      </div>
    </div>
  );
};

export default Blockchain;
