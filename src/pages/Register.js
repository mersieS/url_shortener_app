import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      const formBody = new URLSearchParams({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      const response = await fetch(`http://api.saloshort.com/api/v1/users/sign_up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { 
          state: { message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' }
        });
      } else {
        throw new Error(data.error || 'Kayıt olurken bir hata oluştu');
      }
    } catch (err) {
      setError(err.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="site-logo">SaloShort</h1>
          <p>Yeni hesap oluşturun</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adınızı ve soyadınızı girin"
              required
            />
          </div>

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

          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
          
          <div className="auth-links">
            <span>
              Zaten hesabınız var mı?{' '}
              <Link to="/login">Giriş Yap</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
