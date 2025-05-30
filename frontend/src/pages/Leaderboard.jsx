import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { queueRequest, syncRequests } from "./../offlineSync.js";
import './leaderboard.css';

function Leaderboard() {
  const { getToken } = useAuth();
  const [leaders, setLeaders] = useState([]);
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

  const fetchData = async () => {
    const token = await getToken();
    try {
      if (isOnline) {
        const res = await axios.get('http://localhost:4000/api/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaders(res.data);
      } else {
        await queueRequest({
          method: 'GET',
          url: 'http://localhost:4000/api/leaderboard',
          headers: { Authorization: `Bearer ${token}` },
        });
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('sync-habits');
          });
        }
      }
    } catch (err) {
      console.error("Napaka pri pridobivanju leaderboarda:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOnline]);

  return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Uporabnik</th>
            <th>Email</th>
            <th>Točke</th>
          </tr>
          </thead>
          <tbody>
          {leaders.map((user, index) => (
              <tr key={index}>
                <td className="leaderboard-rank">{index + 1}</td>
                <td>{user.name || 'Neznano ime'}</td>
                <td>{user.email}</td>
                <td>{user.totalHabits}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}

export default Leaderboard;