import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/molecules/StatusBadge";

const COUNTRY_OPTIONS = [
  "Tunisie",
  "France",
  "Maroc",
  "Algérie",
  "Égypte",
  "Chine",
  "Italie",
  "Espagne",
];

const SECTOR_OPTIONS = [
  "Agroalimentaire",
  "Textile",
  "Industrie",
  "Énergie",
  "Chimie",
  "Cosmétique",
];

export default function ProfilePage() {
  const { user } = useAuth();

  const [accountInfo, setAccountInfo] =
    useState({
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "Exportateur",
    });

  const [companyInfo, setCompanyInfo] =
    useState({
      companyName:
        user?.profile?.companyName ||
        "Olive Tunisia",

      country:
        user?.profile?.country || "",

      sector:
        user?.profile?.sector || "",

      certifications:
        user?.profile?.certifications?.join(
          ", "
        ) || "",
    });

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          🏢 Modifier mon profil
        </h1>

        <p
          style={{
            color: "#64748b",
          }}
        >
          Gérez votre compte, votre
          entreprise et vos paramètres de
          sécurité.
        </p>
      </div>

      <div
        className="grid-sidebar"
        style={{
          gap: "24px",
        }}
      >
        {/* SIDEBAR */}

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            height: "fit-content",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#4f46e5,#4338ca)",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "42px",
              }}
            >
              🏢
            </div>

            <h3>
              {companyInfo.companyName}
            </h3>

            <p
              style={{
                color: "#64748b",
              }}
            >
              {accountInfo.role}
            </p>

            <div style={{ marginTop: "8px" }}>
              <StatusBadge status={user?.profileStatus || "pending"} />
            </div>

            <Link
              to="/profile/status"
              style={{
                display: "inline-block",
                marginTop: "10px",
                fontSize: "13px",
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Voir le détail du statut →
            </Link>
          </div>

          
        </div>

        {/* CONTENU */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* COMPTE */}

          <Card title="📧 Compte professionnel">
            <Input
            id="compte"
              label="Email professionnel"
              value={accountInfo.email}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  email:
                    e.target.value,
                })
              }
            />

            <Input
              label="Téléphone professionnel"
              value={accountInfo.phone}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  phone:
                    e.target.value,
                })
              }
            />

            <SelectField
  label="Type de compte"
  value={accountInfo.role}
  options={[
    "Exportateur",
    "Importateur",
  ]}
  onChange={(value) =>
    setAccountInfo({
      ...accountInfo,
      role: value,
    })
  }
/>

            <SaveButton />
          </Card>

          {/* ENTREPRISE */}

          <Card title="🏢 Informations entreprise">
            <Input
              label="Nom de l'entreprise"
              value={
                companyInfo.companyName
              }
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  companyName:
                    e.target.value,
                })
              }
            />

            <FormRow>
              <SelectField
                label="Pays"
                value={
                  companyInfo.country
                }
                options={
                  COUNTRY_OPTIONS
                }
                onChange={(value) =>
                  setCompanyInfo({
                    ...companyInfo,
                    country: value,
                  })
                }
              />

              <SelectField
                label="Secteur"
                value={
                  companyInfo.sector
                }
                options={
                  SECTOR_OPTIONS
                }
                onChange={(value) =>
                  setCompanyInfo({
                    ...companyInfo,
                    sector: value,
                  })
                }
              />
            </FormRow>

            <Input
              label="Certifications"
              value={
                companyInfo.certifications
              }
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  certifications:
                    e.target.value,
                })
              }
            />

            <SaveButton />
          </Card>

          {/* SECURITE */}

          <Card title="🔐 Sécurité">
            <Input
              type="password"
              label="Mot de passe actuel"
              value={
                passwordData.currentPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    e.target.value,
                })
              }
            />

            <Input
              type="password"
              label="Nouveau mot de passe"
              value={
                passwordData.newPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    e.target.value,
                })
              }
            />

            <Input
              type="password"
              label="Confirmer le mot de passe"
              value={
                passwordData.confirmPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword:
                    e.target.value,
                })
              }
            />

            <Link
              to="/forgot-password"
              style={{
                display: "inline-block",
                marginBottom: "20px",
                color: "#4f46e5",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Mot de passe oublié ?
            </Link>

            <br />

            <button
              style={primaryButton}
            >
              🔐 Changer le mot de passe
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
/* COMPONENTS */

function MenuItem({
  icon,
  label,
}) {
  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      {icon} {label}
    </div>
  );
}

function Card({
  title,
  children,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
        border:
          "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

function FormRow({
  children,
}) {
  return (
    <div
      className="grid-2-col"
      style={{
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div
      style={{
        marginBottom: "16px",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "12px",
          border:
            "1px solid #d1d5db",
          borderRadius:
            "12px",
        }}
      />
    </div>
  );
}

function SaveButton() {
  return (
    <button style={primaryButton}>
      💾 Enregistrer
    </button>
  );
}

const primaryButton = {
  border: "none",
  borderRadius: "12px",
  padding: "14px 22px",
  background:
    "linear-gradient(135deg,#4f46e5,#4338ca)",
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
};

function SelectField({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div
      style={{
        marginBottom: "16px",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          border:
            "1px solid #d1d5db",
          borderRadius: "12px",
        }}
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}