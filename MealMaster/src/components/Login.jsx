import { useState } from "react";
import { Button, Form, Container, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/useAuth";
import { MdOutlineFoodBank } from "react-icons/md";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      toast.success("Welcome back!");
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Vendor") navigate("/vendor/subscriptions");
      else navigate("/user/dashboard");
    } catch (err) {
      const message = err?.message || "Login failed. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <div className="text-center mb-4">
              <MdOutlineFoodBank size={48} className="text-primary-custom mb-2" />
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Sign in to your MealMaster account</p>
            </div>
            
            <Card className="border-0 shadow-custom">
              <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger" className="mb-4 text-center">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary-custom" 
                    className="w-100 btn-lg mb-3"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white text-center py-3 border-0">
                <p className="mb-0 text-muted">
                  Don't have an account? <Link to="/register" className="text-primary-custom fw-semibold text-decoration-none">Create account</Link>
                </p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
