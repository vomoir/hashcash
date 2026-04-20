import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from "firebase/firestore";

// Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const blockchainCollection = collection(db, "blockchain");
export const transactionsCollection = collection(db, "transactions");

export const subscribeToBlockchain = (callback: (blocks: any[]) => void) => {
  const q = query(blockchainCollection, orderBy("index", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(blocks);
  });
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
