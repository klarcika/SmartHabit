import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { queueRequest, syncRequests } from "./../offlineSync.js";
import './Habits.css'; // Reuse existing styles

function Milestones() {
    const { getToken, isSignedIn } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = async () => {
            setIsOnline(true);
            await syncRequests(getToken);
            fetchMilestones();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchMilestones = async () => {
        if (!isSignedIn) return;

        const token = await getToken();

        try {
            if (isOnline) {
                const response = await axios.get("http://localhost:4000/api/milestones", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMilestones(response.data);
            } else {
                await queueRequest({
                    method: 'GET',
                    url: "http://localhost:4000/api/milestones",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.sync.register('sync-habits');
                    });
                }
            }
        } catch (error) {
            console.error("Napaka pri pridobivanju mejnikov:", error);
            setError("Napaka pri pridobivanju mejnikov. Poskusite znova.");
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, [isSignedIn, isOnline]);

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2>Mejniki {isOnline ? '' : '(Offline)'}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {milestones.length === 0 ? (
                    <p>Ni mejnikov za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {milestones.map((milestone) => (
                            <div key={milestone._id} className="habit-card">
                                <div className="habit-card-content">
                                    <p><strong>Uporabnik:</strong> {milestone.user}</p>
                                    <p><strong>Navada:</strong> {milestone.habit}</p>
                                    <p><strong>Tip:</strong> {milestone.type}</p>
                                    <p><strong>Datum:</strong> {new Date(milestone.createdAt).toLocaleString('sl-SI')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Milestones;