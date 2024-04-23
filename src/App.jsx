import { useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signOut,
} from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const gooogleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  const handleAuthProvider = (provider) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setUser(result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <h1>Providers firebase</h1>
      <button onClick={() => handleAuthProvider(gooogleProvider)}>
        Google
      </button>
      <button onClick={() => handleAuthProvider(facebookProvider)}>
        Facebook
      </button>
      <button onClick={() => handleAuthProvider(twitterProvider)}>
        Twitter
      </button> 
      {user && (
        <>
          <button onClick={logout}>Logout</button>
          <p>{user.displayName}</p>
          <p>{user.email}</p>
          <img src={user.photoURL} alt={user.displayName} />
        </>
      )}
      {error && <p>{error}</p>}
    </>
  );
}
