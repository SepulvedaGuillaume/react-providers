export default function SignIn({label, onSignInClick, provider}) {
    return (
        <button onClick={() => onSignInClick(provider)}>Se connecter avec {label}</button>
    );
  }
  