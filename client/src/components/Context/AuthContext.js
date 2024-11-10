import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData'); 
    if (storedToken && storedUserData) {
      setToken(storedToken); 
      setUser(JSON.parse(storedUserData)); 
      fetchUser(storedToken);
    } else {
      setLoading(false); 
    }
  }, []);
  const fetchUser = async (storedToken) => {
    try {
      const res = await fetch('http://localhost:5000/api/user/users/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`, 
        },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user)); 
      }
    } catch (error) {
      console.error('Error fetching user with token:', error);
    } finally {
      setLoading(false); 
    }
  };
  const login = (userData, token) => {
    setUser(userData); 
    setToken(token); 
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setToken(null); 
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData'); 
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
