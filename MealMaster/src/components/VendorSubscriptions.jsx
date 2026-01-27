import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function VendorSubscriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

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

  async function handleDelete(id) {
    try {
      await apiRequest(`/subscriptions/${id}`, { method: 'DELETE', token: user.token });
      toast.success('Subscription deleted');
      await load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3>My Subscription Plans</h3>
        <Button variant="success" onClick={() => navigate('/vendor/subscriptions/new')}>
          Add New
        </Button>
      </div>

      <hr />

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Type</th>
              <th>7-Day</th>
              <th>15-Day</th>
              <th>30-Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.city}</td>
                <td>{s.planType}</td>
                <td>₹{s.price7}</td>
                <td>₹{s.price15}</td>
                <td>₹{s.price30}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                    View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/vendor/subscriptions/${s.id}/edit`)}
                  >
                    Modify
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  No subscription plans yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
