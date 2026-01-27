import { Table, Button, Container, Image } from "react-bootstrap";

export default function SubscriptionTable() {
  return (
    <Container className="mt-4">

      <h3 className="mb-3 text-center">Subscription List</h3>

      <Table bordered hover responsive>

        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th>Subscription ID</th>
            <th>Subscription Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>SUB001</td>
            <td>Healthy Veg Plan</td>
            <td>
              <Image 
                src="https://via.placeholder.com/80"
                alt="plan"
                width="80"
                height="60"
                rounded
              />
            </td>
            <td>
              <Button variant="info" size="sm" className="me-2">
                View
              </Button>

              <Button variant="warning" size="sm" className="me-2">
                Modify
              </Button>

              <Button variant="danger" size="sm">
                Delete
              </Button>
            </td>
          </tr>

          <tr>
            <td>SUB002</td>
            <td>Non-Veg Premium Plan</td>
            <td>
              <Image 
                src="https://via.placeholder.com/80"
                alt="plan"
                width="80"
                height="60"
                rounded
              />
            </td>
            <td>
              <Button variant="info" size="sm" className="me-2">
                View
              </Button>

              <Button variant="warning" size="sm" className="me-2">
                Modify
              </Button>

              <Button variant="danger" size="sm">
                Delete
              </Button>
            </td>
          </tr>

          <tr>
            <td>SUB003</td>
            <td>Mixed Diet Classic</td>
            <td>
              <Image 
                src="https://via.placeholder.com/80"
                alt="plan"
                width="80"
                height="60"
                rounded
              />
            </td>
            <td>
              <Button variant="info" size="sm" className="me-2">
                View
              </Button>

              <Button variant="warning" size="sm" className="me-2">
                Modify
              </Button>

              <Button variant="danger" size="sm">
                Delete
              </Button>
            </td>
          </tr>

        </tbody>
      </Table>
    </Container>
  );
}
