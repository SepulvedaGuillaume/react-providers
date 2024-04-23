import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function UserInfos({ logout }) {
  const { user } = useContext(UserContext);

  return (
    <>
      <button onClick={logout} className="button">
        Logout
      </button>
      {user.displayName && (
        <p className="mt-4 has-text-white has-text-weight-bold">
          {user.displayName}
        </p>
      )}
      {user.email && <p>{user.email}</p>}
      <img src={user.photoURL} alt={user.displayName} />
    </>
  );
}
