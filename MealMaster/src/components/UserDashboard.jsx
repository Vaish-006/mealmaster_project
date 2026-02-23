import { useEffect, useState } from 'react';
import { Button, Container, Spinner, Table, Modal, Card, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaReceipt, FaEye, FaUtensils, FaMapMarkerAlt, FaShoppingBag, FaStore } from 'react-icons/fa';
import OrderMapView from './OrderMapView';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest('/orders/me', { token: user.token });
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
      case 'CONFIRMED': return <Badge bg="success" className="px-3 py-2 rounded-pill">Confirmed</Badge>;
      case 'PENDING': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">Pending</Badge>;
      case 'CANCELLED': return <Badge bg="danger" className="px-3 py-2 rounded-pill">Cancelled</Badge>;
      case 'COMPLETED': return <Badge bg="primary" className="px-3 py-2 rounded-pill">Completed</Badge>;
      default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-primary-custom text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="fw-bold mb-2">My Subscriptions</h1>
              <p className="lead opacity-75 mb-0">Manage your meal plans and orders</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button
                variant="light"
                size="lg"
                className="fw-bold text-primary-custom shadow-sm"
                onClick={() => navigate('/subscriptions')}
              >
                <FaUtensils className="me-2" /> Browse New Plans
              </Button>
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
          <>
            {orders.length === 0 ? (
              <Card className="text-center py-5 border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-4 text-muted opacity-25">
                    <FaShoppingBag size={64} />
                  </div>
                  <h3>No Active Subscriptions</h3>
                  <p className="text-muted mb-4">You haven't subscribed to any meal plans yet.</p>
                  <Button variant="primary" size="lg" onClick={() => navigate('/subscriptions')}>
                    Start Exploring
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4">Order ID</th>
                        <th className="py-3">Plan Details</th>
                        <th className="py-3">Duration</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td className="ps-4 fw-bold text-muted">#{o.id}</td>
                          <td>
                            <div className="fw-bold">Subscription #{o.subscriptionId}</div>
                            <div className="small text-muted"><FaStore className="me-1" /> Vendor: {o.vendorId}</div>
                          </td>
                          <td>
                            <div className="d-flex flex-column small">
                              <span><FaCalendarAlt className="me-1 text-muted" /> {new Date(o.startDate).toLocaleDateString()}</span>
                              <span className="text-muted ms-3">to {new Date(o.endDate).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="fw-bold text-dark">₹{o.amount}</td>
                          <td>{getStatusBadge(o.status)}</td>
                          <td className="text-end pe-4">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="rounded-pill px-3"
                              onClick={() => setSelectedOrder(o)}
                            >
                              <FaEye className="me-1" /> Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            )}
          </>
        )}
      </Container>

      {/* Order Details Modal with Map */}
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
                      <h6 className="fw-bold text-muted text-uppercase small mb-3">Order Info</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Status</span>
                        <span>{getStatusBadge(selectedOrder.status)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Amount</span>
                        <span className="fw-bold">₹{selectedOrder.amount}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Duration</span>
                        <span>{selectedOrder.durationDays} Days</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Vendor ID</span>
                        <span className="font-monospace">{selectedOrder.vendorId}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100 bg-light border-0">
                    <Card.Body>
                      <h6 className="fw-bold text-muted text-uppercase small mb-3">Schedule</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Order Date</span>
                        <span>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : '-'}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Start Date</span>
                        <span className="fw-bold text-primary-custom">{new Date(selectedOrder.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">End Date</span>
                        <span className="fw-bold text-primary-custom">{new Date(selectedOrder.endDate).toLocaleDateString()}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h6 className="fw-bold mb-3"><FaMapMarkerAlt className="me-2 text-danger" /> Delivery Location</h6>
              <div className="rounded overflow-hidden shadow-sm border mb-4">
                <OrderMapView order={selectedOrder} />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          {selectedOrder && selectedOrder.status === 'CONFIRMED' && (
            <Button
              variant="outline-success"
              onClick={async () => {
                try {
                  const blob = await apiRequest(`/orders/${selectedOrder.id}/receipt`, {
                    token: user.token,
                    responseType: 'blob'
                  });
                  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                  const url = window.URL.createObjectURL(pdfBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `receipt_${selectedOrder.id}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  toast.success('Receipt downloaded successfully');
                } catch (e) {
                  toast.error('Failed to download receipt: ' + e.message);
                }
              }}
            >
              <FaReceipt className="me-2" /> Download Receipt
            </Button>
          )}
          <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
