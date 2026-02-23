import { useState, useEffect } from 'react';
import { apiRequest } from '../api/http';
import { useAuth } from '../auth/useAuth';
import { FaFire, FaCoins } from 'react-icons/fa';
import { Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function StreakCounter() {
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStatus = async () => {
        if (!user?.userId) return;
        try {
            const data = await apiRequest(`/gamification/status/${user.userId}`);
            setStatus(data);
        } catch (error) {
            console.error("Failed to fetch streak status", error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [user?.userId]);

    const handleLogMeal = async () => {
        if (!user?.userId) return;
        setLoading(true);
        try {
            const data = await apiRequest(`/gamification/log-meal/${user.userId}`, {
                method: 'POST'
            });
            setStatus(data);
            toast.success(data.message, {
                icon: "🔥",
                theme: "colored"
            });
        } catch (error) {
            toast.error("Failed to log meal: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'User') return null;

    return (
        <div className="d-flex align-items-center gap-2">
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Current Daily Meal Streak! Log every day to earn rewards.</Tooltip>}
            >
                <Badge
                    bg="light"
                    text="dark"
                    className="d-flex align-items-center gap-1 border border-warning p-2 rounded-pill cursor-pointer"
                    onClick={handleLogMeal}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FaFire className={status?.currentStreak > 0 ? "text-danger animate-pulse" : "text-muted"} />
                    <span className="fw-bold">{status?.currentStreak || 0} Days</span>
                </Badge>
            </OverlayTrigger>

            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Total Meal Points earned! Redeem for future discounts.</Tooltip>}
            >
                <Badge
                    bg="light"
                    text="dark"
                    className="d-flex align-items-center gap-1 border border-info p-2 rounded-pill"
                >
                    <FaCoins className="text-warning" />
                    <span className="fw-bold">{status?.totalPoints || 0} pts</span>
                </Badge>
            </OverlayTrigger>

            {status?.eligibleForDiscount && (
                <Badge bg="success" className="animate-bounce">
                    5% OFF UNLOCKED!
                </Badge>
            )}
        </div>
    );
}
