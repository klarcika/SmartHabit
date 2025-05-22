import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { FaListAlt } from 'react-icons/fa';
import './Habits.css';


function Habit() {
    const { getToken, isSignedIn } = useAuth();
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            if (!isSignedIn) return;

            const token = await getToken();

            try {
                const response = await axios.get("http://localhost:4000/api/habits", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHabits(response.data);
            } catch (error) {
                console.error("Napaka pri pridobivanju navad:", error);
            }
        };

        fetchHabits();
    }, [isSignedIn]);

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2><FaListAlt className="icon" /> Moje navade</h2>
                {habits.length === 0 ? (
                    <p>Ni navad za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {habits.map((habit) => (
                            <div key={habit._id} className="habit-card">
                                <h3>{habit.name}</h3>
                                <p><strong>Kategorija:</strong> {habit.category}</p>
                                <p><strong>Frekvenca:</strong> {habit.frequency}</p>
                                <p><strong>Cilj:</strong> {habit.goal}</p>
                                <p><strong>Aktivno:</strong> {habit.active ? "Da" : "Ne"}</p>
                                <p><strong>Ustvarjeno:</strong> {new Date(habit.createdAt).toLocaleString('sl-SI')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Habit;