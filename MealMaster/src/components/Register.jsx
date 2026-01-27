import { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/useAuth";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    const emailError = validateField('email', formData.email);
    if (emailError) return toast.error(emailError);

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
    }
  };

  const verifyOtp = async () => {
    if (!/^[0-9]{6}$/.test(formData.otp)) {
      return toast.error('OTP must be 6 digits');
    }

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
    }
  };

  const validateField = (field, value) => {
    if (!value.trim()) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (!VALIDATION_PATTERNS[field].test(value.trim())) return VALIDATION_MESSAGES[field];
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = ['name', 'email', 'mobile', 'password', 'addressLine', 'city', 'state', 'pincode'];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) return toast.error(error);
    }

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
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register - Step {step} of 3</h2>

      {step === 1 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button onClick={sendOtp}>Send OTP</Button>
        </Form>
      )}

      {step === 2 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP sent to {formData.email}</Form.Label>
            <Form.Control
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              required
            />
          </Form.Group>
          <Button onClick={verifyOtp} className="me-2">Verify OTP</Button>
          <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
        </Form>
      )}

      {step === 3 && (
        <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Vendor">Vendor</option>
            <option value="Admin">Admin</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </Form.Group>

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

        <Button type="submit">Register</Button>
        <Button variant="secondary" onClick={() => setStep(2)} className="ms-2">Back</Button>
        <p className="mt-3">
          Already registered? <Link to="/login">Login</Link>
        </p>
        </Form>
      )}
    </Container>
  );
}

export default Register;
