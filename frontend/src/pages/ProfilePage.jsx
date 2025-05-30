import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { FaUser, FaDatabase } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { queueRequest, syncRequests } from "./../offlineSync.js";
import './ProfilePage.css';

function ProfilePage() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitDateMap, setHabitDateMap] = useState({});
  const [habitColorMap, setHabitColorMap] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncRequests(getToken);
      fetchUser();
      fetchHabits();
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
    fetchUser();
    fetchHabits();
  }, [isSignedIn, isOnline]);

  const fetchUser = async () => {
    if (!isSignedIn) return;
    const token = await getToken();

    try {
      if (isOnline) {
        const response = await axios.get("http://localhost:4000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } else {
        await queueRequest({
          method: 'GET',
          url: "http://localhost:4000/api/users/",
          headers: { Authorization: `Bearer ${token}` },
        });
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-habits');
          });
        }
      }
    } catch (error) {
      console.error("Napaka pri pridobivanju uporabnika:", error);
    }
  };

  const fetchHabits = async () => {
    if (!isSignedIn) return;
    const token = await getToken();

    try {
      if (isOnline) {
        const response = await axios.get("http://localhost:4000/api/habits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const habits = response.data;
        setHabits(habits);

        const newDateMap = {};
        const newColorMap = {};
        const colorPalette = ['#f94144', '#f3722c', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

        habits.forEach((habit, index) => {
          const color = colorPalette[index % colorPalette.length];
          newColorMap[habit.name] = color;

          generateHabitDates(habit).forEach(date => {
            const key = date.toDateString();
            if (!newDateMap[key]) newDateMap[key] = [];
            newDateMap[key].push(habit.name);
          });
        });

        setHabitDateMap(newDateMap);
        setHabitColorMap(newColorMap);
      } else {
        await queueRequest({
          method: 'GET',
          url: "http://localhost:4000/api/habits",
          headers: { Authorization: `Bearer ${token}` },
        });
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-habits');
          });
        }
      }
    } catch (error) {
      console.error("Napaka pri pridobivanju navad:", error);
    }
  };

  const generateHabitDates = (habit) => {
    const dates = [];
    const today = new Date();
    const end = new Date();
    end.setMonth(today.getMonth() + 1);

    for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      if (habit.frequency === 'daily') {
        dates.push(new Date(current));
      } else if (habit.frequency === 'weekly' && current.getDay() === 1) {
        dates.push(new Date(current));
      } else if (habit.frequency === 'monthly' && current.getDate() === 1) {
        dates.push(new Date(current));
      }
    }

    return dates;
  };

  return (
      <div className="page-wrapper">
        <div className="profile-container">
          {user?.imageUrl && (
              <img src={user.imageUrl} alt="Profilna slika" className="avatar" />
          )}

          <h2><FaUser className="icon" /> Profilna stran {isOnline ? '' : '(Offline)'}</h2>
          <p><strong>Ime:</strong> {user?.firstName} {user?.lastName}</p>

          {userData && (
              <div className="api-data">
                <h3><FaDatabase className="icon" /> Podatki iz API-ja</h3>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Uporabniško ime:</strong> {userData.name}</p>
                <p><strong>Ustvarjeno:</strong> {new Date(userData.createdAt).toLocaleString('sl-SI')}</p>
              </div>
          )}

          <div className="calendar-section">
            <h3>Koledar navad</h3>
            <Calendar
                tileContent={({ date }) => {
                  const key = date.toDateString();
                  return habitDateMap[key]?.map((habit, idx) => (
                      <div
                          key={idx}
                          style={{
                            backgroundColor: habitColorMap[habit],
                            color: 'white',
                            fontSize: '0.6rem',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            margin: '1px 0',
                            textAlign: 'center',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                      >
                        {habit}
                      </div>
                  ));
                }}
            />
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;