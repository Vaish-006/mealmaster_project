import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container className="py-5">
        <Row className="g-4">
          <Col lg={4} md={6}>
            <h5 className="footer-heading mb-3">MealMaster</h5>
            <p className="footer-text">
              Your meal planning companion. Discover healthy meal plans, 
              manage your subscriptions, and enjoy delicious food delivered to your door.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#!" className="social-icon"><FaFacebook size={20} /></a>
              <a href="#!" className="social-icon"><FaTwitter size={20} /></a>
              <a href="#!" className="social-icon"><FaInstagram size={20} /></a>
              <a href="#!" className="social-icon"><FaLinkedin size={20} /></a>
            </div>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="footer-heading mb-3">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/subscriptions">Subscriptions</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-3">Support</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-3">Contact Info</h5>
            <p className="footer-text mb-1">123 Food Street, Tasty City</p>
            <p className="footer-text mb-1">support@mealmaster.com</p>
            <p className="footer-text">+1 (555) 123-4567</p>
          </Col>
        </Row>
        <hr className="footer-divider my-4" />
        <Row>
          <Col className="text-center">
            <p className="footer-copyright mb-0">
              &copy; {new Date().getFullYear()} MealMaster. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
