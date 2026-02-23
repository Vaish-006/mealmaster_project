import { useState } from "react";
import { Button, Form, Container, Card, Row, Col, ProgressBar } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/useAuth";
import { MdOutlineFoodBank } from "react-icons/md";

// Validation regex patterns
const VALIDATION_PATTERNS = {
  name: /^[a-zA-Z\s]{2,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  pincode: /^[1-9][0-9]{5}$/,
  city: /^[a-zA-Z\s]{2,30}$/,
  state: /^[a-zA-Z\s]{2,30}$/,
  addressLine: /^[a-zA-Z0-9\s,.-]{5,100}$/
};

const VALIDATION_MESSAGES = {
  name: "Name must contain only letters and spaces (2-50 characters)",
  email: "Please enter a valid email address",
  mobile: "Mobile must be a valid 10-digit Indian number starting with 6-9",
  password: "Password must be 8+ characters with uppercase, lowercase, number and special character",
  pincode: "Pincode must be 6 digits and cannot start with 0",
  city: "City must contain only letters and spaces (2-30 characters)",
  state: "State must contain only letters and spaces (2-30 characters)",
  addressLine: "Address must be 5-100 characters with letters, numbers, spaces and basic punctuation"
};

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "User",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateField = (field, value) => {
    if (!value.trim()) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (VALIDATION_PATTERNS[field] && !VALIDATION_PATTERNS[field].test(value.trim())) return VALIDATION_MESSAGES[field];
    return null;
  };

  const sendOtp = async () => {
    const emailError = validateField('email', formData.email);
    if (emailError) return toast.error(emailError);
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:9090/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setStep(2);
        toast.success('OTP sent to your email');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^[0-9]{6}$/.test(formData.otp)) {
      return toast.error('OTP must be 6 digits');
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:9090/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await response.json();
      
      if (response.ok) {
        setStep(3);
        toast.success('OTP verified successfully');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = ['name', 'email', 'mobile', 'password', 'addressLine', 'city', 'state', 'pincode'];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) return toast.error(error);
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.role,
        addressLine: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };
      const user = await register(payload);
      toast.success("Registration successful");
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Vendor") navigate("/vendor/subscriptions");
      else navigate("/user/dashboard");
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <div className="text-center mb-4">
              <MdOutlineFoodBank size={48} className="text-primary-custom mb-2" />
              <h2 className="fw-bold">Create an Account</h2>
              <p className="text-muted">Join MealMaster today</p>
            </div>
            
            <Card className="border-0 shadow-custom">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                 <div className="px-4">
                   <div className="d-flex justify-content-between mb-2 text-muted small fw-bold">
                     <span>Email</span>
                     <span>Verify</span>
                     <span>Details</span>
                   </div>
                   <ProgressBar 
                    now={(step / 3) * 100} 
                    variant="success" 
                    className="mb-2" 
                    style={{ height: '6px' }} 
                   />
                 </div>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {step === 1 && (
                  <Form onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
                    <h4 className="mb-3">Let's start with your email</h4>
                    <Form.Group className="mb-4">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="form-control-lg"
                      />
                    </Form.Group>
                    <Button 
                      onClick={sendOtp} 
                      variant="primary-custom" 
                      className="w-100 btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Sending OTP..." : "Continue"}
                    </Button>
                  </Form>
                )}

                {step === 2 && (
                  <Form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }}>
                    <h4 className="mb-3">Verify your email</h4>
                    <p className="text-muted mb-4">We sent a 6-digit code to <strong>{formData.email}</strong></p>
                    <Form.Group className="mb-4">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength="6"
                        placeholder="000000"
                        required
                        className="form-control-lg text-center letter-spacing-2"
                        style={{ letterSpacing: '0.5em', fontSize: '1.5rem' }}
                      />
                    </Form.Group>
                    <Button 
                      onClick={verifyOtp} 
                      variant="primary-custom" 
                      className="w-100 btn-lg mb-3"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button variant="link" className="w-100 text-decoration-none text-muted" onClick={() => setStep(1)}>
                      Change Email
                    </Button>
                  </Form>
                )}

                {step === 3 && (
                  <Form onSubmit={handleRegister}>
                    <h4 className="mb-4">Complete your profile</h4>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Account Type</Form.Label>
                          <Form.Select name="role" value={formData.role} onChange={handleChange} className="form-select-lg">
                            <option value="User">User</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Admin">Admin</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mt-4 mb-3 border-bottom pb-2">Address Details</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Address Line</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Pincode</Form.Label>
                          <Form.Control
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid gap-2 mt-4">
                      <Button type="submit" variant="primary-custom" size="lg" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <Button variant="outline-secondary" onClick={() => setStep(2)}>Back</Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
              <Card.Footer className="bg-white text-center py-3 border-0">
                <p className="mb-0 text-muted">
                  Already registered? <Link to="/login" className="text-primary-custom fw-semibold text-decoration-none">Login here</Link>
                </p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
