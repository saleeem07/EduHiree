const API_URL = '/api/auth';

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      return { success: true, data };
    } else {
      return { success: false, error: data.msg };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Server error' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      return { success: true, user: data }; // data contains token
    } else {
      return { success: false, error: data.msg }; // Login.jsx expects user object or fails
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Server error' };
  }
};

export const googleAuth = async (email, profile) => {
  try {
    const res = await fetch(`${API_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, profile })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      return { success: true, data };
    }
    return { success: false, error: data.msg };
  } catch (error) {
    return { success: false, error: 'Social login error' };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: { 'x-auth-token': token }
    });

    if (res.ok) {
      const user = await res.json();
      return user;
    } else {
      localStorage.removeItem('token');
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Deprecated/Mock-shim functions for compatibility if needed (optional)
export const saveUserCredentials = () => console.warn('Deprecated: saveUserCredentials');
export const saveUserData = () => console.warn('Deprecated: saveUserData');
export const validateUserCredentials = () => console.warn('Deprecated: validateUserCredentials');
export const setCurrentUser = () => console.warn('Deprecated: setCurrentUser');
export const updateUserProfile = async (email, profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Use /me/profile or just /profile if we change the backend route. 
    // Plan said /api/auth/profile, so adjusting frontend to match.
    // However, existing calls are to ${API_URL}/me, so let's try to match that pattern if possible,
    // or create a new endpoint. The plan said PUT /api/auth/profile.

    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(profileData)
    });

    if (res.ok) {
      return true;
    }
    let errorMsg = 'Unknown error';
    try {
      const errorData = await res.json();
      errorMsg = errorData.msg || errorData.error || JSON.stringify(errorData);
    } catch (e) {
      errorMsg = await res.text();
    }
    console.error('Update profile failed:', res.status, errorMsg);
    return false;
  } catch (error) {
    console.error('Update profile error:', error);
    return false;
  }
};

export const clearCurrentUser = logoutUser;
