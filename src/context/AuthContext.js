import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    
    console.log('Token kontrolü yapılıyor...', token ? 'Token var' : 'Token yok');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://api.saloshort.com/api/v1/users/token?token=${token}`, {
        method: 'GET'
      });

      const data = await response.json();
      console.log('Token kontrolü cevabı:', data);
      
      if (response.ok && data.status === true) {
        console.log('Token aktif, oturum açılıyor');
        setIsAuthenticated(true);
      } else {
        console.log('Token geçersiz, oturum kapatılıyor');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token kontrol hatası:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();

    const interval = setInterval(checkToken, 10000);

    return () => clearInterval(interval);
  }, []);

  const login = (token) => {
    console.log('Login fonksiyonu çağrıldı, token:', token);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout fonksiyonu çağrıldı');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  console.log('AuthContext durumu:', { isAuthenticated, isLoading });

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 