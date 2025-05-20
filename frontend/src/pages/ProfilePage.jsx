import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

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
    <div>
      <h2>Profilna stran</h2>

      <p>Podatki iz Clerk-a: {user?.firstName} {user?.lastName}</p>

    </div>
  );
}

export default ProfilePage;