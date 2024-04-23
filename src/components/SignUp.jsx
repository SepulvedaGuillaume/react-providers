export default function SignUp({label, onSignUpClick, provider}) {
  return (
      <button onClick={() => onSignUpClick(provider)} className="button">S&apos;inscrire avec {label}</button>
  );
}
