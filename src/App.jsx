import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  gooogleProvider,
  facebookProvider,
  twitterProvider,
  db,
} from "./utils/firebase";
import UserInfos from "./components/UserInfos";
import ProviderItem from "./components/ProviderItem";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [providersList, setProvidersList] = useState([
    {
      label: "Google",
      provider: gooogleProvider,
      register: false,
    },
    {
      label: "Facebook",
      provider: facebookProvider,
      register: false,
    },
    {
      label: "Twitter",
      provider: twitterProvider,
      register: false,
    },
  ]);

  const handleConnexionProvider = (authprovider) => {
    signInWithPopup(auth, authprovider)
      .then(async ({ user }) => {
        const docRef = doc(db, "usernames", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRegistered(true);
          setUser(docSnap.data());
          console.log("Document data:", docSnap.data());
        } else {
          setProvidersList((prevProvidersList) =>
            prevProvidersList.map((provider) =>
              provider.provider.providerId === authprovider.providerId
                ? { ...provider, register: true }
                : provider
            )
          );
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSignUpProvider = (authprovider) => {
    signInWithPopup(auth, authprovider)
      .then(async ({ user }) => {
        await setDoc(doc(db, "usernames", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        const docRef = doc(db, "usernames", user.uid);
        const docSnap = await getDoc(docRef);
        setRegistered(true);
        setUser(docSnap.data());
        setProvidersList((prevProvidersList) =>
          prevProvidersList.map((provider) =>
            provider.provider.providerId === authprovider.providerId
              ? { ...provider, register: false }
              : provider
          )
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setRegistered(false);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="container my-6 has-text-centered">
      <h1 className="title is-1 pb-4">Providers firebase</h1>
      {!registered && (
        <div className="is-flex is-justify-content-center">
          {providersList.map((provider, index) => (
            <ProviderItem
              key={index}
              provider={provider}
              handleSignUpProvider={handleSignUpProvider}
              handleConnexionProvider={handleConnexionProvider}
            />
          ))}
        </div>
      )}
      {registered && user && <UserInfos user={user} logout={logout} />}
      {error && <p>{error}</p>}
    </div>
  );
}
