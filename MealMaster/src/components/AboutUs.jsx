import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { FaUsers, FaBullseye, FaProjectDiagram, FaGithub } from "react-icons/fa";

export default function AboutUs() {
  return (
    <>
      {/* Banner Section */}
      <div className="bg-primary-custom text-white py-5 py-lg-6 position-relative overflow-hidden">
        <Container className="position-relative z-1 text-center">
          <Badge bg="white" className="mb-3 px-3 py-2 rounded-pill fw-normal text-primary-custom shadow-sm">
            About Us
          </Badge>
          <h1 className="display-4 fw-bold mb-3 mt-2">Welcome to MealMaster</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: "600px" }}>
            A smart meal subscription platform designed to make healthy eating simple, affordable, and accessible.
          </p>
        </Container>
        {/* Decorative circle with corrected opacity */}
        <div className="position-absolute top-100 start-50 translate-middle z-0 bg-white rounded-circle"
          style={{ width: '800px', height: '800px', filter: 'blur(80px)', opacity: '0.07' }}></div>
      </div>

      {/* Project Info */}
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-5">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                    <FaProjectDiagram size={28} />
                  </div>
                  <h3 className="fw-bold">Project Overview</h3>
                </div>

                <Row className="g-4 align-items-center">
                  <Col md={6}>
                    <p className="text-muted mb-4">
                      <strong>MealMaster</strong> is a comprehensive meal subscription management system. We connect food lovers with trusted vendors, offering flexible plans that fit your lifestyle.
                    </p>
                    <p className="text-muted">
                      Whether you need a 7-day trial or a monthly commitment, our platform ensures you get fresh, delicious meals delivered right to your doorstep.
                    </p>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-4 rounded-4">
                      <h6 className="fw-bold mb-3 text-uppercase text-muted small">Key Features</h6>
                      <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                        <li className="d-flex align-items-center">
                          <span className="bg-white text-success rounded-circle p-1 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</span>
                          <span>Browse multiple meal subscription plans</span>
                        </li>
                        <li className="d-flex align-items-center">
                          <span className="bg-white text-success rounded-circle p-1 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</span>
                          <span>View detailed day-wise meal breakdown</span>
                        </li>
                        <li className="d-flex align-items-center">
                          <span className="bg-white text-success rounded-circle p-1 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</span>
                          <span>User-friendly and responsive UI</span>
                        </li>
                        <li className="d-flex align-items-center">
                          <span className="bg-white text-success rounded-circle p-1 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>✓</span>
                          <span>Vendor-managed subscription services</span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
            <FaUsers size={28} />
          </div>
          <h3 className="fw-bold">Our Development Team</h3>
          <p className="text-muted">Passionate developers behind MealMaster</p>
        </div>

        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <Row className="g-4">
                  {[
                    { id: "250840320005", name: "Abhishek Narayan Jagtap", role: "Project Lead", image: "/Image/Abhishekh.jpeg" },
                    { id: "250840320047", name: "Chetankumar Badusing Banjara", role: "Developer", image: "/Image/Chetan.jpeg" },
                    { id: "250840320225", name: "Vaishnavi Pramod Pardeshi", role: "Developer", image: "/Image/Vaishnavi.jpeg" },
                    { id: "250840320021", name: "Amey Shekhar Raut", role: "Developer", image: "/Image/Amey.jpeg" }
                  ].map((member, idx) => (
                    <Col md={6} key={idx} className="mb-4">
                      <div className="d-flex align-items-center p-4 rounded-4 bg-light h-100 card-hover shadow-sm border">
                        <div className="flex-shrink-0">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="rounded-circle shadow-sm border border-3 border-white"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-white rounded-circle p-3 text-primary-custom shadow-sm d-flex align-items-center justify-content-center border border-3 border-white" style={{ width: '100px', height: '100px' }}>
                              <span className="fw-bold fs-3">{member.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="ms-4 overflow-hidden">
                          <h5 className="fw-bold mb-1 text-truncate" title={member.name}>{member.name}</h5>
                          <div className="d-flex align-items-center text-muted">
                            <span className="me-2">{member.id}</span>
                            {member.role === "Project Lead" && <Badge bg="primary-custom" className="rounded-pill px-3">Project Lead</Badge>}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                <div className="text-center mt-4 pt-4 border-top">
                  <p className="text-muted mb-0 mx-auto" style={{ maxWidth: '600px' }}>
                    We worked together as a passionate team to design and develop MealMaster — focusing on UI,
                    backend integration, and delivering a seamless user experience.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Mission Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <div className="d-inline-flex align-items-center justify-content-center bg-white text-primary-custom rounded-circle mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
                <FaBullseye size={28} />
              </div>
              <h3 className="fw-bold mb-3">Our Mission</h3>
              <p className="lead text-muted mb-0">
                To simplify meal subscriptions while promoting healthy eating habits through
                smart and accessible technology.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
