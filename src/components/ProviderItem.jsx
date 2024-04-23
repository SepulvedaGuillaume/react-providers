import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function ProviderItem({
  provider,
  handleSignUpProvider,
  handleConnexionProvider,
}) {
  return (
    <div className="mr-4">
      {provider.register ? (
        <SignUp
          label={provider.label}
          onSignUpClick={handleSignUpProvider}
          provider={provider.provider}
        />
      ) : (
        <SignIn
          label={provider.label}
          onSignInClick={handleConnexionProvider}
          provider={provider.provider}
        />
      )}
    </div>
  );
}
