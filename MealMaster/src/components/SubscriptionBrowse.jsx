import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';

export default function SubscriptionBrowse() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [city, setCity] = useState(user?.city || '');
  const [planType, setPlanType] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (city.trim()) params.set('city', city.trim());
    if (planType) params.set('planType', planType);
    return params.toString() ? `?${params.toString()}` : '';
  }, [city, planType]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest(`/subscriptions${query}`);
        if (!cancelled) setSubscriptions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) toast.error(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <Container className="mt-4 mb-5">
      <Row className="align-items-end g-3">
        <Col md={5}>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Plan Type</Form.Label>
            <Form.Select value={planType} onChange={(e) => setPlanType(e.target.value)}>
              <option value="">All</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Mix">Mix</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="text-md-end">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
        </Col>
      </Row>

      <hr />

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      ) : (
        <Row className="g-4">
          {subscriptions.map((s) => (
            <Col md={4} key={s.id}>
              <Card className="h-100 shadow-sm">
                {s.imageUrl ? (
                  <Card.Img variant="top" src={s.imageUrl} style={{ height: 180, objectFit: 'cover' }} />
                ) : null}
                <Card.Body>
                  <Card.Title>{s.name}</Card.Title>
                  <div className="text-muted">{s.city} • {s.planType}</div>
                  <div className="mt-2">{s.description}</div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button variant="success" className="w-100" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
          {subscriptions.length === 0 ? (
            <Col>
              <div className="text-center text-muted py-5">No subscription plans found.</div>
            </Col>
          ) : null}
        </Row>
      )}
    </Container>
  );
}
