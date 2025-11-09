import React, { useEffect } from 'react';
import { images } from '../utils/constants';

const MobileLogin = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mobile-login-overlay')) {
      onClose();
    }
  };

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
          <p className="mobile-login-subtitle">Enter your Phone Number to log in</p>

          {/* White card container */}
          <div className="mobile-login-card">
            {/* Phone number input */}
            <input 
              type="tel" 
              className="mobile-login-input" 
              placeholder="enter your phone number"
              maxLength="10"
            />

            {/* Send OTP button */}
            <button className="mobile-login-button">Send OTP</button>

            {/* Resend OTP link */}
            <p className="mobile-login-resend">Resend OTP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
