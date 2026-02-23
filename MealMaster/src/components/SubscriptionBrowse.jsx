import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaUtensils, FaSearch, FaFilter } from 'react-icons/fa';

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
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">Explore Plans</h2>
            <p className="text-muted mb-0">Find the perfect meal subscription for you</p>
          </div>
          <Button variant="outline-secondary" className="d-none d-md-block" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <Row className="g-3 align-items-end">
              <Col md={5}>
                <Form.Label className="fw-medium text-muted"><FaMapMarkerAlt className="me-1"/> Location</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Search by city..." 
                    className="border-start-0 ps-0"
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Label className="fw-medium text-muted"><FaFilter className="me-1"/> Dietary Preference</Form.Label>
                <Form.Select value={planType} onChange={(e) => setPlanType(e.target.value)}>
                  <option value="">All Plans</option>
                  <option value="Veg">Vegetarian Only</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Mix">Mix (Veg & Non-Veg)</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                 <div className="d-grid">
                    <Button variant="primary-custom" className="d-flex align-items-center justify-content-center gap-2">
                      Find Plans
                    </Button>
                 </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            {subscriptions.map((s) => (
              <Col md={6} lg={4} key={s.id}>
                <Card className="h-100 border-0 shadow-sm card-hover overflow-hidden">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={s.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      style={{ height: 200, objectFit: 'cover' }} 
                    />
                    <Badge 
                      bg={s.planType === 'Veg' ? 'success' : s.planType === 'Non-Veg' ? 'danger' : 'warning'} 
                      className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                    >
                      {s.planType}
                    </Badge>
                  </div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="fw-bold h5 mb-0 text-truncate" title={s.name}>{s.name}</Card.Title>
                    </div>
                    
                    <div className="d-flex align-items-center text-muted small mb-3">
                      <FaMapMarkerAlt className="me-1 text-primary-custom" /> {s.city}
                      <span className="mx-2">•</span>
                      <FaUtensils className="me-1 text-primary-custom" /> {s.planType} Plan
                    </div>
                    
                    <Card.Text className="text-muted small line-clamp-2" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.5em'
                    }}>
                      {s.description || "Delicious and healthy meal plan delivered to your doorstep."}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0 p-4 pt-0">
                    <Button variant="outline-primary-custom" className="w-100 rounded-pill fw-medium" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                      View Details
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
            {subscriptions.length === 0 && (
              <Col xs={12}>
                <div className="text-center py-5">
                  <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm mb-3" style={{width: '80px', height: '80px'}}>
                    <FaSearch size={32} className="text-muted opacity-50"/>
                  </div>
                  <h4 className="fw-bold text-muted">No plans found</h4>
                  <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
                  <Button variant="link" onClick={() => {setCity(''); setPlanType('');}} className="text-decoration-none">Clear Filters</Button>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}
