export default function UserInfos({ user, logout }) {
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
      <img src={user.photoURL} alt={user.displayName} className="mt-4" />
    </>
  );
}
