import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../components/Footer.css"
import { MdOutlineFoodBank } from "react-icons/md";
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../auth/useAuth';

function NavigationBar() {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <MdOutlineFoodBank size={40} />
        <LinkContainer to="/">
          <Navbar.Brand>Mealmaster</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/subscriptions">
              <Nav.Link>Subscriptions</Nav.Link>
            </LinkContainer>
            {user?.role === 'Vendor' ? (
              <>
                <LinkContainer to="/vendor/subscriptions">
                  <Nav.Link>My Plans</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/vendor/orders">
                  <Nav.Link>Orders</Nav.Link>
                </LinkContainer>
              </>
            ) : null}
            {user?.role === 'User' ? (
              <LinkContainer to="/user/dashboard">
                <Nav.Link>My Dashboard</Nav.Link>
              </LinkContainer>
            ) : null}
            {user?.role === 'Admin' ? (
              <LinkContainer to="/admin">
                <Nav.Link>Admin</Nav.Link>
              </LinkContainer>
            ) : null}
            <LinkContainer to="/about-us">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact-us">
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
          </Nav>
          {user ? (
            <>
              <div className="me-3">{user.name ? `Hi, ${user.name}` : user.email}</div>
              <Form className="d-flex">
                <Button variant="outline-danger" onClick={logout}>
                  Logout
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Form className="d-flex me-2">
                <LinkContainer to="/login">
                  <Button variant="outline-success">Login</Button>
                </LinkContainer>
              </Form>
              <Form className="d-flex">
                <LinkContainer to="/signup">
                  <Button variant="outline-success">Sign Up</Button>
                </LinkContainer>
              </Form>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
