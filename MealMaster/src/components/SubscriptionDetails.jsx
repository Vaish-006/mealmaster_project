import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner, Table, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [durationDays, setDurationDays] = useState(7);
  const [purchasing, setPurchasing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [addressData, setAddressData] = useState({
    addressLine: user?.addressLine || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest(`/subscriptions/${id}`);
        if (!cancelled) setSubscription(data);
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
  }, [id]);

  const price = useMemo(() => {
    if (!subscription) return 0;
    if (durationDays === 7) return subscription.price7;
    if (durationDays === 15) return subscription.price15;
    return subscription.price30;
  }, [subscription, durationDays]);

  function handlePurchase() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'User') {
      toast.error('Only customers can purchase subscriptions');
      return;
    }
    setShowSummary(true);
  }

  async function confirmPurchase() {
    setPurchasing(true);
    try {
      const order = await apiRequest('/orders', {
        method: 'POST',
        token: user.token,
        body: { subscriptionId: subscription.id, durationDays, startDate, ...addressData }
      });
      await apiRequest(`/orders/${order.id}/pay`, { method: 'POST', token: user.token });
      toast.success('Payment successful');
      setShowSummary(false);
      navigate('/user/dashboard');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPurchasing(false);
    }
  }

  const calculateEndDate = (start, duration) => {
    const d = new Date(start);
    d.setDate(d.getDate() + duration);
    return d.toLocaleDateString();
  };

  const formattedEndDate = calculateEndDate(startDate, durationDays);

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Spinner />
      </Container>
    );
  }

  if (!subscription) {
    return (
      <Container className="py-5 text-center text-muted">
        Subscription not found.
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: 900 }}>
      <h3 className="text-center mb-4">Subscription Details</h3>

      <Card className="p-3 shadow-sm">
        <Row>
          <Col md={4} className="text-center">
            {subscription.imageUrl ? (
              <img src={subscription.imageUrl} alt={subscription.name} className="img-fluid rounded" />
            ) : null}
          </Col>
          <Col md={8}>
            <h4>{subscription.name}</h4>
            <div className="text-muted">{subscription.city} • {subscription.planType}</div>
            <div className="mt-2">
              <strong>Vendor ID:</strong> {subscription.vendorId}
            </div>
            <div className="mt-2">
              <strong>Description:</strong>
              <div>{subscription.description}</div>
            </div>
          </Col>
        </Row>

        <hr />

        <h5>Pricing</h5>
        <Table bordered>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>7-Day Plan</td>
              <td>₹{subscription.price7}</td>
            </tr>
            <tr>
              <td>15-Day Plan</td>
              <td>₹{subscription.price15}</td>
            </tr>
            <tr>
              <td>30-Day Plan</td>
              <td>₹{subscription.price30}</td>
            </tr>
          </tbody>
        </Table>

        <h5 className="mt-3">Meal Plan (7 Days)</h5>
        <Table bordered>
          <tbody>
            <tr><td><strong>Day 1</strong></td><td>{subscription.day1}</td></tr>
            <tr><td><strong>Day 2</strong></td><td>{subscription.day2}</td></tr>
            <tr><td><strong>Day 3</strong></td><td>{subscription.day3}</td></tr>
            <tr><td><strong>Day 4</strong></td><td>{subscription.day4}</td></tr>
            <tr><td><strong>Day 5</strong></td><td>{subscription.day5}</td></tr>
            <tr><td><strong>Day 6</strong></td><td>{subscription.day6}</td></tr>
            <tr><td><strong>Day 7</strong></td><td>{subscription.day7}</td></tr>
          </tbody>
        </Table>

        {user?.role === 'User' && (
          <Row className="align-items-end g-3">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Select Duration</Form.Label>
                <Form.Select value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))}>
                  <option value={7}>7 Days</option>
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <div className="fw-bold">Payable: ₹{price}</div>
            </Col>
            <Col md={3} className="text-md-end">
              <Button variant="success" disabled={purchasing} onClick={handlePurchase}>
                {purchasing ? 'Processing...' : 'Purchase'}
              </Button>
            </Col>
          </Row>
        )}

        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>

      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Plan:</strong> {subscription.name}
          </div>
          <div className="mb-3">
            <strong>Duration:</strong> {durationDays} Days
          </div>
          <Form.Group className="mb-3">
            <Form.Label><strong>Start Date:</strong></Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <strong>End Date:</strong> {formattedEndDate}
          </div>

          <h6 className="mt-4 mb-2">Delivery Address</h6>
          <Form.Group className="mb-2">
            <Form.Label className="small mb-1">Address Line</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="addressLine"
              placeholder="Building, Street, Area"
              value={addressData.addressLine}
              onChange={handleAddressChange}
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small mb-1">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="small mb-1">State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={addressData.state}
                  onChange={handleAddressChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label className="small mb-1">Pincode</Form.Label>
            <Form.Control
              type="text"
              name="pincode"
              placeholder="6-digit Pincode"
              value={addressData.pincode}
              onChange={handleAddressChange}
              required
            />
          </Form.Group>

          <div className="mt-4 text-center">
            <h3>Total: ₹{price}</h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSummary(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmPurchase} disabled={purchasing}>
            {purchasing ? 'Processing...' : 'Confirm & Purchase'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
