import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import axios from 'axios';

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [plansResponse, currentPlanResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/subscriptions/plans`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/subscriptions/current`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setPlans(plansResponse.data);
      setCurrentPlan(currentPlanResponse.data);
    } catch (err) {
      setError('Abonelik bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/subscriptions/subscribe`, 
        { planId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      
      window.location.href = response.data.paymentUrl;
    } catch (err) {
      setError('Abonelik işlemi başlatılırken bir hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Abonelik Planları</h2>
      
      {currentPlan && (
        <Card className="mb-4 bg-light">
          <Card.Body>
            <h5 className="mb-3">Mevcut Aboneliğiniz</h5>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-2">{currentPlan.name}</h4>
                <p className="text-muted mb-0">
                  Bitiş Tarihi: {new Date(currentPlan.expiryDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <Badge bg="success" className="px-3 py-2">Aktif</Badge>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Row xs={1} md={2} lg={3} className="g-4">
        {plans.map((plan) => (
          <Col key={plan.id}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-4">{plan.name}</Card.Title>
                <div className="mb-4">
                  <h3 className="mb-0">{plan.price}₺<small className="text-muted">/ay</small></h3>
                </div>
                
                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Button
                    variant={currentPlan?.id === plan.id ? "outline-primary" : "primary"}
                    className="w-100"
                    disabled={currentPlan?.id === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {currentPlan?.id === plan.id ? 'Mevcut Plan' : 'Abone Ol'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Subscription; 