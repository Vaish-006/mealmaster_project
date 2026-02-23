import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaCalendarAlt, FaTruck, FaStar, FaArrowRight } from "react-icons/fa";

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-white py-5 py-lg-6 position-relative overflow-hidden">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Badge bg="primary-custom" className="mb-3 px-3 py-2 rounded-pill fw-normal">
                #1 Meal Subscription Service
              </Badge>
              <h1 className="display-4 fw-bold mb-4 text-dark">
                Delicious Meals, <span className="text-primary-custom">Delivered Daily.</span>
              </h1>
              <p className="lead text-muted mb-5" style={{ maxWidth: '500px' }}>
                Experience the joy of healthy, chef-curated meals delivered fresh to your doorstep. 
                Flexible plans for every lifestyle.
              </p>
              <div className="d-flex gap-3">
                <Button variant="primary-custom" size="lg" className="px-4 py-2 rounded-pill" onClick={() => navigate("/subscriptions")}>
                  Browse Plans
                </Button>
                <Button variant="outline-primary-custom" size="lg" className="px-4 py-2 rounded-pill">
                  How it Works
                </Button>
              </div>
            </Col>

            <Col lg={6} className="text-center position-relative">
              <div className="position-relative z-1">
                <img
                  src="https://static.vecteezy.com/system/resources/thumbnails/068/494/456/small/hands-holding-traditional-indian-thali-with-various-dishes-and-flatbread-photo.jpg"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Delicious meal"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
              {/* Decorative circle */}
              <div className="position-absolute top-50 start-50 translate-middle z-0 bg-primary-custom opacity-10 rounded-circle" 
                   style={{ width: '120%', height: '120%', filter: 'blur(60px)' }}></div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* FEATURES */}
      <div className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">Why Choose MealMaster?</h2>
            <p className="text-muted">We bring quality and convenience to your table</p>
          </div>

          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm card-hover text-center p-4">
                <Card.Body>
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle mb-4" style={{ width: '64px', height: '64px' }}>
                    <FaLeaf size={28} />
                  </div>
                  <h4 className="h5 fw-bold">Healthy Choices</h4>
                  <p className="text-muted small mb-0">Fresh, nutritious & chef-curated meal plans designed for your well-being.</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm card-hover text-center p-4">
                <Card.Body>
                  <div className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle mb-4" style={{ width: '64px', height: '64px' }}>
                    <FaCalendarAlt size={28} />
                  </div>
                  <h4 className="h5 fw-bold">Flexible Plans</h4>
                  <p className="text-muted small mb-0">Choose from 7-day, 15-day & 30-day packages that fit your schedule.</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm card-hover text-center p-4">
                <Card.Body>
                  <div className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info rounded-circle mb-4" style={{ width: '64px', height: '64px' }}>
                    <FaTruck size={28} />
                  </div>
                  <h4 className="h5 fw-bold">On-Time Delivery</h4>
                  <p className="text-muted small mb-0">Reliable delivery service ensures your meals arrive fresh and on time.</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm card-hover text-center p-4">
                <Card.Body>
                  <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-4" style={{ width: '64px', height: '64px' }}>
                    <FaStar size={28} />
                  </div>
                  <h4 className="h5 fw-bold">Trusted Quality</h4>
                  <p className="text-muted small mb-0">Meals prepared by top-rated vendors with strict quality checks.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA SECTION */}
      <div className="bg-white py-5">
        <Container>
          <div className="bg-primary-custom rounded-4 p-5 text-center text-white position-relative overflow-hidden">
            <div className="position-relative z-1">
              <h2 className="display-6 fw-bold mb-3 text-white">Ready to simplify your meals?</h2>
              <p className="lead mb-4 opacity-75">Join thousands of happy customers enjoying healthy meals every day.</p>
              <Button variant="light" size="lg" className="px-5 rounded-pill text-primary-custom fw-bold" onClick={() => navigate("/subscriptions")}>
                Explore Plans <FaArrowRight className="ms-2" />
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
