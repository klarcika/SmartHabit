import { useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from '@clerk/clerk-react';
import axios from "axios";

function HomePage() {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) return;

      const token = await getToken();
      console.log("TOKEN:", token);

      try {
        const response = await axios.get("http://localhost:4000/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        console.log("Uporabnik iz backenda:", response.data);
      } catch (error) {
        console.error("Napaka pri pridobivanju uporabnika:", error);
      }
    };

    fetchUser();
  }, [isSignedIn]);

  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        <p>Pozdravljen/a {user?.firstName}!</p>
      </SignedIn>
    </div>
  );
}

export default HomePage;
