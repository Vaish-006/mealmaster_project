import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Spinner, Table, Card, Badge, Row, Col, Nav, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { FaUsers, FaClipboardList, FaShoppingBag, FaTrash, FaShieldAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
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
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'subscriptions') loadSubscriptions();
    if (activeTab === 'orders') loadOrders();
  }, [loadOrders, loadSubscriptions, loadUsers, activeTab]);

  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE', token: user.token });
      toast.success('User deleted');
      await loadUsers();
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function deleteSubscription(id) {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await apiRequest(`/admin/subscriptions/${id}`, { method: 'DELETE', token: user.token });
      toast.success('Subscription deleted');
      await loadSubscriptions();
    } catch (e) {
      toast.error(e.message);
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return <Badge bg="danger">Admin</Badge>;
      case 'Vendor': return <Badge bg="info">Vendor</Badge>;
      case 'User': return <Badge bg="success">User</Badge>;
      default: return <Badge bg="secondary">{role}</Badge>;
    }
  };

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
              <h1 className="fw-bold mb-2">Admin Portal</h1>
              <p className="lead opacity-75 mb-0">Manage users, vendors, and platform activity</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="pb-5">
        <Tab.Container id="admin-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row>
            <Col md={3} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-2">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="users" className="mb-1 fw-semibold">
                        <FaUsers className="me-2" /> Users & Vendors
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="subscriptions" className="mb-1 fw-semibold">
                        <FaClipboardList className="me-2" /> All Subscriptions
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="orders" className="fw-semibold">
                        <FaShoppingBag className="me-2" /> Global Orders
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col md={9}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <Tab.Content>
                      <Tab.Pane eventKey="users">
                        <div className="p-4 border-bottom bg-white">
                          <h4 className="mb-0 fw-bold">User Management</h4>
                        </div>
                        <div className="table-responsive">
                          <Table hover className="mb-0 align-middle">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-4">User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Location</th>
                                <th className="text-end pe-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((u) => (
                                <tr key={u.id}>
                                  <td className="ps-4">
                                    <div className="fw-bold">{u.name}</div>
                                    <div className="small text-muted">ID: {u.id}</div>
                                  </td>
                                  <td>
                                    <div>{u.email}</div>
                                    <div className="small text-muted">{u.mobile}</div>
                                  </td>
                                  <td>{getRoleBadge(u.role)}</td>
                                  <td>
                                    {u.city}, {u.state}
                                    <div className="small text-muted">{u.pincode}</div>
                                  </td>
                                  <td className="text-end pe-4">
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm" 
                                      onClick={() => deleteUser(u.id)}
                                      disabled={u.role === 'Admin'}
                                    >
                                      <FaTrash />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {users.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-muted">No users found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="subscriptions">
                        <div className="p-4 border-bottom bg-white">
                          <h4 className="mb-0 fw-bold">Platform Subscriptions</h4>
                        </div>
                        <div className="table-responsive">
                          <Table hover className="mb-0 align-middle">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-4">Plan Details</th>
                                <th>Vendor</th>
                                <th>Pricing (7/15/30)</th>
                                <th className="text-end pe-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subscriptions.map((s) => (
                                <tr key={s.id}>
                                  <td className="ps-4">
                                    <div className="fw-bold">{s.name}</div>
                                    <div className="small text-muted">{s.planType} • {s.city}</div>
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark border">ID: {s.vendorId}</span>
                                  </td>
                                  <td>
                                    <div className="small">
                                      <span className="me-2">₹{s.price7}</span>
                                      <span className="me-2 text-muted">|</span>
                                      <span className="me-2">₹{s.price15}</span>
                                      <span className="me-2 text-muted">|</span>
                                      <span>₹{s.price30}</span>
                                    </div>
                                  </td>
                                  <td className="text-end pe-4">
                                    <Button variant="outline-danger" size="sm" onClick={() => deleteSubscription(s.id)}>
                                      <FaTrash />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {subscriptions.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="text-center py-4 text-muted">No subscriptions found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </Tab.Pane>

                      <Tab.Pane eventKey="orders">
                        <div className="p-4 border-bottom bg-white">
                          <h4 className="mb-0 fw-bold">Order History</h4>
                        </div>
                        <div className="table-responsive">
                          <Table hover className="mb-0 align-middle">
                            <thead className="bg-light">
                              <tr>
                                <th className="ps-4">Order ID</th>
                                <th>Customer & Vendor</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((o) => (
                                <tr key={o.id}>
                                  <td className="ps-4 fw-bold text-muted">#{o.id}</td>
                                  <td>
                                    <div className="small">User: {o.userId}</div>
                                    <div className="small text-muted">Vendor: {o.vendorId}</div>
                                  </td>
                                  <td>
                                    <div className="fw-bold">₹{o.amount}</div>
                                    <div className="small text-muted">{o.durationDays} Days</div>
                                  </td>
                                  <td>{getStatusBadge(o.status)}</td>
                                  <td className="small text-muted">
                                    {o.createdAtUtc ? new Date(o.createdAtUtc).toLocaleDateString() : '-'}
                                  </td>
                                </tr>
                              ))}
                              {orders.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-muted">No orders found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}
