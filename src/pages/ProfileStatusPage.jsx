import StatusBadge from "../components/molecules/StatusBadge";
import { useAuth } from "../context/AuthContext";

const STATUS_HELP = {
  pending: "Votre profil est en cours de vérification. Cela peut prendre 24 à 48h.",
  validated: "Votre profil est validé, vous pouvez publier des annonces.",
  rejected: "Votre profil a été rejeté. Vérifiez les informations fournies et réessayez.",
};

export default function ProfileStatusPage() {
  const { user } = useAuth();
  const status = user?.profileStatus || "pending";

  return (
    <div>
      <h1>Statut de votre profil</h1>
      <StatusBadge status={status} />
      <p style={{ marginTop: 12 }}>{STATUS_HELP[status]}</p>
    </div>
  );
}
