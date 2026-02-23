import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { MdOutlineFoodBank } from "react-icons/md";
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../auth/useAuth';
import StreakCounter from './StreakCounter';
import './NavigationBar.css';

function NavigationBar() {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="bg-white shadow-sm sticky-top py-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center fw-bold text-primary-custom" style={{ fontSize: '1.5rem' }}>
            <MdOutlineFoodBank size={32} className="me-2" />
            MealMaster
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 ms-lg-4"
            navbarScroll
          >
            <LinkContainer to="/">
              <Nav.Link className="fw-medium mx-2">Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/subscriptions">
              <Nav.Link className="fw-medium mx-2">Subscriptions</Nav.Link>
            </LinkContainer>
            {user?.role === 'Vendor' && (
              <>
                <LinkContainer to="/vendor/subscriptions">
                  <Nav.Link className="fw-medium mx-2">My Plans</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/vendor/orders">
                  <Nav.Link className="fw-medium mx-2">Orders</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user?.role === 'User' && (
              <>
                <LinkContainer to="/user/dashboard">
                  <Nav.Link className="fw-medium mx-2">My Dashboard</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/smart-planner">
                  <Nav.Link className="fw-medium mx-2 text-primary-custom fw-bold">AI Smart Planner</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user?.role === 'Admin' && (
              <LinkContainer to="/admin">
                <Nav.Link className="fw-medium mx-2">Admin</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/about-us">
              <Nav.Link className="fw-medium mx-2">About Us</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact-us">
              <Nav.Link className="fw-medium mx-2">Contact Us</Nav.Link>
            </LinkContainer>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <StreakCounter />
                <div className="fw-medium text-muted">
                  {user.name ? `Hi, ${user.name}` : user.email}
                </div>
                <Button variant="outline-danger" size="sm" onClick={logout} className="rounded-pill px-3">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button variant="outline-primary-custom" className="rounded-pill px-4">Login</Button>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Button variant="primary-custom" className="rounded-pill px-4">Sign Up</Button>
                </LinkContainer>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
