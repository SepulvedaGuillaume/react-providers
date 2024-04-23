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
        console.log(result);
        setUser(result.user);

        const docRef = doc(db, "usernames", result.user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docRef)
        console.log(docSnap)
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          await setDoc(doc(db, "usernames", result.user.uid), {
            name: result.user.displayName,
            mail: result.user.email,
            picture: result.user.photoURL

          })
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
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
