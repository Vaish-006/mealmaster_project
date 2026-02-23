import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="text-center">
        <div className="text-primary-custom opacity-25 mb-4">
            <FaExclamationTriangle size={80} />
        </div>
        <h1 className="display-4 fw-bold mb-3">404</h1>
        <h2 className="h4 text-muted mb-4">Page Not Found</h2>
        <p className="text-muted mb-5 mw-50 mx-auto" style={{ maxWidth: '500px' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button 
            variant="primary-custom" 
            size="lg" 
            className="rounded-pill px-5 shadow-sm fw-bold"
            onClick={() => navigate('/')}
        >
            <FaHome className="me-2" /> Back to Home
        </Button>
      </Container>
    </div>
  );
}
