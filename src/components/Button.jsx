import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Boutton({ message, label, onClickProvider, provider }) {
  return (
    <button onClick={() => onClickProvider(provider)} className="button">
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
      {message} {label}
    </button>
  );
}
