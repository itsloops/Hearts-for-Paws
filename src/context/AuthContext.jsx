import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = (email, password, name) => {
    // Mock signup
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { email, name, id: Date.now().toString() };
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        resolve(user);
      }, 500);
    });
  };

  const login = (email, password) => {
    // Mock login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, allow any password or specific 'password'
        // Simulating a successful login for any non-empty email
        if (email) { 
             const user = { email, name: 'Demo User', id: '123' };
             localStorage.setItem('user', JSON.stringify(user));
             setCurrentUser(user);
             resolve(user);
        } else {
            reject('Please enter an email address');
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
