import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify';
import { FaRobot, FaUtensils, FaMagic, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function SmartPlanner() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [goal, setGoal] = useState('');
    const [restrictions, setRestrictions] = useState([]);
    const [result, setResult] = useState(null);
    const [recommendedPlans, setRecommendedPlans] = useState([]);

    const goals = [
        'Weight Loss',
        'Muscle Gain',
        'Healthy Balanced Diet',
        'Keto-friendly',
        'Low Carb',
        'High Protein',
        'Heart Healthy'
    ];

    const commonRestrictions = [
        'Vegan',
        'Vegetarian',
        'Gluten-Free',
        'Dairy-Free',
        'Nut-Free',
        'No Egg',
        'Low Sodium'
    ];

    const toggleRestriction = (r) => {
        if (restrictions.includes(r)) {
            setRestrictions(restrictions.filter(item => item !== r));
        } else {
            setRestrictions([...restrictions, r]);
        }
    };

    const handleGetRecommendations = async () => {
        if (!goal) {
            toast.warn('Please select a health goal first!');
            return;
        }

        setLoading(true);
        setResult(null);
        setRecommendedPlans([]);

        try {
            const data = await apiRequest('/ai/recommend', {
                method: 'POST',
                body: { goal, restrictions },
                token: user?.token
            });

            setResult(data);

            // Now fetch the actual subscription details for the recommended IDs
            if (data.recommendedIds && data.recommendedIds.length > 0) {
                const planDetails = [];
                for (const id of data.recommendedIds) {
                    try {
                        const plan = await apiRequest(`/subscriptions/${id}`);
                        if (plan) planDetails.push(plan);
                    } catch (err) {
                        console.error(`Failed to fetch plan ${id}`, err);
                    }
                }
                setRecommendedPlans(planDetails);
            }
        } catch (e) {
            toast.error('AI Recommendation failed: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <div className="text-center mb-5">
                    <Badge bg="primary-custom" className="mb-2 px-3 py-2 rounded-pill">
                        <FaMagic className="me-2" /> Powered by Gemini AI
                    </Badge>
                    <h1 className="fw-bold display-5">AI Smart Planner</h1>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Tell us your health goals and dietary needs, and our AI will recommend the perfect meal plans for you.
                    </p>
                </div>

                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body className="p-4 p-md-5">
                                <Form>
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-3"><FaUtensils className="me-2 text-primary-custom" /> What is your primary health goal?</h5>
                                        <Row xs={1} md={2} lg={3} className="g-2">
                                            {goals.map((g) => (
                                                <Col key={g}>
                                                    <div
                                                        className={`p-3 rounded border text-center cursor-pointer h-100 d-flex align-items-center justify-content-center transition-all ${goal === g ? 'bg-primary-custom text-white border-primary-custom shadow-sm' : 'bg-white hover-bg-light'}`}
                                                        onClick={() => setGoal(g)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <span className="fw-medium">{g}</span>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-3"><FaExclamationTriangle className="me-2 text-warning" /> Any dietary restrictions?</h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {commonRestrictions.map((r) => (
                                                <Badge
                                                    key={r}
                                                    pill
                                                    bg={restrictions.includes(r) ? 'warning' : 'light'}
                                                    text={restrictions.includes(r) ? 'dark' : 'muted'}
                                                    className={`px-3 py-2 border cursor-pointer transition-all ${restrictions.includes(r) ? 'border-warning' : 'border-secondary'}`}
                                                    onClick={() => toggleRestriction(r)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {r} {restrictions.includes(r) && <FaCheckCircle className="ms-1" />}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-grid mt-5">
                                        <Button
                                            variant="primary-custom"
                                            size="lg"
                                            className="py-3 fw-bold shadow-sm"
                                            onClick={handleGetRecommendations}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                    AI is analyzing plans...
                                                </>
                                            ) : (
                                                <>
                                                    <FaRobot className="me-2" /> Get Personal Recommendations
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        {result && (
                            <div className="mt-5 animate-fade-in">
                                <h3 className="fw-bold mb-4 text-center">AI Analysis</h3>
                                <Alert variant="info" className="border-0 shadow-sm p-4 mb-5">
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <FaRobot size={30} className="text-primary-custom" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold">Here's what I found for you:</h5>
                                            <p className="mb-0 text-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                {result.analysis}
                                            </p>
                                        </div>
                                    </div>
                                </Alert>

                                <h4 className="fw-bold mb-4">Recommended Plans</h4>
                                <Row className="g-4">
                                    {recommendedPlans.map((s) => (
                                        <Col md={6} key={s.id}>
                                            <Card className="h-100 border-0 shadow-sm card-hover overflow-hidden">
                                                <div className="position-relative">
                                                    <Card.Img
                                                        variant="top"
                                                        src={s.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                                        style={{ height: 180, objectFit: 'cover' }}
                                                    />
                                                    <Badge
                                                        bg={s.planType === 'Veg' ? 'success' : s.planType === 'Non-Veg' ? 'danger' : 'warning'}
                                                        className="position-absolute top-0 end-0 m-3"
                                                    >
                                                        {s.planType}
                                                    </Badge>
                                                </div>
                                                <Card.Body className="p-4">
                                                    <Card.Title className="fw-bold">{s.name}</Card.Title>
                                                    <Card.Text className="text-muted small">
                                                        {s.description}
                                                    </Card.Text>
                                                    <Button variant="outline-primary-custom" size="sm" className="w-100 mt-2" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                                                        View This Plan
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                    {recommendedPlans.length === 0 && !loading && (
                                        <Col>
                                            <Alert variant="warning">No specific plans matched perfectly, but try browsing our general menu.</Alert>
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
