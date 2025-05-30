import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import './Habits.css';
import './Achivement.css';
import { FaAward } from 'react-icons/fa';

function Achievements() {
    const { getToken, isSignedIn } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [habits, setHabits] = useState([]);
    const [progressByHabit, setProgressByHabit] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isSignedIn) return;
        fetchData();
    }, [isSignedIn]);

    const fetchData = async () => {
        const token = await getToken();

        try {
            const habitsResponse = await axios.get("http://localhost:4000/api/habits", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHabits(habitsResponse.data);

            const achievementsResponse = await axios.get("http://localhost:4000/api/achievements", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAchievements(achievementsResponse.data);

            const today = new Date().toISOString().split('T')[0];
            const progressMap = {};
            achievementsResponse.data.forEach(a => {
                const date = new Date(a.date).toISOString().split('T')[0];
                if (date === today) {
                    progressMap[a.habit._id] = a._id;
                }
            });
            setProgressByHabit(progressMap);
        } catch (error) {
            console.error("Napaka pri nalaganju podatkov:", error);
            setError("Napaka pri pridobivanju podatkov.");
        }
    };

    const handleAddProgress = async (habitId) => {
        const token = await getToken();
        try {
            const response = await axios.post("http://localhost:4000/api/achievements", {
                habit: habitId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchData();
        } catch (error) {
            console.error("Napaka pri dodajanju napredka:", error);
        }
    };

    const handleRemoveProgress = async (achievementId) => {
        const token = await getToken();
        try {
            await axios.delete(`http://localhost:4000/api/achievements/${achievementId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchData();
        } catch (error) {
            console.error("Napaka pri odstranjevanju napredka:", error);
        }
    };

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2><FaAward className="icon" /> Moji napredki</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {habits.length === 0 ? (
                    <p>Ni navad za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {habits.map(habit => (
                            <div key={habit._id} className="habit-card">
                                <div className="habit-card-content">
                                    <h3>{habit.name}</h3>
                                    <p><strong>Napredek:</strong> {habit.points} / {habit.goal}</p>

                                </div>
                                <div className="habit-card-buttons">
                                    {progressByHabit[habit._id] ? (
                                        <>
                                            <button className="delete-button" onClick={() => handleRemoveProgress(progressByHabit[habit._id])}>Odstrani napredek</button>
                                            <button className="disabled-button" disabled>Doseženo danes</button>
                                        </>
                                    ) : (
                                        <button className="add-button" onClick={() => handleAddProgress(habit._id)}>Beleži napredek</button>
                                    )}
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
