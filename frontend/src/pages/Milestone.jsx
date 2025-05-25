import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import './Habits.css'; // Reuse existing styles

function Milestones() {
    const { getToken, isSignedIn } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMilestones = async () => {
            if (!isSignedIn) return;

            const token = await getToken();

            try {
                const response = await axios.get("http://localhost:4000/api/milestones", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMilestones(response.data);
            } catch (error) {
                console.error("Napaka pri pridobivanju mejnikov:", error);
                setError("Napaka pri pridobivanju mejnikov. Poskusite znova.");
            }
        };

        fetchMilestones();
    }, [isSignedIn]);

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2>Mejniki</h2>
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