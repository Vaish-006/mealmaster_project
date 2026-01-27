import { useEffect, useState } from 'react';
import { Container, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function VendorOrders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

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

  return (
    <Container className="mt-4 mb-5">
      <h3>Subscription Orders</h3>
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
              <th>User ID</th>
              <th>Subscription ID</th>
              <th>Days</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Address</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId}</td>
                <td>{o.subscriptionId}</td>
                <td>{o.durationDays}</td>
                <td>₹{o.amount}</td>
                <td>{o.startDate ? new Date(o.startDate).toLocaleDateString() : '-'}</td>
                <td>{o.endDate ? new Date(o.endDate).toLocaleDateString() : '-'}</td>
                <td>
                  {o.address ? (
                    <div className="small">
                      <div>{o.address.addressLine}</div>
                      <div>{o.address.city}, {o.address.state} - {o.address.pincode}</div>
                    </div>
                  ) : (
                    <span className="text-muted">No address</span>
                  )}
                </td>
                <td>{o.status}</td>
                <td>{o.createdAtUtc ? new Date(o.createdAtUtc).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
