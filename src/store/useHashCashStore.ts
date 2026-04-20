import { create } from 'zustand';

export interface Transaction {
  id?: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

export interface Block {
  index: number;
  timestamp: number;
  nonce: number;
  hash: string;
  previousHash: string;
  transactions: Transaction[];
  miner: string;
}

interface HashCashState {
  blockchain: Block[];
  pendingTransactions: Transaction[];
  mining: boolean;
  userAddress: string;
  setBlockchain: (blocks: Block[]) => void;
  setPendingTransactions: (txs: Transaction[]) => void;
  setMining: (isMining: boolean) => void;
  setUserAddress: (address: string) => void;
  // Computed balance helper
  getBalance: (address: string) => number;
}

export const useHashCashStore = create<HashCashState>((set, get) => ({
  blockchain: [],
  pendingTransactions: [],
  mining: false,
  userAddress: '',
  setBlockchain: (blocks) => set({ blockchain: blocks }),
  setPendingTransactions: (pendingTransactions) => set({ pendingTransactions }),
  setMining: (isMining) => set({ mining: isMining }),
  setUserAddress: (userAddress) => set({ userAddress }),
  
  getBalance: (address: string) => {
    let balance = 0;
    const miningReward = 6.25; // Standard Bitcoin-style reward

    get().blockchain.forEach(block => {
      // 1. Reward the miner
      if (block.miner === address) {
        balance += miningReward;
      }
      
      // 2. Process transactions in the block
      block.transactions?.forEach(tx => {
        if (tx.to === address) {
          balance += tx.amount;
        }
        if (tx.from === address) {
          balance -= tx.amount;
        }
      });
    });
    return balance;
  }
}));
