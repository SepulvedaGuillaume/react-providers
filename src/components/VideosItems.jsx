import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function VideosItems() {
  const { user } = useContext(UserContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (user && user.videosId && user.videosId.length > 0) {
        const videosRef = collection(db, "videos");
        const q = query(videosRef, where("__name__", "in", user.videosId));
        const videosData = [];
        onSnapshot(q, (snapshot) => {
          snapshot.forEach(
            (doc) => {
              videosData.push({ id: doc.id, ...doc.data() });
            },
            { includeMetadataChanges: true }
          );
          setVideos(videosData);
        });
      }
    };

    fetchVideos();
  }, [user]);

  return (
    <div className="container">
      {videos.length > 0 && (
        <>
          <h2 className="title is-2">Mes vidéos</h2>
          <div className="columns is-multiline">
            {videos.map((video) => (
              <div key={video.id} className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <p className="title is-4">{video.name}</p>
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
