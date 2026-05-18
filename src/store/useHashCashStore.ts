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

export interface WalletInfo {
  address: string;
  ownerUid: string;
  createdAt: number;
  label: string;
}

interface HashCashState {
  blockchain: Block[];
  pendingTransactions: Transaction[];
  mining: boolean;
  userAddress: string;
  currentUser: any | null;
  isAdmin: boolean;
  authError: string | null;
  authLoading: boolean;
  myWallets: WalletInfo[];
  allWallets: WalletInfo[];
  setBlockchain: (blocks: Block[]) => void;
  setPendingTransactions: (txs: Transaction[]) => void;
  setMining: (isMining: boolean) => void;
  setUserAddress: (address: string) => void;
  setCurrentUser: (user: any) => void;
  setAuthError: (error: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setMyWallets: (wallets: WalletInfo[]) => void;
  setAllWallets: (wallets: WalletInfo[]) => void;
  // Computed balance helper
  getBalance: (address: string) => number;
  }

  export const useHashCashStore = create<HashCashState>((set, get) => ({
  blockchain: [],
  pendingTransactions: [],
  mining: false,
  userAddress: '',
  currentUser: null,
  isAdmin: false,
  authError: null,
  authLoading: true,
  myWallets: [],
  allWallets: [],
  setBlockchain: (blocks) => set({ blockchain: blocks }),
  setPendingTransactions: (pendingTransactions) => set({ pendingTransactions }),
  setMining: (isMining) => set({ mining: isMining }),
  setUserAddress: (userAddress) => set({ userAddress }),
  setCurrentUser: (currentUser) => set({ currentUser, isAdmin: currentUser?.email === 'vomoir@gmail.com' }),
  setAuthError: (authError) => set({ authError }),
  setAuthLoading: (authLoading) => set({ authLoading }),
  setMyWallets: (myWallets) => set({ myWallets }),
  setAllWallets: (allWallets) => set({ allWallets }),
  
  getBalance: (address: string) => {
    let balance = 0;
    const miningReward = 6.25;

    // 1. Calculate confirmed balance from blockchain
    get().blockchain.forEach(block => {
      if (block.miner === address) {
        balance += miningReward;
      }
      
      block.transactions?.forEach(tx => {
        if (tx.to === address) balance += tx.amount;
        if (tx.from === address) balance -= tx.amount;
      });
    });

    // 2. Include pending transactions for immediate feedback
    get().pendingTransactions.forEach(tx => {
      if (tx.to === address) balance += tx.amount;
      if (tx.from === address) balance -= tx.amount;
    });

    return balance;
  }
}));
