import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      const formBody = new URLSearchParams({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirm,
      });

      console.log('İstek gönderiliyor:', {
        url: `${process.env.REACT_APP_API_URL}/api/v1/users/sign_up`,
        body: Object.fromEntries(formBody)
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/sign_up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Body:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/login', {
          state: {
            message: data.message || 'Kayıt başarılı',
          },
        });
      } else {
        let errorMessage = data.error || data.message || 'Kayıt işlemi başarısız';
        throw new Error(errorMessage);
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
          <h1>URL Kısaltıcı</h1>
          <p>Yeni hesap oluşturun</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Ad Soyad</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ad ve soyadınızı girin"
              required
            />
          </div>

          <div className="form-group">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta adresinizi girin"
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi girin"
              required
              minLength={6}
            />
            <small>Şifreniz en az 6 karakter uzunluğunda olmalıdır.</small>
          </div>

          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
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
