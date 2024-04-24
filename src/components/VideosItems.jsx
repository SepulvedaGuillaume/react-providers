import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function VideosItems() {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "videos"), where("__name__", "in", user.videosId)), (snapshot) => {
      const videosData = [];
      snapshot.forEach((doc) => {
        videosData.push({ id: doc.id, ...doc.data() });
      });
      setVideos(videosData); // Update state with the entire data array
    }, (error) => {
      console.error(error);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  }, [user, videos]);

  return (
    <div className="container">
      {videos.length > 0 && (
        <>
          <h3 className="title is-3 pb-4">Mes vidéos</h3>
          <div className="columns is-multiline">
            {videos.map((video) => (
              <div key={video.id} className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <p className="title is-4 has-text-white">{video.title}</p>
                    <div className="content">
                      <video
                        src={video.url}
                        controls
                        className="mt-4"
                        style={{ width: "100%" }}
                      ></video>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
