import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login({ email, password });
      toast.success("Login successful");
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Vendor") navigate("/vendor/subscriptions");
      else navigate("/user/dashboard");
    } catch (err) {
      const message = err?.message || "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Login</Button>
        <p className="mt-3">
  New user? <Link to="/register">Register here</Link>
</p>
      </Form>
    </Container>
  );
}

export default Login;
