import React, { useEffect, useState } from 'react';
import { images } from '../utils/constants';
import MobileOTPVerification from './MobileOTPVerification';
import authApi from '../services/authApi';

const MobileLogin = ({ isOpen, onClose }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling when popup closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setShowOTP(false);
      setEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mobile-login-overlay')) {
      onClose();
    }
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async () => {
    if (!isValidEmail(email)) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await authApi.sendOTP(email);
      
      if (result.success) {
        setShowOTP(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
  };

  // If showing OTP screen, render OTP component instead
  if (showOTP) {
    return (
      <MobileOTPVerification 
        isOpen={isOpen} 
        onClose={onClose}
        email={email}
        onBack={handleBackToLogin}
      />
    );
  }

  // Otherwise show login screen
  return (
    <div className="mobile-login-overlay" onClick={handleOverlayClick}>
      <div className="mobile-login-container">
        {/* Close button */}
        <button className="mobile-login-close" onClick={onClose}>
          ×
        </button>

        {/* Background with grid pattern */}
        <div className="mobile-login-background">
          {/* Starfield effect */}
          <div className="mobile-login-stars"></div>

          {/* Logo */}
          <div className="mobile-login-logo">
            <img src={images[26].url} alt="Carzilla Logo" />
            <p className="mobile-login-tagline">Dream.Deal.Drive</p>
          </div>

          {/* Main heading */}
          <h1 className="mobile-login-heading">Sign in to your Account</h1>

          {/* Subtitle */}
          <p className="mobile-login-subtitle">Enter your Email to log in</p>

          {/* White card container */}
          <div className="mobile-login-card">
            {/* Error message */}
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Email input */}
            <input 
              type="email" 
              className="mobile-login-input" 
              placeholder="enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              disabled={loading}
            />

            {/* Send OTP button */}
            <button 
              className="mobile-login-button"
              onClick={handleSendOTP}
              disabled={!isValidEmail(email) || loading}
              style={{ 
                opacity: (isValidEmail(email) && !loading) ? 1 : 0.6,
                cursor: (isValidEmail(email) && !loading) ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            {/* Resend OTP link */}
            <p className="mobile-login-resend" style={{ opacity: loading ? 0.5 : 1 }}>
              Resend OTP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
