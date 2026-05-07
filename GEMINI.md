# HashCash Simulator

A simple React-based cryptocurrency miner and blockchain simulator designed for educational purposes. It demonstrates the fundamentals of Proof of Work (PoW), transaction pools, and blockchain synchronization using Firebase.

## Project Overview

- **Purpose:** Teach the basics of blockchain technology, specifically mining and transaction processing.
- **Core Technologies:**
  - **Frontend:** React 18 with TypeScript.
  - **Build Tool:** Vite.
  - **State Management:** Zustand (see `src/store/useHashCashStore.ts`).
  - **Backend:** Firebase Firestore for real-time data persistence (blockchain and pending transactions).
  - **Mining:** Web Worker implementation (`public/miningWorker.js`) performing SHA-1 based Proof of Work.
  - **Styling:** Bootstrap 5 (CSS classes).

Note: The root directory contains `hashcash.html` and a `js/` folder which appear to be part of a legacy jQuery-based version of this application. The active development is focused on the React version in the `src/` directory.

## Architecture

- **`src/components/`**:
  - `Miner.tsx`: Controls for the mining process, managing difficulty and work level.
  - `Wallet.tsx`: Displays the user's "address", calculated balance, and a generated QR code for easy sharing.
  - `Exchange.tsx`: UI for sending transactions to the pending pool, including a QR code scanner to quickly set the recipient address.
  - `Blockchain.tsx`: Visualizes the current state of the chain.
- **`src/services/firebase.ts`**: Handles all Firestore interactions including subscriptions and document creation.
- **`src/store/useHashCashStore.ts`**: The central source of truth for the local application state, including balance calculation logic.
- **`public/miningWorker.js`**: Background worker that performs the CPU-intensive hashing for mining.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

## Development Conventions

- **Component Structure:** Functional components with TypeScript interfaces for props and state.
- **State Management:** Use Zustand for global state. Avoid prop drilling where possible.
- **Real-time Updates:** Firebase `onSnapshot` is used for live updates. Ensure listeners are cleaned up in `useEffect` returns.
- **Mining Difficulty:** The difficulty is configurable in the UI via the "Zeros" and "Minimum Work Level" inputs.

## Firebase Configuration

The project is pre-configured with a Firebase project. To use your own:
1. Update `src/services/firebase.ts` with your project's configuration.
2. Ensure you have a `blockchain` and `transactions` collection in Firestore.
3. Configure Firestore rules as seen in `firestore.rules`.
