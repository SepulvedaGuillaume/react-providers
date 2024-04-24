import { useContext, useState } from "react";
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
import { UserContext } from "./contexts/UserContext";
import FormVideo from "./components/FormVideo";
import VideosItems from "./components/VideosItems";

export default function App() {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("userInfo");
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
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  const handleSignInProvider = (authprovider) => {
    signInWithPopup(auth, authprovider)
      .then(async ({ user }) => {
        const docRef = doc(db, "usernames", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRegistered(true);
          setUser({ id: docSnap.id, ...docSnap.data() });
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
        const userId = user.uid;

        await setDoc(doc(db, "usernames", userId), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          videosId: [],
        });
        const docRef = doc(db, "usernames", userId);
        const docSnap = await getDoc(docRef);
        setRegistered(true);
        setUser({ id: docSnap.id, ...docSnap.data() });
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

  const openAddVideoModal = () => setShowAddVideoModal(true);
  const closeAddVideoModal = () => setShowAddVideoModal(false);

  return (
    <div className="container my-6 has-text-centered">
      <h1 className="title is-1 pb-4">Providers firebase</h1>
      <div className="tab-content">
        {!registered && (
          <div className="is-flex is-justify-content-center">
            {providersList.map((provider, index) => (
              <ProviderItem
                key={index}
                provider={provider}
                onClickProvider={
                  provider.register
                    ? handleSignUpProvider
                    : handleSignInProvider
                }
              />
            ))}
          </div>
        )}
        {registered && user && (
          <div className="tabs is-centered">
            <ul>
              <li className={activeTab === "userInfo" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("userInfo")}>
                  Infos Utilisateur
                </a>
              </li>
              <li className={activeTab === "videos" ? "is-active" : ""}>
                <a onClick={() => setActiveTab("videos")}>Mes Vidéos</a>
              </li>
            </ul>
          </div>
        )}
        {registered && (
          <div className="container">
            <button
              className="button is-primary mt-2 mb-6"
              onClick={openAddVideoModal}
            >
              Ajouter une vidéo
            </button>
          </div>
        )}
        {registered && user && activeTab === "userInfo" && (
          <UserInfos logout={logout} />
        )}
        {registered && user && activeTab === "videos" && <VideosItems />}
      </div>
      {error && <p className="message is-danger mt-4">{error}</p>}
      {showAddVideoModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddVideoModal}></div>
          <div className="modal-content">
            <div className="box">
              <FormVideo onClose={closeAddVideoModal} />
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={closeAddVideoModal}
          ></button>
        </div>
      )}
    </div>
  );
}
