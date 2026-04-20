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
            
            <div className="my-2 border-top pt-2">
              <small className="font-weight-bold">Transactions ({block.transactions?.length || 0}):</small>
              {block.transactions && block.transactions.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {block.transactions.map((tx: any, tIdx: number) => (
                    <li key={tIdx} className="text-muted" style={{ fontSize: '0.8rem' }}>
                      From: <code>{tx.from.substring(0, 10)}...</code> → To: <code>{tx.to.substring(0, 10)}...</code> Amount: <strong>{tx.amount} HC</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>No transactions in this block.</p>
              )}
            </div>
            
            <small>Nonce: {block.nonce} | Miner: {block.miner || 'Unknown'}</small>
          </div>
        ))}
        {blockchain.length === 0 && <p className="text-muted">No blocks mined yet.</p>}
      </div>
    </div>
  );
};

export default Blockchain;
