import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Spinner, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/users', { token: user.token });
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/subscriptions', { token: user.token });
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/orders', { token: user.token });
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (tab === 'users') loadUsers();
    if (tab === 'subscriptions') loadSubscriptions();
    if (tab === 'orders') loadOrders();
  }, [loadOrders, loadSubscriptions, loadUsers, tab]);

  async function deleteUser(id) {
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE', token: user.token });
      toast.success('User deleted');
      await loadUsers();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function deleteSubscription(id) {
    try {
      await apiRequest(`/admin/subscriptions/${id}`, { method: 'DELETE', token: user.token });
      toast.success('Subscription deleted');
      await loadSubscriptions();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Admin Dashboard</h3>
        <div className="d-flex gap-2">
          <Button variant={tab === 'users' ? 'primary' : 'outline-primary'} onClick={() => setTab('users')}>
            Users
          </Button>
          <Button
            variant={tab === 'subscriptions' ? 'primary' : 'outline-primary'}
            onClick={() => setTab('subscriptions')}
          >
            Subscriptions
          </Button>
          <Button variant={tab === 'orders' ? 'primary' : 'outline-primary'} onClick={() => setTab('orders')}>
            Orders
          </Button>
        </div>
      </div>

      <hr />

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner />
        </div>
      ) : null}

      {tab === 'users' ? (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile}</td>
                <td>{u.role}</td>
                <td>{u.city}</td>
                <td>{u.state}</td>
                <td>{u.pincode}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteUser(u.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No users.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      ) : null}

      {tab === 'subscriptions' ? (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Vendor ID</th>
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
                <td>{s.vendorId}</td>
                <td>{s.city}</td>
                <td>{s.planType}</td>
                <td>₹{s.price7}</td>
                <td>₹{s.price15}</td>
                <td>₹{s.price30}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteSubscription(s.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No subscriptions.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      ) : null}

      {tab === 'orders' ? (
        <Table bordered hover responsive>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Subscription ID</th>
              <th>Vendor ID</th>
              <th>Days</th>
              <th>Amount</th>
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
                <td>{o.vendorId}</td>
                <td>{o.durationDays}</td>
                <td>₹{o.amount}</td>
                <td>{o.deliveryAddress}</td>
                <td>{o.status}</td>
                <td>{o.createdAtUtc ? new Date(o.createdAtUtc).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  No orders.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      ) : null}
    </Container>
  );
}
