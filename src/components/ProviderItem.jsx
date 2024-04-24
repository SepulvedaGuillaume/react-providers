import Button from "./Button";

export default function ProviderItem({
  provider,
  onClickProvider,
}) {
  return (
    <div className="mr-4">
      <Button
        message={provider.register ? "S'inscrire avec" : "Se connecter avec"}
        label={provider.label}
        onClickProvider={onClickProvider}
        provider={provider.provider}
      />
    </div>
  );
}
