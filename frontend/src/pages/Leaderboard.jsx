import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import './leaderboard.css';

function LeaderboardMilestone() {
  const { getToken } = useAuth();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      try {
        const res = await axios.get('http://localhost:4000/api/leaderboard/milestone', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLeaders(res.data);
      } catch (err) {
        console.error("Napaka pri pridobivanju leaderboarda:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Lestvica najboljših</h2>
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
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardMilestone;
