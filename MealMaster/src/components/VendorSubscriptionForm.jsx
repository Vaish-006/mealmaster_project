import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row, Spinner, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaUtensils, FaRupeeSign, FaCalendarDay } from 'react-icons/fa';
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

  const title = useMemo(() => (isEdit ? 'Update Plan' : 'Create New Plan'), [isEdit]);

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
        toast.success('Subscription updated successfully');
      } else {
        await apiRequest('/subscriptions', { method: 'POST', token: user.token, body: payload });
        toast.success('Subscription created successfully');
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
        <Spinner animation="border" variant="primary-custom" />
      </Container>
    );
  }

  return (
    <Container className="py-5 mb-5">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <div className="d-flex align-items-center mb-4">
            <Button variant="light" className="rounded-circle p-2 me-3 text-muted" onClick={() => navigate('/vendor/subscriptions')}>
              <FaArrowLeft />
            </Button>
            <div>
              <h2 className="fw-bold mb-0">{title}</h2>
              <p className="text-muted mb-0">Fill in the details for your meal plan</p>
            </div>
          </div>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleSubmit}>
                
                {/* Basic Info */}
                <h5 className="fw-bold mb-4 text-primary-custom d-flex align-items-center">
                  <FaUtensils className="me-2" /> Basic Information
                </h5>
                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Plan Name</Form.Label>
                      <Form.Control 
                        value={form.name} 
                        onChange={updateField('name')} 
                        type="text" 
                        placeholder="e.g. Healthy Keto Plan" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control 
                        value={form.description} 
                        onChange={updateField('description')} 
                        as="textarea" 
                        rows={3} 
                        placeholder="Describe your meal plan..." 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control 
                        value={form.city} 
                        onChange={updateField('city')} 
                        type="text" 
                        placeholder="e.g. Pune" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Diet Type</Form.Label>
                      <Form.Select 
                        value={form.planType} 
                        onChange={updateField('planType')}
                        className="rounded-3 shadow-sm py-2"
                      >
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                        <option value="Mix">Mixed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Cover Image URL</Form.Label>
                      <Form.Control 
                        value={form.imageUrl} 
                        onChange={updateField('imageUrl')} 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-5 text-muted opacity-25" />

                {/* Pricing */}
                <h5 className="fw-bold mb-4 text-primary-custom d-flex align-items-center">
                  <FaRupeeSign className="me-2" /> Pricing Plans
                </h5>
                <Row className="g-3 mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>7 Days</Form.Label>
                      <Form.Control 
                        value={form.price7} 
                        onChange={updateField('price7')} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="₹ 0.00" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>15 Days</Form.Label>
                      <Form.Control 
                        value={form.price15} 
                        onChange={updateField('price15')} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="₹ 0.00" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>30 Days</Form.Label>
                      <Form.Control 
                        value={form.price30} 
                        onChange={updateField('price30')} 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="₹ 0.00" 
                        className="rounded-3 shadow-sm py-2"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <hr className="my-5 text-muted opacity-25" />

                {/* Weekly Menu */}
                <h5 className="fw-bold mb-4 text-primary-custom d-flex align-items-center">
                  <FaCalendarDay className="me-2" /> Weekly Menu (Example)
                </h5>
                <Row className="g-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <Col md={day === 7 ? 12 : 6} key={day}>
                      <Form.Group>
                        <Form.Label className="text-muted small fw-bold text-uppercase">Day {day}</Form.Label>
                        <Form.Control 
                          value={form[`day${day}`]} 
                          onChange={updateField(`day${day}`)} 
                          type="text" 
                          placeholder={`Menu for Day ${day}`} 
                          className="rounded-3 shadow-sm py-2"
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
                  <Button variant="light" className="rounded-pill px-4" onClick={() => navigate('/vendor/subscriptions')}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary-custom" 
                    type="submit" 
                    className="rounded-pill px-4 fw-bold shadow-sm"
                    disabled={saving}
                  >
                    {saving ? <><Spinner size="sm" className="me-2"/> Saving...</> : <><FaSave className="me-2"/> {isEdit ? 'Update Plan' : 'Publish Plan'}</>}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
