import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function UserInfos({ logout }) {
  const { user } = useContext(UserContext);

  return (
    <>
      <h3 className="title is-3 pb-4">Mes infos</h3>
      <div className="container my-4">
        <button onClick={logout} className="button is-danger mt-4">
          Logout
        </button>
        {user.displayName && (
          <p className="mt-4 has-text-white has-text-weight-bold">
            {user.displayName}
          </p>
        )}
        {user.email && <p>{user.email}</p>}
        <img src={user.photoURL} alt={user.displayName} className="mt-4" />
      </div>
    </>
  );
}
