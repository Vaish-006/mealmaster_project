import { useEffect, useState } from 'react';
import { Container, Spinner, Table, Modal, Button, Card, Badge, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { FaBoxOpen, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaInfoCircle, FaClipboardList } from 'react-icons/fa';
import OrderMapView from './OrderMapView';

export default function VendorOrders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest('/orders/vendor', { token: user.token });
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
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
  }, [user.token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return <Badge bg="success">Confirmed</Badge>;
      case 'PENDING': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'CANCELLED': return <Badge bg="danger">Cancelled</Badge>;
      case 'COMPLETED': return <Badge bg="primary">Completed</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-primary-custom text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="fw-bold mb-2">Order Management</h1>
              <p className="lead opacity-75 mb-0">Track and fulfill customer subscriptions</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 ps-4">Order ID</th>
                    <th className="py-3">Customer & Plan</th>
                    <th className="py-3">Schedule</th>
                    <th className="py-3">Location</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="ps-4 fw-bold text-muted">#{o.id}</td>
                      <td>
                        <div className="fw-bold"><FaUser className="me-1 text-muted small" /> User #{o.userId}</div>
                        <div className="small text-muted">Plan: {o.subscriptionId} • {o.durationDays} Days</div>
                      </td>
                      <td>
                        <div className="d-flex flex-column small">
                          <span className="mb-1"><FaCalendarAlt className="me-1 text-primary-custom" /> Start: {o.startDate ? new Date(o.startDate).toLocaleDateString() : '-'}</span>
                          <span>End: {o.endDate ? new Date(o.endDate).toLocaleDateString() : '-'}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: '250px' }}>
                        {o.address ? (
                          <div className="small text-truncate">
                            <FaMapMarkerAlt className="me-1 text-danger" />
                            {o.address.addressLine}, {o.address.city}
                          </div>
                        ) : (
                          <span className="text-muted small">No address</span>
                        )}
                      </td>
                      <td>{getStatusBadge(o.status)}</td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => setSelectedOrder(o)}
                        >
                          Details & Map
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="text-muted mb-2"><FaBoxOpen size={40} className="opacity-25" /></div>
                        <p className="mb-0">No orders received yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        )}
      </Container>

      {/* Order Details Modal with Map for Vendor */}
      <Modal show={!!selectedOrder} onHide={() => setSelectedOrder(null)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Order Details #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedOrder && (
            <>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="h-100 bg-light border-0">
                    <Card.Body>
                      <h6 className="fw-bold text-muted text-uppercase small mb-3">Customer Info</h6>
                      <div className="mb-2">
                        <span className="text-muted d-block small">User ID</span>
                        <span className="fw-bold">{selectedOrder.userId}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted d-block small">Subscription ID</span>
                        <span className="fw-bold">{selectedOrder.subscriptionId}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted d-block small">Amount</span>
                        <span className="fw-bold text-success">₹{selectedOrder.amount}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 bg-light border-0">
                    <Card.Body>
                      <h6 className="fw-bold text-muted text-uppercase small mb-3">Delivery Schedule</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Duration</span>
                        <span className="badge bg-info text-dark">{selectedOrder.durationDays} Days</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Start Date</span>
                        <span className="fw-bold">{selectedOrder.startDate ? new Date(selectedOrder.startDate).toLocaleDateString() : '-'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">End Date</span>
                        <span className="fw-bold">{selectedOrder.endDate ? new Date(selectedOrder.endDate).toLocaleDateString() : '-'}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h6 className="fw-bold mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-danger" /> Delivery Location
              </h6>
              
              {selectedOrder.address && (
                <div className="bg-light p-3 rounded mb-3 border">
                  <div className="fw-bold">{selectedOrder.address.addressLine}</div>
                  <div className="text-muted small">
                    {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                  </div>
                </div>
              )}

              <div className="rounded overflow-hidden shadow-sm border mb-4">
                <OrderMapView order={selectedOrder} />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
