import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formBody = new URLSearchParams({
        email,
        password
      });

      console.log('İstek gönderiliyor:', {
        url: `https://api.saloshort.com/api/v1/users/sign_in`,
        body: Object.fromEntries(formBody)
      });

      const response = await fetch(`https://api.saloshort.com/api/v1/users/sign_in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Body:', data);

      if (response.ok) {
        login(data.token);
      } else {
        let errorMessage = data.error;
        if (errorMessage === 'Invalid email or password') {
          errorMessage = 'E-posta veya şifre hatalı';
        }
        throw new Error(errorMessage || 'Giriş yapılırken bir hata oluştu');
      }
    } catch (err) {
      setError(err.message || 'Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="site-logo">SaloShort</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
          
          <div className="auth-links">
            <span>
              Hesabınız yok mu?{' '}
              <Link to="/register">Kayıt Ol</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 