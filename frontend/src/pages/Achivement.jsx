import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { queueRequest, syncRequests } from './../offlineSync';
import './Habits.css';
import './Achivement.css';
import { FaAward } from 'react-icons/fa';

const API = (import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : '/api'; 
// dev: http://localhost:4000   |   prod (Vercel): /api

function Achievements() {
  const { getToken, isSignedIn } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [habits, setHabits] = useState([]);
  const [progressByHabit, setProgressByHabit] = useState({});
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncRequests(getToken);
      fetchData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchData();
  }, [isSignedIn]);

  const fetchData = async () => {
    if (!isOnline) {
      setError('Aplikacija je offline. Podatki morda niso posodobljeni.');
      return;
    }
    const token = await getToken();
    try {
      const habitsResponse = await axios.get(`${API}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(habitsResponse.data);

      const achievementsResponse = await axios.get(`${API}/api/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAchievements(achievementsResponse.data);

      const today = new Date().toISOString().split('T')[0];
      const progressMap = {};
      achievementsResponse.data.forEach(a => {
        const date = new Date(a.date).toISOString().split('T')[0];
        if (date === today) progressMap[a.habit._id] = a._id;
      });
      setProgressByHabit(progressMap);
    } catch (error) {
      console.error('Napaka pri pridobivanju podatkov:', error);
      setError('Napaka pri pridobivanju podatkov.');
    }
  };

  const handleAddProgress = async (habitId) => {
    const token = await getToken();
    const url = `${API}/api/achievements`;
    const newAchievementData = { habit: habitId };

    try {
      if (isOnline) {
        await axios.post(url, newAchievementData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchData();
      } else {
        await queueRequest({ method: 'POST', url, body: newAchievementData });

        const tempAchievement = {
          _id: Date.now().toString(),
          habit: habits.find(h => h._id === habitId),
          date: new Date(),
        };
        setAchievements([...achievements, tempAchievement]);
        setProgressByHabit(prev => ({ ...prev, [habitId]: tempAchievement._id }));

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-habits');
          });
        }
      }
    } catch (error) {
      console.error('Napaka pri dodajanju napredka:', error);
      setError('Napaka pri dodajanju napredka.');
    }
  };

  const handleRemoveProgress = async (achievementId) => {
    const token = await getToken();
    const url = `${API}/api/achievements/${achievementId}`;

    try {
      if (isOnline) {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        await fetchData();
      } else {
        await queueRequest({ method: 'DELETE', url });

        const achievementToRemove = achievements.find(a => a._id === achievementId);
        if (achievementToRemove) {
          setAchievements(achievements.filter(a => a._id !== achievementId));
          setProgressByHabit(prev => {
            const np = { ...prev };
            delete np[achievementToRemove.habit._id];
            return np;
          });
        }

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-habits');
          });
        }
      }
    } catch (error) {
      console.error('Napaka pri odstranjevanju napredka:', error);
      setError('Napaka pri odstranjevanju napredka.');
    }
  };

  return (
    <div className="habit-page-wrapper">
      <div className="habit-container">
        <h2><FaAward className="icon" /> Moji napredki {isOnline ? '' : '(Offline)'}</h2>
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
