import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

import "../components/Footer.css"
const Footer = () => {
  return (
    <footer className="footer text-light mt-5">
      <Container fluid className="py-4">
        <Row>
          <Col md={4}>
            <h5>Mealmaster</h5>
            <p>Your meal planning companion.</p>
          </Col>
          <Col md={4}>
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-chevron-right me-1 text-primary"></i> <a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><i className="bi bi-chevron-right me-1 text-primary"></i> <a href="/about-us" className="text-light text-decoration-none">About Us</a></li>
              <li><i className="bi bi-chevron-right me-1 text-primary"></i> <a href="/contact-us" className="text-light text-decoration-none">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <div className="d-flex">
              <a href="#!" className="text-light me-3"><FaFacebook size={24} /></a>
              <a href="#!" className="text-light me-3"><FaTwitter size={24} /></a>
              <a href="#!" className="text-light"><FaInstagram size={24} /></a>
            </div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            <p>&copy; 2025 Mealmaster. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
