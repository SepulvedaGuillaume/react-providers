import { useState } from "react";
import {
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, gooogleProvider, facebookProvider, twitterProvider, db } from "./utils/firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleAuthProvider = (provider) => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const docRef = doc(db, "usernames", result.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {//connexion
          setUser(docSnap.data())

          console.log("Document data:", docSnap.data());
        } else {//inscription
          await setDoc(doc(db, "usernames", result.user.uid), {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL
          })
          const docRef = doc(db, "usernames", result.user.uid);
          const docSnap = await getDoc(docRef);
          setUser(docSnap.data())
        }

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
