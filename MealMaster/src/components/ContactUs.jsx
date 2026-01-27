import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../api/http";

export default function ContactUs() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiRequest('/contact', {
                method: 'POST',
                body: formData
            });
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(err.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Banner Section */}
            <div
                style={{
                    background: "linear-gradient(90deg, #FF6B6B, #FF8E53)",
                    color: "white",
                    padding: "70px 0",
                    textAlign: "center"
                }}
            >
                <Container>
                    <h1 className="fw-bold">Contact Us</h1>
                    <p className="fs-5 mt-3">
                        Have questions? We'd love to hear from you.
                    </p>
                </Container>
            </div>

            <Container className="my-5">
                <Row className="g-4">
                    {/* Contact Info */}
                    <Col lg={5}>
                        <Card className="h-100 p-4 shadow-sm border-0">
                            <h3 className="fw-bold mb-4">Get in Touch</h3>
                            <div className="mb-4">
                                <h5 className="text-primary"><i className="bi bi-geo-alt-fill me-2"></i> Our Address</h5>
                                <p className="text-muted">123 Meal Master Street, Food City, 411001</p>
                            </div>
                            <div className="mb-4">
                                <h5 className="text-success"><i className="bi bi-envelope-fill me-2"></i> Email Us</h5>
                                <p className="text-muted">support@mealmaster.com</p>
                            </div>
                            <div className="mb-4">
                                <h5 className="text-warning"><i className="bi bi-telephone-fill me-2"></i> Call Us</h5>
                                <p className="text-muted">+91 98765 43210</p>
                            </div>
                            <div>
                                <h5 className="text-info"><i className="bi bi-clock-fill me-2"></i> Working Hours</h5>
                                <p className="text-muted mb-0">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                <p className="text-muted">Sun: Closed</p>
                            </div>
                        </Card>
                    </Col>

                    {/* Contact Form */}
                    <Col lg={7}>
                        <Card className="p-4 shadow-sm border-0">
                            <h3 className="fw-bold mb-4">Send a Message</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Your Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                placeholder="Enter your name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Subject</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        rows={4}
                                        placeholder="Write your message here..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button variant="primary" type="submit" size="lg" style={{ background: "#FF6B6B", border: "none" }} disabled={loading}>
                                        {loading ? "Sending..." : "Send Message"}
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Map Section Placeholder */}
            <div style={{ background: "#f8f9fa", padding: "50px 0" }}>
                <Container className="text-center">
                    <h3 className="fw-bold mb-4">Find Us on Map</h3>
                    <div
                        className="rounded shadow-sm d-flex align-items-center justify-content-center"
                        style={{ background: "#e9ecef", height: "400px", fontSize: "1.2rem", color: "#6c757d" }}
                    >
                        Google Maps will be integrated here
                    </div>
                </Container>
            </div>
        </>
    );
}
