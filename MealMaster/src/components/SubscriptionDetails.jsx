import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner, Table, Modal, Carousel, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaUtensils, FaRupeeSign, FaCalendarAlt, FaStore, FaInfoCircle, FaImage, FaShieldAlt } from 'react-icons/fa';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';

export default function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [durationDays, setDurationDays] = useState(7);
  const [purchasing, setPurchasing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [locating, setLocating] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [addressData, setAddressData] = useState({
    addressLine: user?.addressLine || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    latitude: null,
    longitude: null
  });

  const [userPoints, setUserPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(0);
  const [redeeming, setRedeeming] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', foodImageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiRequest(`/subscriptions/${id}`);
        if (!cancelled) setSubscription(data);
      } catch (e) {
        if (!cancelled) toast.error(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    async function fetchReviews() {
      try {
        const data = await apiRequest(`/reviews/subscription/${id}`);
        if (!cancelled) setReviews(data);
      } catch (e) {
        console.error('Failed to fetch reviews', e);
      }
    }
    load();
    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const price = useMemo(() => {
    if (!subscription) return 0;
    let basePrice = 0;
    if (durationDays === 7) basePrice = subscription.price7;
    else if (durationDays === 15) basePrice = subscription.price15;
    else basePrice = subscription.price30;

    return basePrice - discountApplied;
  }, [subscription, durationDays, discountApplied]);

  async function handlePurchase() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'User') {
      toast.error('Only customers can purchase subscriptions');
      return;
    }

    setShowSummary(true);
    setDiscountApplied(0);
    setPointsToRedeem(0);

    // Fetch user points
    try {
      const streakData = await apiRequest(`/gamification/status/${user.userId}`);
      setUserPoints(streakData.totalPoints || 0);
    } catch (error) {
      console.error("Failed to fetch points", error);
    }

    // Get current location
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log('Detected coords:', lat, lng);
          setAddressData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));
          setLocating(false);
          toast.success('Current location detected!');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocating(false);
          toast.warning('Could not detect exact location. Please ensure location services are enabled.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.warning('Geolocation is not supported by this browser.');
    }
  }

  async function handleRedeemPoints() {
    if (pointsToRedeem <= 0) return;
    if (pointsToRedeem > userPoints) {
      toast.error("You don't have enough points!");
      return;
    }

    setRedeeming(true);
    try {
      const result = await apiRequest(`/gamification/redeem/${user.userId}`, {
        method: 'POST',
        body: { points: pointsToRedeem }
      });
      setDiscountApplied(result.discountAmount);
      setUserPoints(result.remainingPoints);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRedeeming(false);
    }
  }

  async function confirmPurchase() {
    setPurchasing(true);
    try {
      const orderPayload = { subscriptionId: subscription.id, durationDays, startDate, ...addressData };
      console.log('Sending order payload:', orderPayload);

      // Create order
      const order = await apiRequest('/orders', {
        method: 'POST',
        token: user.token,
        body: orderPayload
      });

      // Create Razorpay payment (This will return a mock order ID from our backend)
      const paymentData = await apiRequest(`/orders/${order.id}/create-payment`, {
        method: 'POST',
        token: user.token
      });

      // Try loading script with error handling
      let scriptLoaded = true;
      if (!window.Razorpay) {
        try {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => {
              scriptLoaded = false;
              reject(new Error('Script load failed'));
            };
          });
        } catch (err) {
          scriptLoaded = false;
          console.warn('Razorpay script failed to load, falling back to demo mode');
        }
      }

      const handleVerification = async (paymentId, razorpayOrderId, signature = 'mock_sig') => {
        try {
          // Verify payment (Backend is mocked to always return success)
          await apiRequest(`/orders/${order.id}/verify-payment`, {
            method: 'POST',
            token: user.token,
            body: {
              razorpayPaymentId: paymentId,
              razorpayOrderId: razorpayOrderId,
              razorpaySignature: signature
            }
          });

          // Download receipt as PDF
          const blob = await apiRequest(`/orders/${order.id}/receipt`, {
            method: 'GET',
            token: user.token,
            responseType: 'blob'
          });

          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `receipt_${order.id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast.success('Payment successful! Receipt downloaded.');
          setShowSummary(false);
          navigate('/user/dashboard');
        } catch (e) {
          toast.error('Payment verification failed: ' + e.message);
        }
      };

      if (scriptLoaded && window.Razorpay) {
        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: 'MealMaster',
          description: `${subscription.name} - ${durationDays} days`,
          order_id: paymentData.orderId,
          handler: (response) => handleVerification(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          ),
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.mobile
          },
          theme: { color: '#2563eb' },
          modal: { ondismiss: () => toast.info('Payment cancelled') }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for Demo Mode
        toast.info('Razorpay script not available. Processing in Demo Mode...');
        setTimeout(() => {
          handleVerification('pay_demo_' + Date.now(), paymentData.orderId);
        }, 1500);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPurchasing(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setReviewLoading(true);
    try {
      let imageUrl = '';

      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/api$/, '');
        const uploadUrl = `${baseUrl}/api/uploads`;
        console.log('Uploading image to:', uploadUrl);

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Image upload failed: ${response.status} ${errorText}`);
        }
        const uploadData = await response.json();
        imageUrl = baseUrl + uploadData.url;
        setUploading(false);
      }

      const reviewData = {
        ...newReview,
        foodImageUrl: imageUrl,
        subscriptionId: Number(id)
      };
      await apiRequest('/reviews', {
        method: 'POST',
        token: user.token,
        body: reviewData
      });
      toast.success('Review submitted successfully');
      setNewReview({ rating: 5, comment: '', foodImageUrl: '' });
      setSelectedFile(null);
      const fileInput = document.getElementById('review-image-upload');
      if (fileInput) fileInput.value = '';

      const data = await apiRequest(`/reviews/subscription/${id}`);
      setReviews(data);
    } catch (e) {
      toast.error('Failed to submit review: ' + e.message);
    } finally {
      setReviewLoading(false);
      setUploading(false);
    }
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }) => {
    return (
      <div className="d-inline-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRatingChange(star)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: '1.25rem',
              color: star <= rating ? '#ffc107' : '#e4e5e9',
              marginRight: '4px',
              transition: 'color 0.2s'
            }}
          >
            <FaStar />
          </span>
        ))}
      </div>
    );
  };

  const calculateEndDate = (start, duration) => {
    const d = new Date(start);
    d.setDate(d.getDate() + duration);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formattedEndDate = calculateEndDate(startDate, durationDays);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!subscription) {
    return (
      <Container className="py-5 text-center">
        <div className="py-5">
          <FaUtensils className="text-muted mb-3" size={48} />
          <h3 className="text-muted">Subscription not found</h3>
          <Button variant="outline-primary-custom" className="mt-3 rounded-pill px-4" onClick={() => navigate('/subscriptions')}>
            Browse Subscriptions
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Hero Header */}
      <div className="bg-white shadow-sm mb-4">
        <Container className="py-4">
          <Button
            variant="link"
            className="text-decoration-none text-muted p-0 mb-3 d-flex align-items-center hover-primary"
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft className="me-1" /> Back to Browse
          </Button>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="fw-bold mb-2 text-dark">{subscription.name}</h1>
              <div className="d-flex flex-wrap gap-3 text-muted mb-3">
                <span className="d-flex align-items-center"><FaMapMarkerAlt className="me-1 text-primary-custom" /> {subscription.city}</span>
                <span className="d-flex align-items-center"><FaUtensils className="me-1 text-primary-custom" /> {subscription.planType}</span>
                <span className="d-flex align-items-center"><FaStore className="me-1 text-primary-custom" /> ID: {subscription.vendorId}</span>
              </div>
            </Col>
            <Col lg={4} className="text-lg-end">
              <div className="h2 text-primary-custom fw-bold mb-0">
                ₹{subscription.price7}<span className="fs-6 text-muted fw-normal"> / week</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row className="g-4">
          {/* Left Column: Details & Reviews */}
          <Col lg={8}>
            {/* Main Info Card */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden rounded-4">
              {subscription.imageUrl && (
                <div style={{ height: '350px', overflow: 'hidden' }}>
                  <img
                    src={subscription.imageUrl}
                    alt={subscription.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              )}
              <Card.Body className="p-4 p-lg-5">
                <h4 className="fw-bold mb-4 d-flex align-items-center">
                  <div className="bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle p-2 me-3">
                    <FaInfoCircle size={20} />
                  </div>
                  About this Plan
                </h4>
                <p className="text-muted lead fs-6 mb-5">{subscription.description}</p>

                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <div className="bg-primary-custom bg-opacity-10 text-primary-custom rounded-circle p-2 me-3">
                    <FaUtensils size={20} />
                  </div>
                  Weekly Menu
                </h5>
                <div className="table-responsive rounded-3 border">
                  <Table hover className="align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4" style={{ width: '30%' }}>Day</th>
                        <th className="py-3">Meal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'].map((dayKey, index) => (
                        <tr key={dayKey}>
                          <td className="fw-semibold text-secondary ps-4">Day {index + 1}</td>
                          <td className="text-dark">{subscription[dayKey]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Reviews Section */}
            <Card className="border-0 shadow-sm mb-4 rounded-4">
              <Card.Body className="p-4 p-lg-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">Customer Reviews</h4>
                  <Badge bg="primary-custom" pill className="px-3 py-2">{reviews.length} Reviews</Badge>
                </div>

                {user && user.role === 'User' && (
                  <Card className="bg-light border-0 mb-5 rounded-4">
                    <Card.Body className="p-4">
                      <h6 className="fw-bold mb-3">Write a Review</h6>
                      <Form onSubmit={handleReviewSubmit}>
                        <Row className="g-3">
                          <Col md={12}>
                            <div className="mb-2 text-muted small fw-bold text-uppercase">Rating</div>
                            <StarRating
                              rating={newReview.rating}
                              interactive
                              onRatingChange={(r) => setNewReview({ ...newReview, rating: r })}
                            />
                          </Col>
                          <Col md={12}>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Share your experience..."
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="border-0 shadow-sm p-3 rounded-3"
                            />
                          </Col>
                          <Col md={12}>
                            <div className="d-flex gap-2 align-items-center">
                              <div className="flex-grow-1">
                                <InputGroup>
                                  <Form.Control
                                    id="review-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="border-0 shadow-sm rounded-start-pill"
                                  />
                                </InputGroup>
                              </div>
                              <Button variant="primary-custom" type="submit" disabled={reviewLoading} className="px-4 py-2 rounded-pill fw-bold shadow-sm">
                                {uploading ? 'Uploading...' : reviewLoading ? 'Submitting...' : 'Post Review'}
                              </Button>
                            </div>
                            {selectedFile && <div className="small text-muted mt-2 ps-2"><FaImage className="me-1" /> {selectedFile.name}</div>}
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Card>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-5 text-muted bg-light rounded-4">
                    <FaStar className="mb-3 opacity-25" size={48} />
                    <p className="mb-0">No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="review-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-bottom py-4 last-child-no-border">
                        <Row>
                          <Col xs={review.foodImageUrl ? 9 : 12}>
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <span className="fw-bold text-secondary">{review.user?.name?.charAt(0) || 'A'}</span>
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{review.user?.name || 'Anonymous'}</div>
                                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                              </div>
                            </div>
                            <div className="mb-3 ps-5">
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="mb-0 text-secondary ps-5">{review.comment}</p>
                          </Col>
                          {review.foodImageUrl && (
                            <Col xs={3}>
                              <img
                                src={review.foodImageUrl}
                                alt="Review"
                                className="img-fluid rounded-3 shadow-sm object-fit-cover"
                                style={{ height: '100px', width: '100%' }}
                              />
                            </Col>
                          )}
                        </Row>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Sticky Pricing Card */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="bg-primary-custom p-4 text-white text-center">
                  <h5 className="mb-0 fw-bold">Select Your Plan</h5>
                </div>
                <Card.Body className="p-4">
                  <Form>
                    {[
                      { days: 7, label: 'Weekly Plan', price: subscription.price7, icon: '📅' },
                      { days: 15, label: '15 Days Plan', price: subscription.price15, icon: '🗓️' },
                      { days: 30, label: 'Monthly Plan', price: subscription.price30, icon: '📆' }
                    ].map((plan) => (
                      <div
                        key={plan.days}
                        className={`d-flex align-items-center justify-content-between p-3 border rounded-3 mb-3 cursor-pointer transition-all ${durationDays === plan.days ? 'border-primary-custom bg-primary-custom bg-opacity-10 ring-2 ring-primary-custom' : 'hover-bg-light'}`}
                        onClick={() => setDurationDays(plan.days)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        <Form.Check
                          type="radio"
                          name="duration"
                          id={`plan-${plan.days}`}
                          checked={durationDays === plan.days}
                          onChange={() => setDurationDays(plan.days)}
                          className="me-2"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold text-dark">{plan.label}</div>
                          <div className="small text-muted">{plan.days} Days</div>
                        </div>
                        <div className="fw-bold text-primary-custom">₹{plan.price}</div>
                      </div>
                    ))}
                  </Form>

                  <div className="d-flex justify-content-between align-items-center mt-4 mb-2 pt-3 border-top">
                    <span className="text-muted">Total Amount</span>
                    <span className="h3 fw-bold text-dark mb-0">₹{price}</span>
                  </div>

                  <div className="text-end mb-4">
                    <small className="text-muted">Inclusive of all taxes</small>
                  </div>

                  <Button
                    variant="primary-custom"
                    size="lg"
                    className="w-100 rounded-pill fw-bold py-3 shadow-sm mb-3"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? <Spinner size="sm" /> : 'Subscribe Now'}
                  </Button>

                  <div className="text-center">
                    <small className="text-muted d-flex align-items-center justify-content-center">
                      <FaShieldAlt className="me-1" /> Secure Payment via Razorpay
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Purchase Summary Modal */}
      <Modal show={showSummary} onHide={() => setShowSummary(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Confirm Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 pt-2">
          <p className="text-muted mb-4">Please review your order details before proceeding to payment.</p>

          <Row className="g-4">
            <Col md={6}>
              <Card className="bg-light border-0 h-100 rounded-4">
                <Card.Body>
                  <h6 className="fw-bold mb-3 text-uppercase text-muted small">Plan Details</h6>
                  <h5 className="fw-bold text-primary-custom mb-1">{subscription.name}</h5>
                  <p className="text-muted mb-3">{durationDays} Days Plan</p>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Start Date:</span>
                    <span className="fw-semibold">{new Date(startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>End Date:</span>
                    <span className="fw-semibold">{formattedEndDate}</span>
                  </div>

                  {discountApplied > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success fw-bold">
                      <span>Points Discount:</span>
                      <span>-₹{discountApplied}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-3 pt-3 border-top border-secondary border-opacity-10">
                    <span className="h5 mb-0">Total Pay</span>
                    <span className="h5 fw-bold text-primary-custom mb-0">₹{price}</span>
                  </div>

                  {userPoints > 0 && discountApplied === 0 && (
                    <div className="mt-4 p-3 bg-white rounded-3 shadow-sm border border-warning border-opacity-25">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="bg-warning bg-opacity-10 p-1 rounded">💰</div>
                        <div className="small fw-bold text-dark">Redeem Meal Points (10pts = ₹1)</div>
                      </div>
                      <div className="small text-muted mb-2">You have <b>{userPoints}</b> points available.</div>
                      <InputGroup size="sm">
                        <Form.Control
                          type="number"
                          placeholder="Points"
                          value={pointsToRedeem}
                          max={userPoints}
                          onChange={(e) => setPointsToRedeem(Math.min(userPoints, parseInt(e.target.value) || 0))}
                          className="rounded-start-pill border-warning"
                        />
                        <Button
                          variant="warning"
                          className="rounded-end-pill px-3 fw-bold text-white"
                          onClick={handleRedeemPoints}
                          disabled={redeeming || pointsToRedeem <= 0}
                        >
                          {redeeming ? <Spinner size="sm" /> : 'Apply'}
                        </Button>
                      </InputGroup>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <h6 className="fw-bold mb-3 text-uppercase text-muted small">Delivery Details</h6>

              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  type="text"
                  name="addressLine"
                  placeholder="House/Flat No, Street"
                  value={addressData.addressLine}
                  onChange={handleAddressChange}
                  className="mb-2 rounded-3 shadow-sm"
                />
                <Row className="g-2">
                  <Col xs={6}>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="City"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      className="rounded-3 shadow-sm"
                    />
                  </Col>
                  <Col xs={6}>
                    <Form.Control
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      className="rounded-3 shadow-sm"
                    />
                  </Col>
                </Row>
              </Form.Group>

              {locating && <div className="text-info small mb-2"><Spinner size="sm" className="me-1" /> Detecting location...</div>}
              {addressData.latitude && <div className="text-success small mb-2"><FaMapMarkerAlt /> Location coordinates captured</div>}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <Button variant="light" onClick={() => setShowSummary(false)} className="rounded-pill px-4">
            Cancel
          </Button>
          <Button variant="primary-custom" onClick={confirmPurchase} disabled={purchasing} className="rounded-pill px-4 fw-bold shadow-sm">
            {purchasing ? <Spinner size="sm" className="me-2" /> : <FaRupeeSign className="me-1" />}
            Pay ₹{price}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
