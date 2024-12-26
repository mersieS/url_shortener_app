import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Şifre kontrolü
    if (formData.password !== formData.passwordConfirm) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Kayıt başarılı, giriş sayfasına yönlendir
      navigate('/login', { 
        state: { 
          message: 'Kayıt başarılı! Lütfen giriş yapın.' 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Card style={{ width: '400px' }} className="p-4">
        <Card.Title className="text-center mb-4">Kayıt Ol</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ad Soyad</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ad ve soyadınızı girin"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>E-posta</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-posta adresinizi girin"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi girin"
              required
              minLength={6}
            />
            <Form.Text className="text-muted">
              Şifreniz en az 6 karakter uzunluğunda olmalıdır.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Şifre Tekrar</Form.Label>
            <Form.Control
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Şifrenizi tekrar girin"
              required
              minLength={6}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>

          <div className="text-center">
            <small className="text-muted">
              Zaten hesabınız var mı?{' '}
              <Link to="/login">Giriş Yap</Link>
            </small>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 