export default function SignUp({label, onSignUpClick, provider}) {
  return (
      <button onClick={() => onSignUpClick(provider)}>S&apos;inscrire avec {label}</button>
  );
}
