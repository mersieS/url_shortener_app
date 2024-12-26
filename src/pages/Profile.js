import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!profile) return null;

  return (
    <div>
      <h2 className="mb-4">Profil Bilgileri</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                   style={{ width: '64px', height: '64px', fontSize: '24px' }}>
                {profile.name.charAt(0)}
              </div>
              <div className="ms-3">
                <h4 className="mb-1">{profile.name}</h4>
                <p className="text-muted mb-0">{profile.email}</p>
              </div>
            </div>
            <Button 
              variant="outline-primary"
              onClick={() => navigate('/edit-profile')}
            >
              Profili Düzenle
            </Button>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Üyelik Tarihi</h6>
              <p>{new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Telefon</h6>
              <p>{profile.phone || '-'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Toplam Link Sayısı</h6>
              <p>{profile.totalLinks}</p>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="text-muted">Toplam Kazanç</h6>
              <p>{profile.totalEarnings}₺</p>
            </div>
            <div className="col-12">
              <h6 className="text-muted">Adres</h6>
              <p>{profile.address || '-'}</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile; 