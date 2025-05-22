import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { FaUser, FaDatabase } from 'react-icons/fa';
import './ProfilePage.css';

function ProfilePage() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) return;

      const token = await getToken();

      try {
        const response = await axios.get("http://localhost:4000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Napaka pri pridobivanju uporabnika:", error);
      }
    };

    fetchUser();
  }, [isSignedIn]);

  return (
    <div className="page-wrapper">
      <div className="profile-container">
        {user?.imageUrl && (
          <img src={user.imageUrl} alt="Profilna slika" className="avatar" />
        )}

        <h2><FaUser className="icon"/> Profilna stran</h2>

        <p><strong>Ime:</strong> {user?.firstName} {user?.lastName}</p>

      {userData && (
  <div className="api-data">
    <h3><FaDatabase className="icon" /> Podatki iz API-ja</h3>
    <p><strong>ID:</strong> {userData._id}</p>
    <p><strong>Clerk ID:</strong> {userData.clerkId}</p>
    <p><strong>Email:</strong> {userData.email}</p>
    <p><strong>Ime:</strong> {userData.name}</p>
    <p><strong>Ustvarjeno:</strong> {new Date(userData.createdAt).toLocaleString('sl-SI')}</p>
  </div>
)}
      </div>
    </div>
  );
}

export default ProfilePage;
