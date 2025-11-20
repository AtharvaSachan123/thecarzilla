import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authApi = {
  /**
   * Send OTP to email
   */
  sendOTP: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        email,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP. Please try again.',
      };
    }
  },

  /**
   * Verify OTP and sign in
   */
  verifyOTP: async (email, otp) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      
      // Store user data and tokens in localStorage
      if (response.data.success && response.data.user) {
        localStorage.setItem('carzilla_user', JSON.stringify(response.data.user));
        if (response.data.accessToken) {
          localStorage.setItem('carzilla_access_token', response.data.accessToken);
        }
        if (response.data.refreshToken) {
          localStorage.setItem('carzilla_refresh_token', response.data.refreshToken);
        }
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to verify OTP. Please try again.',
      };
    }
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('carzilla_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: () => {
    return localStorage.getItem('carzilla_access_token');
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: () => {
    return localStorage.getItem('carzilla_refresh_token');
  },

  /**
   * Verify token with backend and get current user
   */
  verifyToken: async () => {
    try {
      const token = authApi.getAccessToken();
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.user) {
        // Update user data in localStorage
        localStorage.setItem('carzilla_user', JSON.stringify(response.data.user));
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Invalid response' };
    } catch (error) {
      // Token is invalid or expired, clear auth data
      authApi.signOut();
      return {
        success: false,
        error: error.response?.data?.error || 'Token verification failed',
      };
    }
  },

  /**
   * Sign out user
   */
  signOut: () => {
    localStorage.removeItem('carzilla_user');
    localStorage.removeItem('carzilla_access_token');
    localStorage.removeItem('carzilla_refresh_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!authApi.getAccessToken();
  },

  /**
   * Update user profile
   */
  updateProfile: async (name, phone) => {
    try {
      const token = authApi.getAccessToken();
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/me`,
        { name, phone },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Update user data in localStorage
      if (response.data.success && response.data.user) {
        localStorage.setItem('carzilla_user', JSON.stringify(response.data.user));
      }

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile',
      };
    }
  },
};

export default authApi;
