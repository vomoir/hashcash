import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, doc, writeBatch, setDoc, getDocs, where } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLX5E9TMI1L8tI72dvuGSDvtBu-3KqVjc",
  authDomain: "hashcash-9e9f4.firebaseapp.com",
  projectId: "hashcash-9e9f4",
  storageBucket: "hashcash-9e9f4.firebasestorage.app",
  messagingSenderId: "779730872043",
  appId: "1:779730872043:web:06ce660386712d1bef00ae",
  measurementId: "G-DHCL53HHE9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const blockchainCollection = collection(db, "blockchain");
export const transactionsCollection = collection(db, "transactions");
export const walletsCollection = collection(db, "wallets");

export const loginAnonymously = async () => {
  return signInAnonymously(auth);
};

export const registerWallet = async (address: string, ownerUid: string) => {
  try {
    await setDoc(doc(walletsCollection, address), {
      address,
      ownerUid,
      createdAt: Date.now(),
      label: `Wallet ${address.substring(5, 10)}`
    });
  } catch (e) {
    console.error("Error registering wallet: ", e);
  }
};

export const getMyWallets = async (ownerUid: string) => {
  const q = query(walletsCollection, where("ownerUid", "==", ownerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
};

export const getAllWallets = async () => {
  const snapshot = await getDocs(walletsCollection);
  return snapshot.docs.map(doc => doc.data());
};

export const subscribeToBlockchain = (callback: (blocks: any[]) => void) => {
  const q = query(blockchainCollection, orderBy("index", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(blocks);
  });
};

export const subscribeToPendingTransactions = (callback: (txs: any[]) => void) => {
  const q = query(transactionsCollection, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snapshot) => {
    const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(txs);
  });
};

export const subscribeToWallets = (callback: (wallets: any[]) => void) => {
  return onSnapshot(walletsCollection, (snapshot) => {
    const wallets = snapshot.docs.map(doc => doc.data());
    callback(wallets);
  });
};

export const clearPendingTransactions = async (txIds: string[]) => {
  const batch = writeBatch(db);
  txIds.forEach((id) => {
    const docRef = doc(db, "transactions", id);
    batch.delete(docRef);
  });
  await batch.commit();
};

export const addBlockToFirestore = async (block: any) => {
  try {
    await addDoc(blockchainCollection, block);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const submitTransaction = async (tx: any) => {
  try {
    await addDoc(transactionsCollection, tx);
  } catch (e) {
    console.error("Error adding transaction: ", e);
  }
};
