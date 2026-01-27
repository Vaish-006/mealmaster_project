import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

const emptyForm = {
  name: '',
  description: '',
  city: '',
  planType: 'Veg',
  imageUrl: '',
  price7: '',
  price15: '',
  price30: '',
  day1: '',
  day2: '',
  day3: '',
  day4: '',
  day5: '',
  day6: '',
  day7: ''
};

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function VendorSubscriptionForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const title = useMemo(() => (isEdit ? 'Update Subscription Plan' : 'Create Subscription Plan'), [isEdit]);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest(`/subscriptions/${id}`);
        if (cancelled) return;
        setForm({
          name: data.name || '',
          description: data.description || '',
          city: data.city || '',
          planType: data.planType || 'Veg',
          imageUrl: data.imageUrl || '',
          price7: data.price7 ?? '',
          price15: data.price15 ?? '',
          price30: data.price30 ?? '',
          day1: data.day1 || '',
          day2: data.day2 || '',
          day3: data.day3 || '',
          day4: data.day4 || '',
          day5: data.day5 || '',
          day6: data.day6 || '',
          day7: data.day7 || ''
        });
      } catch (e) {
        toast.error(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  function updateField(key) {
    return (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Subscription name is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.city.trim()) return toast.error('City is required');
    if (!form.day1.trim() || !form.day2.trim() || !form.day3.trim() || !form.day4.trim() || !form.day5.trim() || !form.day6.trim() || !form.day7.trim()) {
      return toast.error('All 7 day meals are required');
    }

    const trimmedImageUrl = form.imageUrl.trim();
    const payload = {
      name: form.name,
      description: form.description,
      city: form.city,
      planType: form.planType,
      imageUrl: trimmedImageUrl || '',
      price7: toNumber(form.price7),
      price15: toNumber(form.price15),
      price30: toNumber(form.price30),
      day1: form.day1,
      day2: form.day2,
      day3: form.day3,
      day4: form.day4,
      day5: form.day5,
      day6: form.day6,
      day7: form.day7
    };

    setSaving(true);
    try {
      if (isEdit) {
        await apiRequest(`/subscriptions/${id}`, { method: 'PUT', token: user.token, body: payload });
        toast.success('Subscription updated');
      } else {
        await apiRequest('/subscriptions', { method: 'POST', token: user.token, body: payload });
        toast.success('Subscription created');
      }
      navigate('/vendor/subscriptions');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 720 }} className="mt-4 mb-5">
      <h3 className="mb-3 text-center">{title}</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Subscription Name</Form.Label>
          <Form.Control value={form.name} onChange={updateField('name')} type="text" placeholder="Enter plan name" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control value={form.description} onChange={updateField('description')} as="textarea" rows={2} placeholder="Enter description" />
        </Form.Group>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control value={form.city} onChange={updateField('city')} type="text" placeholder="Enter city" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Plan Type</Form.Label>
              <Form.Select value={form.planType} onChange={updateField('planType')}>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Mix">Mix</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Food Image URL</Form.Label>
          <Form.Control value={form.imageUrl} onChange={updateField('imageUrl')} type="text" placeholder="https://example.com/image.jpg" />
        </Form.Group>

        <h5 className="mt-4">Pricing</h5>
        <Row className="g-3">
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>7-Day</Form.Label>
              <Form.Control value={form.price7} onChange={updateField('price7')} type="number" min="0" step="0.01" placeholder="Price" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>15-Day</Form.Label>
              <Form.Control value={form.price15} onChange={updateField('price15')} type="number" min="0" step="0.01" placeholder="Price" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-2">
              <Form.Label>30-Day</Form.Label>
              <Form.Control value={form.price30} onChange={updateField('price30')} type="number" min="0" step="0.01" placeholder="Price" />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mt-4">Meals (7 Days)</h5>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 1</Form.Label>
              <Form.Control value={form.day1} onChange={updateField('day1')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 2</Form.Label>
              <Form.Control value={form.day2} onChange={updateField('day2')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 3</Form.Label>
              <Form.Control value={form.day3} onChange={updateField('day3')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 4</Form.Label>
              <Form.Control value={form.day4} onChange={updateField('day4')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 5</Form.Label>
              <Form.Control value={form.day5} onChange={updateField('day5')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Day 6</Form.Label>
              <Form.Control value={form.day6} onChange={updateField('day6')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Day 7</Form.Label>
              <Form.Control value={form.day7} onChange={updateField('day7')} type="text" placeholder="Enter details" />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" type="button" onClick={() => navigate('/vendor/subscriptions')}>
            Cancel
          </Button>
          <Button variant={isEdit ? 'warning' : 'success'} type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Plan' : 'Submit'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
