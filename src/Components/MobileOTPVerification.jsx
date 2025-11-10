import React, { useEffect, useState, useRef } from 'react';
import { images } from '../utils/constants';
import authApi from '../services/authApi';
import { useAuth } from '../context/AuthContext';
import ProfileCompletion from './ProfileCompletion';

const MobileOTPVerification = ({ isOpen, onClose, email, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '']); // Changed to 4 digits
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();

  useEffect(() => {
    // Focus first input when component mounts
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('mobile-login-overlay')) {
      onClose();
    }
  };

  // Format email for display (hide middle part)
  const formatEmail = (email) => {
    if (!email) return 'example@email.com';
    
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    
    // Show first 2 characters of username, mask the rest
    const maskedUsername = username.length > 2 
      ? `${username.slice(0, 2)}****`
      : `${username}****`;
    
    return `${maskedUsername}@${domain}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input (changed to 3 for 4-digit OTP)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authApi.verifyOTP(email, otpCode);
      console.log('🔍 [OTP-VERIFY] Full result:', result);

      if (result.success) {
        console.log('✅ [OTP-VERIFY] Login successful');
        console.log('👤 [OTP-VERIFY] User data:', result.data.user);
        console.log('📋 [OTP-VERIFY] isProfileComplete:', result.data.isProfileComplete);
        
        // Update auth context with user data
        login(result.data.user, {
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });
        
        setSuccess(true);
        
        // Check if profile is complete
        if (!result.data.isProfileComplete) {
          console.log('🚨 [OTP-VERIFY] Profile incomplete - showing ProfileCompletion modal');
          // Show profile completion modal
          setTimeout(() => {
            console.log('🎯 [OTP-VERIFY] Setting showProfileCompletion to true');
            setShowProfileCompletion(true);
          }, 1500);
        } else {
          console.log('✅ [OTP-VERIFY] Profile complete - closing modal');
          // Profile is complete, just close
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        setError(result.error);
        // Clear OTP on error
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('❌ [OTP-VERIFY] Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setOtp(['', '', '', '']);

    try {
      const result = await authApi.sendOTP(email);
      
      if (result.success) {
        // Show success message briefly
        setError('');
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If showing profile completion, render only that modal
  if (showProfileCompletion) {
    return (
      <ProfileCompletion
        isOpen={showProfileCompletion}
        onClose={() => {
          setShowProfileCompletion(false);
          onClose();
        }}
        onComplete={() => {
          setShowProfileCompletion(false);
          onClose();
        }}
      />
    );
  }

  // Otherwise render OTP verification modal
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

          {/* Back button */}
          <button className="mobile-otp-back" onClick={onBack} disabled={loading}>
            ← Back
          </button>

          {/* Main heading */}
          <h1 className="mobile-login-heading">OTP Verification</h1>

          {/* Subtitle */}
          <p className="mobile-login-subtitle">
            We have sent a verification code to<br />
            {formatEmail(email)}
          </p>

          {/* White card container */}
          <div className="mobile-login-card">
            {/* Success message */}
            {success && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                ✓ Login successful! Redirecting...
              </div>
            )}

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

            {/* OTP input boxes */}
            <div className="mobile-otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  className="mobile-otp-box"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading || success}
                  placeholder=""
                />
              ))}
            </div>

            {/* Verify OTP button */}
            <button 
              className="mobile-login-button"
              onClick={handleVerifyOTP}
              disabled={loading || success || otp.join('').length !== 4}
              style={{
                opacity: (otp.join('').length === 4 && !loading && !success) ? 1 : 0.6,
                cursor: (otp.join('').length === 4 && !loading && !success) ? 'pointer' : 'not-allowed'
              }}
            >
              {loading ? 'Verifying...' : success ? 'Verified ✓' : 'Verify OTP'}
            </button>

            {/* Resend OTP link */}
            <p 
              className="mobile-login-resend" 
              onClick={!loading && !success ? handleResendOTP : undefined}
              style={{ 
                opacity: (loading || success) ? 0.5 : 1,
                cursor: (loading || success) ? 'default' : 'pointer'
              }}
            >
              Resend OTP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOTPVerification;
