import { Container, Row, Col, Card } from "react-bootstrap";

export default function AboutUs() {
  return (
    <>
      {/* Banner Section */}
      <div
        style={{
          background: "linear-gradient(90deg, #2A7B9B, #57C785)",
          color: "white",
          padding: "70px 0",
          textAlign: "center"
        }}
      >
        <Container>
          <h1 className="fw-bold">About MealMaster</h1>
          <p className="fs-5 mt-3">
            A smart meal subscription platform designed to make healthy eating simple, affordable, and accessible.
          </p>
        </Container>
      </div>

      {/* Project Info */}
      <Container className="my-5">
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="p-4 shadow-sm">
              <h3 className="fw-bold mb-3 text-center">Project Overview</h3>

              <p className="fs-6">
                <strong>MealMaster</strong> is a meal subscription management system that allows users
                to explore meal plans, subscribe to different packages (7-day, 15-day, 30-day),
                and receive fresh meals daily from trusted vendors.
              </p>

              <p className="fs-6">
                This project aims to provide a smooth experience for both customers and vendors, 
                making meal planning easy, efficient, and reliable.
              </p>

              <ul>
                <li>Browse multiple meal subscription plans</li>
                <li>View detailed day-wise meal breakdown</li>
                <li>User-friendly and responsive UI</li>
                <li>Vendor-managed subscription services</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Team Section */}
      <Container className="mb-5">
        <h3 className="fw-bold text-center mb-4">Our Development Team</h3>

        <Row className="justify-content-center g-4">

          <Col md={10}>
            <Card className="p-3 shadow-sm">
              <ul className="fs-5">

                <li>
                  <strong>250840320005 — Abhishek Narayan Jagtap(PL)</strong>
                </li>

                <li>
                  <strong>250840320047 — Chetankumar Badusing Banjara</strong>
                </li>

                <li>
                  <strong>250840320042 — Bhavna Yadav Balpande</strong>
                </li>

                <li>
                  <strong>250840320225 — Vaishnavi Pramod Pardeshi</strong>
                </li>

                <li>
                  <strong>250840320021 — Amey Shekhar Raut</strong>
                </li>

              </ul>

              <p className="mt-3">
                We worked together as a passionate team to design and develop MealMaster — focusing on UI, 
                backend integration, and delivering a seamless user experience.
              </p>
            </Card>
          </Col>

        </Row>
      </Container>

      {/* Mission Section */}
      <div style={{ background: "#F7FAFF", padding: "50px 0" }}>
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Card className="p-4 shadow-sm">
                <h3 className="fw-bold mb-3 text-center">Our Mission</h3>
                <p className="fs-6 text-center">
                  To simplify meal subscriptions while promoting healthy eating habits through 
                  smart and accessible technology.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
