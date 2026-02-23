import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Spinner, Row, Col, Card, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaLeaf, FaDrumstickBite, FaUtensils, FaRupeeSign } from 'react-icons/fa';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function VendorSubscriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const load = useCallback(async () => {
    if (!user?.token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/subscriptions/mine', { token: user.token });
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.token, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = (id) => {
    setSelectedPlanId(id);
    setShowDeleteModal(true);
  };

  async function handleDelete() {
    try {
      await apiRequest(`/subscriptions/${selectedPlanId}`, { method: 'DELETE', token: user.token });
      toast.success('Subscription deleted');
      setShowDeleteModal(false);
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  const getPlanIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'veg': return <FaLeaf className="text-success" />;
      case 'non-veg': return <FaDrumstickBite className="text-danger" />;
      default: return <FaUtensils className="text-warning" />;
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-primary-custom text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="fw-bold mb-2">My Meal Plans</h1>
              <p className="lead opacity-75 mb-0">Manage your subscription offerings</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button 
                variant="light" 
                onClick={() => navigate('/vendor/subscriptions/new')}
                className="rounded-pill px-4 shadow-sm fw-bold text-primary-custom"
              >
                <FaPlus className="me-2" /> Create New Plan
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary-custom" />
          </div>
        ) : (
          <>
            {subscriptions.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                <div className="mb-3 text-muted opacity-50">
                  <FaUtensils size={48} />
                </div>
                <h4 className="fw-bold text-muted">No Plans Found</h4>
                <p className="text-muted mb-4">You haven't created any subscription plans yet.</p>
                <Button 
                  variant="primary-custom" 
                  onClick={() => navigate('/vendor/subscriptions/new')}
                  className="rounded-pill px-4"
                >
                  Create First Plan
                </Button>
              </div>
          ) : (
            <Row className="g-4">
              {subscriptions.map((s) => (
                <Col key={s.id} md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover">
                    <div className="position-relative" style={{ height: '200px' }}>
                      <Card.Img 
                        variant="top" 
                        src={s.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"} 
                        className="h-100 w-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="position-absolute top-0 end-0 p-3">
                         <Badge bg="white" text="dark" className="shadow-sm rounded-pill px-3 py-2 fw-normal">
                           {getPlanIcon(s.planType)} <span className="ms-1">{s.planType}</span>
                         </Badge>
                      </div>
                    </div>
                    
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-2 text-truncate" title={s.name}>{s.name}</h5>
                      <p className="text-muted small mb-3"><FaRupeeSign size={12}/> {s.price30} / month</p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="rounded-circle p-2 text-primary-custom" 
                          onClick={() => navigate(`/subscriptions/${s.id}`)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="rounded-circle p-2 text-warning"
                            onClick={() => navigate(`/vendor/subscriptions/${s.id}/edit`)}
                            title="Edit Plan"
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="light" 
                            size="sm" 
                            className="rounded-circle p-2 text-danger"
                            onClick={() => confirmDelete(s.id)}
                            title="Delete Plan"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Delete Plan?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this subscription plan? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-pill">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="rounded-pill">Delete Plan</Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
}
