import { Container, Card, Row, Col, Button, Table } from "react-bootstrap";

export default function ViewSubscription() {
  return (
    <Container className="mt-4 mb-5" style={{ maxWidth: "900px" }}>

      <h3 className="text-center mb-4">Subscription Details</h3>

      <Card className="p-3 shadow-sm">

        <Row>
          <Col md={4} className="text-center">
            <img
              src="https://via.placeholder.com/250x160"
              alt="subscription"
              className="img-fluid rounded"
            />
          </Col>

          <Col md={8}>
            <h4>Healthy Veg Plan</h4>

            <p><strong>Subscription ID:</strong> SUB001</p>
            <p><strong>Vendor ID:</strong> VENDOR11</p>
            <p><strong>Plan Type:</strong> Veg</p>

            <p>
              <strong>Description:</strong><br />
              A healthy veg meal plan including balanced daily meals.
            </p>
          </Col>
        </Row>

        <hr />

        <h5>Pricing</h5>

        <Table bordered>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>7-Day Plan</td><td>₹999</td></tr>
            <tr><td>15-Day Plan</td><td>₹1899</td></tr>
            <tr><td>30-Day Plan</td><td>₹3499</td></tr>
          </tbody>
        </Table>

        <h5 className="mt-3">Meal Plan (7 Days)</h5>

        <Table bordered>
          <tbody>
            <tr><td><strong>Day 1</strong></td><td>Paneer curry, roti, salad</td></tr>
            <tr><td><strong>Day 2</strong></td><td>Dal fry, jeera rice, curd</td></tr>
            <tr><td><strong>Day 3</strong></td><td>Veg biryani + raita</td></tr>
            <tr><td><strong>Day 4</strong></td><td>Chole + bhature</td></tr>
            <tr><td><strong>Day 5</strong></td><td>Veg thali</td></tr>
            <tr><td><strong>Day 6</strong></td><td>Veg pulao + salad</td></tr>
            <tr><td><strong>Day 7</strong></td><td>Mix veg + chapati</td></tr>
          </tbody>
        </Table>

        <div className="text-center mt-3">
          <Button variant="secondary" className="me-2">
            Back
          </Button>

          <Button variant="warning" className="me-2">
            Modify
          </Button>

          <Button variant="danger">
            Delete
          </Button>
        </div>

      </Card>
    </Container>
  );
}
