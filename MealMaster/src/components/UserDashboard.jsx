import { useEffect, useState } from 'react';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

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

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3>My Subscriptions</h3>
        <Button variant="success" onClick={() => navigate('/subscriptions')}>
          Browse Plans
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
              <th>Order ID</th>
              <th>Subscription ID</th>
              <th>Vendor ID</th>
              <th>Days</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.subscriptionId}</td>
                <td>{o.vendorId}</td>
                <td>{o.durationDays}</td>
                <td>₹{o.amount}</td>
                <td>{new Date(o.startDate).toLocaleDateString()}</td>
                <td>{new Date(o.endDate).toLocaleDateString()}</td>
                <td>{o.status}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  No subscriptions purchased yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
