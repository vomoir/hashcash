import React from 'react';
import { loginAnonymously, loginWithGoogle } from '../services/firebase';
import { useHashCashStore } from '../store/useHashCashStore';

const Login: React.FC = () => {
  const { setAuthError, setAuthLoading } = useHashCashStore();

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Google login error:", error);
      setAuthError(error.message);
      setAuthLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setAuthLoading(true);
    try {
      await loginAnonymously();
    } catch (error: any) {
      console.error("Guest login error:", error);
      setAuthError(error.message);
      setAuthLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-5 text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4">Welcome to HashCash</h2>
        <p className="text-muted mb-4">Choose how you want to proceed to the simulator</p>
        
        <div className="d-grid gap-3">
          <button className="btn btn-primary btn-lg" onClick={handleGoogleLogin}>
            <i className="bi bi-google me-2"></i>Sign in with Google
          </button>
          
          <div className="position-relative my-2">
            <hr />
            <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">OR</span>
          </div>

          <button className="btn btn-outline-secondary btn-lg" onClick={handleGuestLogin}>
            <i className="bi bi-person me-2"></i>Continue as Guest
          </button>
        </div>
        
        <p className="mt-4 small text-muted">
          Signing in allows you to persist your wallets across devices.
        </p>
      </div>
    </div>
  );
};

export default Login;
