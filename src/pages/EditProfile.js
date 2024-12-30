import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(response.data);
    } catch (err) {
      setError('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formBody = new URLSearchParams({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address || ''
      });

      const response = await fetch(`http://api.saloshort.com/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formBody
      });

      if (!response.ok) {
        throw new Error('Profil güncellenirken bir hata oluştu');
      }

      setSuccess('Profil başarıyla güncellendi');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h2 className="mb-4">Profili Düzenle</h2>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
          {success && <Alert variant="success" className="mb-4">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleChange}
                placeholder="İsteğe bağlı"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Adres</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                rows={3}
                placeholder="İsteğe bağlı"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={saving}
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => navigate('/profile')}
                disabled={saving}
              >
                İptal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditProfile; 