import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/links`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLinks(response.data);
    } catch (err) {
      setError('Linkler yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/links`, 
        { originalUrl: newUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setNewUrl('');
      fetchLinks();
    } catch (err) {
      setError('Link kısaltılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="url"
                placeholder="Kısaltmak istediğiniz URL'yi girin"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Kısaltılıyor...' : 'Kısalt'}
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {links.map((link) => (
          <Col key={link.id}>
            <Card 
              className="h-100 cursor-pointer" 
              onClick={() => navigate(`/statistics/${link.id}`)}
            >
              <Card.Body>
                <Card.Title className="text-truncate">{link.shortUrl}</Card.Title>
                <Card.Text className="text-muted text-truncate mb-2">
                  {link.originalUrl}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    Tıklanma: {link.clickCount}
                  </small>
                  <small className="text-muted">
                    Kazanç: {link.earnings}₺
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard; 