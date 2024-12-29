import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/urls`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });

      const data = await response.json();
      console.log('Links response:', data);

      if (response.ok) {
        const linksArray = Array.isArray(data) ? data : data.urls || [];
        setLinks(linksArray);
      } else {
        throw new Error(data.error || 'Linkler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Fetch links error:', err);
      setError(err.message || 'Linkler yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formBody = new URLSearchParams({
        original_url: newUrl
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formBody
      });

      const data = await response.json();
      console.log('Create URL response:', data);

      if (response.ok) {
        setNewUrl('');
        fetchLinks();
      } else {
        throw new Error(data.error || 'Link kısaltılırken bir hata oluştu');
      }
    } catch (err) {
      console.error('Create URL error:', err);
      setError(err.message || 'Link kısaltılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>
      
      <div className="url-shortener-card">
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="url"
            className="url-input"
            placeholder="Kısaltmak istediğiniz URL'yi girin"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className={`shorten-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Kısaltılıyor...' : 'Kısalt'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="links-grid">
        {Array.isArray(links) && links.map((link) => (
          <div 
            key={link.id}
            className="link-card"
            onClick={() => navigate(`/statistics/${link.id}`)}
          >
            <div className="link-title">{link.short_url}</div>
            <div className="link-url">{link.original_url}</div>
            <div className="link-stats">
              <div className="stat-item">
                Tıklanma: {link.click_count || 0}
              </div>
              <div className="stat-item">
                Kazanç: {link.earnings || 0}₺
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 