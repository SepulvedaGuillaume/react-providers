import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function SignIn({ label, onSignInClick, provider }) {
  return (
    <button onClick={() => onSignInClick(provider)} className="button">
      <FontAwesomeIcon
      className="mr-2"
        icon={
          label === "Google"
            ? faGoogle
            : label === "Facebook"
            ? faFacebook
            : label === "Twitter"
            ? faTwitter
            : null
        }
      />
      Se connecter avec {label}
    </button>
  );
}
