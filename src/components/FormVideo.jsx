import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useContext, useState } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { UserContext } from "../contexts/UserContext";

export default function FormVideo() {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [progressBar, setProgressBar] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    if (!title) {
      setError("Veuillez saisir un nom");
      return;
    }
    try {
      const storage = getStorage();
      const storageRef = ref(storage, file.name);
      const metadata = {
        contentType: "video/mp4",
      };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressBar(progress);
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
          setError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const docRef = await addDoc(collection(db, "videos"), {
              title: title,
              url: downloadURL,
            });
            const videosIdArray = user.videosId || [];
            if (!videosIdArray.includes(docRef.id)) {
              videosIdArray.push(docRef.id);
            }
            await setDoc(doc(db, "usernames", user.id), {
              ...user,
              videosId: videosIdArray,
            });
          });
          setSuccess(true);
        }
      );
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError(error.message);
    } finally {
      setFile(null);
      setTitle("");
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    setSuccess(false);
    setProgressBar(0);
    const selectedFile = e.target.files[0];
    const video = document.createElement("video");

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;
      if (duration > 180) {
        setError("La vidéo doit être inférieure à 180 secondes.");
        return;
      }
      setFile(selectedFile);
    });
    video.src = URL?.createObjectURL(selectedFile);
    console.log(video.src);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="container mt-6 pt-4">
      <h3 className="title is-3">Télécharger une vidéo</h3>
      <form
        className="is-flex is-flex-direction-column is-align-items-center"
        onSubmit={handleUpload}
      >
        <div className="field column is-one-third">
          <label className="label">Nom</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Nom de la vidéo"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
        </div>
        <div className="file mb-0">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              accept=".mp4"
              name="video"
              onChange={handleFileChange}
            />
            <span className="file-cta">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              <span className="file-label">
                {" "}
                Choisis une vidéo à uploader…{" "}
              </span>
            </span>
          </label>
        </div>
        <span className="mt-2 has-text-info">Moins de 180s et au format .mp4</span>
        {file && (
          <div className="mt-4">
            <video controls width="400">
              <source src={URL.createObjectURL(file)} type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
          </div>
        )}
        {file && <span className="file-name">{file.name}</span>}
        <button type="submit" className="button is-primary mt-4">
          Ajouter la vidéo
        </button>
      </form>
      {progressBar > 0 && progressBar <= 100 && (
        <div className="column is-half has-text-centered m-auto">
          <progress
            className="progress is-small is-link mt-5"
            value={progressBar}
            max="100"
          >
            20%
          </progress>
        </div>
      )}
      {success && (
        <div className="message is-success mt-2">
          La vidéo a été téléchargée avec succès
        </div>
      )}
      {error && <div className="message is-danger mt-2">{error}</div>}
    </div>
  );
}
