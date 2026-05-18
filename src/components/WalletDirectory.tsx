import React from 'react';
import { useHashCashStore } from '../store/useHashCashStore';

interface WalletDirectoryProps {
  onSelectAddress: (address: string) => void;
}

const WalletDirectory: React.FC<WalletDirectoryProps> = ({ onSelectAddress }) => {
  const { allWallets, getBalance, userAddress } = useHashCashStore();

  return (
    <div className="mt-3">
      <h5 className="text-secondary small text-uppercase fw-bold">Wallet Directory</h5>
      <div className="list-group list-group-flush border rounded shadow-sm" style={{maxHeight: '200px', overflowY: 'auto'}}>
        {allWallets.length === 0 ? (
          <div className="list-group-item text-center py-3 text-muted">
            No wallets found in directory.
          </div>
        ) : (
          allWallets.map(wallet => (
            <button
              key={wallet.address}
              type="button"
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${wallet.address === userAddress ? 'bg-light disabled' : ''}`}
              onClick={() => onSelectAddress(wallet.address)}
              disabled={wallet.address === userAddress}
            >
              <div className="text-truncate" style={{maxWidth: '70%'}}>
                <div className="fw-bold small">{wallet.label} {wallet.address === userAddress && <span className="badge bg-secondary ms-1">You</span>}</div>
                <code className="text-muted" style={{fontSize: '0.75rem'}}>{wallet.address}</code>
              </div>
              <span className="badge bg-primary rounded-pill">
                {getBalance(wallet.address).toFixed(1)} HC
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletDirectory;
