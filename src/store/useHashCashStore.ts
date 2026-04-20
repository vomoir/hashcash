import { create } from 'zustand';

interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
}

interface Block {
  index: number;
  timestamp: number;
  nonce: number;
  hash: string;
  previousHash: string;
  transactions: Transaction[];
}

interface HashCashState {
  balance: number;
  blockchain: Block[];
  pendingTransactions: Transaction[];
  mining: boolean;
  userAddress: string;
  setBalance: (balance: number) => void;
  setBlockchain: (blocks: Block[]) => void;
  addTransaction: (tx: Transaction) => void;
  setMining: (isMining: boolean) => void;
  setUserAddress: (address: string) => void;
}

export const useHashCashStore = create<HashCashState>((set) => ({
  balance: 0,
  blockchain: [],
  pendingTransactions: [],
  mining: false,
  userAddress: 'anonymous', // In a real app, this would be a user ID or public key
  setBalance: (balance) => set({ balance }),
  setBlockchain: (blocks) => set({ blockchain: blocks }),
  addTransaction: (tx) => set((state) => ({ 
    pendingTransactions: [...state.pendingTransactions, tx] 
  })),
  setMining: (isMining) => set({ mining: isMining }),
  setUserAddress: (userAddress) => set({ userAddress }),
}));
