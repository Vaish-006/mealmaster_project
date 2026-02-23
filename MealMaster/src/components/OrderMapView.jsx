import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, Alert } from 'react-bootstrap';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
};

export default function OrderMapView({ order }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default: India center

    useEffect(() => {
        if (order?.latitude != null && order?.longitude != null) {
            const lat = parseFloat(order.latitude);
            const lng = parseFloat(order.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setMapCenter({ lat, lng });
            }
        }
    }, [order]);

    const GOOGLE_MAPS_API_KEY = 'AIzaSyDGugrOB4YOSYmEQcACClwSUqk5oisP_9M';

    if (!order) {
        return <Alert variant="info">No order data available</Alert>;
    }

    const hasCoords = order.latitude != null && order.longitude != null;

    if (!hasCoords) {
        return (
            <Card className="p-3 mb-3">
                <Alert variant="warning" className="mb-0">
                    <strong>Location not available</strong>
                    <div className="mt-2 small">
                        This order was placed without location data.
                        Delivery address: {order.address ?
                            `${order.address.addressLine}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
                            : 'Not provided'}
                    </div>
                </Alert>
            </Card>
        );
    }

    return (
        <Card className="mb-3">
            <Card.Body>
                <h6 className="mb-3">Delivery Location</h6>

                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter}
                        zoom={15}
                    >
                        <Marker
                            position={{ lat: order.latitude, lng: order.longitude }}
                            onClick={() => setSelectedOrder(order)}
                        />

                        {selectedOrder && (
                            <InfoWindow
                                position={{ lat: order.latitude, lng: order.longitude }}
                                onCloseClick={() => setSelectedOrder(null)}
                            >
                                <div style={{ maxWidth: '200px' }}>
                                    <h6 className="mb-2">Order #{order.id}</h6>
                                    <div className="small">
                                        <div><strong>Address:</strong></div>
                                        <div>{order.address?.addressLine}</div>
                                        <div>{order.address?.city}, {order.address?.state}</div>
                                        <div>{order.address?.pincode}</div>
                                        <div className="mt-2">
                                            <strong>Status:</strong> <span className="badge bg-primary">{order.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </LoadScript>

                <div className="mt-3 small text-muted">
                    <div><strong>Coordinates:</strong> {order.latitude.toFixed(6)}, {order.longitude.toFixed(6)}</div>
                    <div className="mt-1">
                        <a
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                        >
                            Open in Google Maps →
                        </a>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
