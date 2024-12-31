import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const fetchLinks = async () => {
    try {
      const response = await fetch(`https://api.saloshort.com/api/v1/urls`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });

      const data = await response.json();
      console.log('Links response:', data);

      if (response.ok) {
        setLinks(data.url || []);
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
        name: urlName,
        original_url: newUrl
      });

      const response = await fetch(`https://api.saloshort.com/api/v1/urls`, {
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
        setUrlName('');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCopyClick = async (e, shortUrl, id) => {
    e.stopPropagation();
    try {
      const fullUrl = `api.saloshort.com/${shortUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="site-logo">SaloShort</h2>
      </div>
      
      <div className="url-shortener-card">
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="text"
            className="url-input"
            placeholder="Link adı"
            value={urlName}
            onChange={(e) => setUrlName(e.target.value)}
            required
          />
          <input
            type="url"
            className="url-input"
            placeholder="Kısaltmak istediğiniz linki girin"
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
        {links.map((link) => (
          <div 
            key={link.id}
            className="link-card"
            onClick={() => navigate(`/statistics/${link.id}`)}
          >
            <div className="link-header">
              <div className="link-name">{link.name || 'İsimsiz Link'}</div>
              <div className="link-date">{formatDate(link.created_at)}</div>
            </div>
            <div 
              className="link-short-url"
              onClick={(e) => handleCopyClick(e, link.short_url, link.id)}
            >
              <span>api.saloshort.com/{link.short_url}</span>
              <button className="copy-button">
                {copiedId === link.id ? (
                  <span className="copied-text">Kopyalandı!</span>
                ) : (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
            <div className="link-original-url">{link.original_url}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 