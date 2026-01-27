import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function UpdateSubscriptionForm() {
  return (
       <Container style={{ maxWidth: "700px" }} className="mt-4 mb-5">

      <h3 className="mb-3 text-center">Update Subscription Plan</h3>

      <Form>

        <Form.Group className="mb-3">
          <Form.Label>Subscription Name</Form.Label>
          <Form.Control type="text" placeholder="Enter plan name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} placeholder="Enter description" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Vendor ID</Form.Label>
          <Form.Control type="text" placeholder="Enter vendor id" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Plan Type</Form.Label>
          <Form.Select>
            <option>Select</option>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Mix</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Food Image URL</Form.Label>
          <Form.Control type="text" placeholder="https://example.com/image.jpg" />
        </Form.Group>

        <h5 className="mt-4">Pricing</h5>

        <Form.Group className="mb-2">
          <Form.Label>7-Day Plan Price</Form.Label>
          <Form.Control type="number" placeholder="Enter price" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>15-Day Plan Price</Form.Label>
          <Form.Control type="number" placeholder="Enter price" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>30-Day Plan Price</Form.Label>
          <Form.Control type="number" placeholder="Enter price" />
        </Form.Group>

        <h5 className="mt-4">Meals (7 Days)</h5>

        <Form.Group className="mb-2">
          <Form.Label>Day 1 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day 2 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day 3 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day 4 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day 5 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day 6 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Day 7 Meal Description</Form.Label>
          <Form.Control type="text" placeholder="Enter meal details" />
        </Form.Group>

        <div className="text-center">
          <Button variant="warning" type="submit">
            Update Plan
          </Button>
        </div>

      </Form>
    </Container>
  );
}
