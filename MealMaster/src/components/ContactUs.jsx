import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaPaperPlane } from "react-icons/fa";
import { apiRequest } from "../api/http";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDGugrOB4YOSYmEQcACClwSUqk5oisP_9M';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '16px'
};

const center = {
    lat: 18.5204, // Pune center
    lng: 73.8567
};

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
            <div className="bg-primary-custom text-white py-5 py-lg-6 position-relative overflow-hidden">
                <Container className="position-relative z-1 text-center">
                    <Badge bg="white" className="mb-3 px-3 py-2 rounded-pill fw-normal text-primary-custom shadow-sm">
                        Support
                    </Badge>
                    <h1 className="display-4 fw-bold mb-3 mt-2">Contact Us</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: "600px" }}>
                        Have questions? We'd love to hear from you.
                    </p>
                </Container>
                {/* Decorative circle with corrected opacity */}
                <div className="position-absolute top-100 start-50 translate-middle z-0 bg-white rounded-circle"
                    style={{ width: '800px', height: '800px', filter: 'blur(80px)', opacity: '0.07' }}></div>
            </div>

            <Container className="my-5">
                <Row className="g-4">
                    {/* Contact Info */}
                    <Col lg={5}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Body className="p-4 p-lg-5">
                                <h3 className="fw-bold mb-4">Get in Touch</h3>

                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <FaMapMarkerAlt size={20} />
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="fw-bold mb-1">Our Address</h5>
                                        <p className="text-muted mb-0">123 Meal Master Street, Food City, 411001</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <FaEnvelope size={20} />
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="fw-bold mb-1">Email Us</h5>
                                        <p className="text-muted mb-0">support@mealmaster.com</p>
                                    </div>
                                </div>

                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <FaPhone size={20} />
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="fw-bold mb-1">Call Us</h5>
                                        <p className="text-muted mb-0">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <div className="bg-info bg-opacity-10 text-info rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <FaClock size={20} />
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="fw-bold mb-1">Working Hours</h5>
                                        <p className="text-muted mb-0">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                        <p className="text-muted mb-0">Sun: Closed</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Contact Form */}
                    <Col lg={7}>
                        <Card className="h-100 border-0 shadow-sm rounded-4">
                            <Card.Body className="p-4 p-lg-5">
                                <h3 className="fw-bold mb-4">Send a Message</h3>
                                <Form onSubmit={handleSubmit}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Your Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter your name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-3 shadow-sm py-2"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-3 shadow-sm py-2"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Subject</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="subject"
                                                    placeholder="How can we help?"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-3 shadow-sm py-2"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Message</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    name="message"
                                                    rows={4}
                                                    placeholder="Write your message here..."
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    className="rounded-3 shadow-sm py-2"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Button
                                                variant="primary-custom"
                                                type="submit"
                                                size="lg"
                                                className="w-100 rounded-pill fw-bold shadow-sm"
                                                disabled={loading}
                                            >
                                                {loading ? <><Spinner size="sm" className="me-2" /> Sending...</> : <><FaPaperPlane className="me-2" /> Send Message</>}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Map Section */}
            <div className="bg-light py-5">
                <Container className="text-center">
                    <h3 className="fw-bold mb-4">Find Us on Map</h3>
                    <div className="shadow-sm rounded-4 overflow-hidden">
                        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={center}
                                zoom={14}
                            >
                                <Marker
                                    position={center}
                                    label="MealMaster"
                                    title="MealMaster Headquarters"
                                />
                            </GoogleMap>
                        </LoadScript>
                    </div>
                    <div className="mt-3 text-muted small">
                        Visit us at our Pune office for any queries or partnership discussions.
                    </div>
                </Container>
            </div>
        </>
    );
}
