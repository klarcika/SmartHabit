import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import './Habits.css'; // Reuse existing styles

function Achievements() {
    const { getToken, isSignedIn } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!isSignedIn) return;

            const token = await getToken();

            try {
                const response = await axios.get("http://localhost:4000/api/achievements", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAchievements(response.data);
            } catch (error) {
                console.error("Napaka pri pridobivanju dosežkov:", error);
                setError("Napaka pri pridobivanju dosežkov. Poskusite znova.");
            }
        };

        fetchAchievements();
    }, [isSignedIn]);

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2>Dosežki</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {achievements.length === 0 ? (
                    <p>Ni dosežkov za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {achievements.map((achievement) => (
                            <div key={achievement._id} className="habit-card">
                                <div className="habit-card-content">
                                    <p><strong>Navada:</strong> {achievement.habit}</p>
                                    <p><strong>Datum:</strong> {new Date(achievement.date).toLocaleString('sl-SI')}</p>
                                    <p><strong>Vrednost:</strong> {achievement.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Achievements;