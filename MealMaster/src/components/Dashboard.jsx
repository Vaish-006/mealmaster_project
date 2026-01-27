import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export function Dashboard() {
  const navigate = useNavigate();
  return (
    <>

      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(90deg, #2A7B9B, #57C785)",
          color: "#fff",
          padding: "80px 0"
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="fw-bold">
                Welcome to MealMaster 🍽️
              </h1>

              <p className="mt-3 fs-5">
                Your one-stop platform for healthy, tasty and affordable meal subscription plans —
                delivered fresh to your door.
              </p>

              <Button variant="light" size="lg" className="me-2">
                Get Started
              </Button>

              <Button variant="outline-light" size="lg" onClick={() => navigate("/subscriptions")}>
                View Plans
              </Button>
            </Col>

            <Col md={6} className="text-center mt-4 mt-md-0">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/068/494/456/small/hands-holding-traditional-indian-thali-with-various-dishes-and-flatbread-photo.jpg"
                className="img-fluid rounded shadow"
                alt="meal"
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* FEATURES */}
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-4">Why Choose MealMaster?</h2>

        <Row className="g-4">

          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h4>🥗 Healthy Choices</h4>
                <p>Fresh, nutritious & chef-curated meal plans.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h4>📅 Flexible Plans</h4>
                <p>7-day, 15-day & 30-day subscription packages.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h4>🚚 On-Time Delivery</h4>
                <p>Meals delivered fresh to your doorstep.</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <h4>⭐ Trusted Quality</h4>
                <p>Prepared by verified and rated vendors.</p>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>

      {/* POPULAR PLANS PREVIEW */}
      <div style={{ background: "#F7FAFF", padding: "50px 0" }}>
        <Container>
          <h2 className="text-center fw-bold mb-4">
            Popular Subscription Plans
          </h2>

          <Row className="g-4">

            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <Card.Title>Veg Meal Plan</Card.Title>
                  <p>Fresh vegetarian meals daily.</p>
                  {/* <Button variant="success">View Plan</Button> */}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <Card.Title>Non-Veg Meal Plan</Card.Title>
                  <p>Protein-rich non-veg meals.</p>
                  {/* <Button variant="success">View Plan</Button> */}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Body className="text-center">
                  <Card.Title>Mixed Diet Plan</Card.Title>
                  <p>A perfect balance of veg & non-veg.</p>
                  {/* <Button variant="success">View Plan</Button> */}
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>

      {/* CTA SECTION */}
      <div
        style={{
          background: "#2A7B9B",
          color: "white",
          padding: "50px 0",
          textAlign: "center"
        }}
      >
        <Container>
          <h2>Start Your Healthy Meal Journey Today!</h2>
          <p className="mt-2 fs-5">
            Subscribe now and enjoy fresh meals delivered daily.
          </p>
          <Button size="lg" variant="light">
            Subscribe Now
          </Button>
        </Container>
      </div>

    </>

  );
}
