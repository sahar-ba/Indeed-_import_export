import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/molecules/StatusBadge";
import SectionCard from "../components/molecules/SectionCard";
import Reveal from "../components/atoms/Reveal";
import Input from "../components/atoms/Input";
import Select from "../components/atoms/Select";
import Button from "../components/atoms/Button";
import { colors, spacing, typography } from "../styles/tokens";

const COUNTRY_OPTIONS = [
  "Tunisie",
  "France",
  "Maroc",
  "Algérie",
  "Égypte",
  "Chine",
  "Italie",
  "Espagne",
].map((c) => ({ value: c, label: c }));

const SECTOR_OPTIONS = [
  "Agroalimentaire",
  "Textile",
  "Industrie",
  "Énergie",
  "Chimie",
  "Cosmétique",
].map((s) => ({ value: s, label: s }));

const ROLE_OPTIONS = [
  { value: "Exportateur", label: "Exportateur" },
  { value: "Importateur", label: "Importateur" },
];

function FieldLabel({ children }) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 6,
        fontFamily: typography.body,
        fontSize: 14,
        fontWeight: 600,
        color: colors.textPrimary,
      }}
    >
      {children}
    </label>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [accountInfo, setAccountInfo] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Exportateur",
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: user?.profile?.companyName || "Olive Tunisia",
    country: user?.profile?.country || "",
    sector: user?.profile?.sector || "",
    certifications: user?.profile?.certifications?.join(", ") || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const initial = (companyInfo.companyName || "?").trim().charAt(0).toUpperCase();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Reveal style={{ marginBottom: spacing.lg }}>
        <span className="eyebrow">Mon compte</span>
        <h1
          style={{
            fontFamily: typography.display,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: colors.textPrimary,
            marginBottom: "10px",
          }}
        >
          Modifier mon profil
        </h1>
        <p style={{ color: colors.textMuted, fontFamily: typography.body }}>
          Gérez votre compte, votre entreprise et vos paramètres de sécurité.
        </p>
      </Reveal>

      <div className="grid-sidebar" style={{ gap: spacing.lg, alignItems: "start" }}>
        {/* SIDEBAR */}
        <Reveal delay={80}>
          <div
            style={{
              background: colors.surfaceRaised,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: spacing.lg,
              textAlign: "center",
              position: "sticky",
              top: spacing.lg,
            }}
          >
            <div
              className="hover-lift"
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: typography.display,
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {initial}
            </div>

            <h3
              style={{
                fontFamily: typography.display,
                fontSize: 18,
                fontWeight: 700,
                color: colors.textPrimary,
                marginBottom: 4,
              }}
            >
              {companyInfo.companyName}
            </h3>

            <p style={{ color: colors.textMuted, fontFamily: typography.body, fontSize: 14, marginBottom: 12 }}>
              {accountInfo.role}
            </p>

            <StatusBadge status={user?.profileStatus || "pending"} />

            <div style={{ marginTop: 14 }}>
              <Link
                to="/profile/status"
                style={{
                  fontFamily: typography.body,
                  fontSize: 13,
                  color: colors.primary,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Voir le détail du statut →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* CONTENU */}
        <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
          <Reveal delay={140}>
            <SectionCard title="Compte professionnel">
              <FieldLabel>Email professionnel</FieldLabel>
              <Input
                type="email"
                value={accountInfo.email}
                onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
              />

              <FieldLabel>Téléphone professionnel</FieldLabel>
              <Input
                value={accountInfo.phone}
                onChange={(e) => setAccountInfo({ ...accountInfo, phone: e.target.value })}
              />

              <FieldLabel>Type de compte</FieldLabel>
              <Select
                value={accountInfo.role}
                options={ROLE_OPTIONS}
                onChange={(value) => setAccountInfo({ ...accountInfo, role: value })}
              />

              <div style={{ marginTop: spacing.sm }}>
                <Button>Enregistrer</Button>
              </div>
            </SectionCard>
          </Reveal>

          <Reveal delay={200}>
            <SectionCard title="Informations entreprise">
              <FieldLabel>Nom de l'entreprise</FieldLabel>
              <Input
                value={companyInfo.companyName}
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
              />

              <div className="grid-2-col" style={{ gap: spacing.md }}>
                <div>
                  <FieldLabel>Pays</FieldLabel>
                  <Select
                    value={companyInfo.country}
                    options={COUNTRY_OPTIONS}
                    placeholder="Sélectionner un pays"
                    onChange={(value) => setCompanyInfo({ ...companyInfo, country: value })}
                  />
                </div>
                <div>
                  <FieldLabel>Secteur</FieldLabel>
                  <Select
                    value={companyInfo.sector}
                    options={SECTOR_OPTIONS}
                    placeholder="Sélectionner un secteur"
                    onChange={(value) => setCompanyInfo({ ...companyInfo, sector: value })}
                  />
                </div>
              </div>

              <FieldLabel>Certifications</FieldLabel>
              <Input
                value={companyInfo.certifications}
                onChange={(e) => setCompanyInfo({ ...companyInfo, certifications: e.target.value })}
              />

              <div style={{ marginTop: spacing.sm }}>
                <Button>Enregistrer</Button>
              </div>
            </SectionCard>
          </Reveal>

          <Reveal delay={260}>
            <SectionCard title="Sécurité">
              <FieldLabel>Mot de passe actuel</FieldLabel>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />

              <FieldLabel>Nouveau mot de passe</FieldLabel>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />

              <FieldLabel>Confirmer le mot de passe</FieldLabel>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />

              <Link
                to="/forgot-password"
                style={{
                  display: "inline-block",
                  margin: "4px 0 16px",
                  color: colors.primary,
                  fontFamily: typography.body,
                  fontSize: 14,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Mot de passe oublié ?
              </Link>

              <div>
                <Button variant="dark">Changer le mot de passe</Button>
              </div>
            </SectionCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
