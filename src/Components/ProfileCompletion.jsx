import React, { useState } from 'react';
import { images } from '../utils/constants';
import authApi from '../services/authApi';
import { useAuth } from '../context/AuthContext';

const ProfileCompletion = ({ isOpen, onClose, onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.updateProfile(name.trim(), phone.trim());

      if (result.success) {
        // Update auth context with new user data
        login(result.data.user);
        
        // Call onComplete callback
        if (onComplete) {
          onComplete();
        }
        
        // Close modal
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-login-overlay">
      <div className="mobile-login-container">
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
          <h1 className="mobile-login-heading">Complete Your Profile</h1>

          {/* Subtitle */}
          <p className="mobile-login-subtitle">
            Please provide your details to continue
          </p>

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

            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Phone Input */}
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={phone}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Submit button */}
              <button 
                type="submit"
                className="mobile-login-button"
                disabled={loading || !name.trim() || !phone.trim()}
                style={{
                  opacity: (name.trim() && phone.trim() && !loading) ? 1 : 0.6,
                  cursor: (name.trim() && phone.trim() && !loading) ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </form>

            <p style={{
              marginTop: '15px',
              fontSize: '12px',
              color: '#888',
              textAlign: 'center'
            }}>
              Your information is secure and will not be shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
