export default function SignIn({label, onSignInClick, provider}) {
    return (
        <button onClick={() => onSignInClick(provider)} className="button">Se connecter avec {label}</button>
    );
  }
  