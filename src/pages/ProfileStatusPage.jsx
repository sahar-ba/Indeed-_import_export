import { useNavigate } from "react-router-dom";
import { RefreshCw, Edit3, ArrowRight } from "lucide-react";
import StatusBadge from "../components/molecules/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { colors, radius, shadow, spacing, typography } from "../styles/tokens";

const STATUS_CONTENT = {
  pending: {
    icon: "⏳",
    title: "Vérification en cours",
    message:
      "Votre profil est en cours de vérification par notre équipe. Cela prend généralement 24 à 48h. Vous pouvez déjà explorer le catalogue et préparer vos annonces en attendant.",
  },
  validated: {
    icon: "✅",
    title: "Profil validé",
    message:
      "Votre profil a été vérifié avec succès. Vous pouvez publier des annonces et contacter d'autres membres en toute confiance.",
  },
  rejected: {
    icon: "❌",
    title: "Profil rejeté",
    message:
      "Votre profil n'a pas été validé. Vérifiez que les informations fournies (nom d'entreprise, pays, certifications) sont exactes et complètes, puis soumettez-le à nouveau.",
  },
};

export default function ProfileStatusPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const status = user?.profileStatus || "pending";
  const content = STATUS_CONTENT[status] || STATUS_CONTENT.pending;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: typography.fontSizeXl,
          fontWeight: 800,
          marginBottom: spacing.lg,
          color: colors.textPrimary,
        }}
      >
        Statut de votre profil
      </h1>

      <div
        style={{
          background: colors.surfaceRaised,
          border: `1px solid ${colors.border}`,
          borderRadius: radius.lg,
          boxShadow: shadow.card,
          padding: spacing.xl,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: spacing.md }}>{content.icon}</div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: spacing.md }}>
          <StatusBadge status={status} />
        </div>

        <h2
          style={{
            fontSize: typography.fontSizeLg,
            marginBottom: spacing.sm,
            color: colors.textPrimary,
          }}
        >
          {content.title}
        </h2>

        <p
          style={{
            color: colors.textMuted,
            lineHeight: 1.7,
            marginBottom: spacing.lg,
          }}
        >
          {content.message}
        </p>

        {status === "rejected" && (
          <button
            onClick={() => navigate("/profile/complete")}
            style={actionButtonStyle(colors.danger)}
          >
            <Edit3 size={16} />
            Modifier et resoumettre mon profil
          </button>
        )}

        {status === "pending" && (
          <button
            onClick={() => window.location.reload()}
            style={actionButtonStyle(colors.neutral)}
          >
            <RefreshCw size={16} />
            Rafraîchir le statut
          </button>
        )}

        {status === "validated" && (
          <button
            onClick={() => navigate("/listings/catalog")}
            style={actionButtonStyle(colors.primary)}
          >
            Aller au catalogue
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function actionButtonStyle(color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    border: "none",
    borderRadius: radius.md,
    backgroundColor: color,
    color: "#fff",
    fontWeight: 700,
    fontSize: typography.fontSizeBase,
    cursor: "pointer",
  };
}
