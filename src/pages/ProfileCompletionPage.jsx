import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import FormField from "../components/molecules/FormField";
import Select from "../components/atoms/Select";
import Button from "../components/atoms/Button";
import ErrorMessage from "../components/atoms/ErrorMessage";

import { completeProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const COUNTRY_OPTIONS = [
  { value: "Tunisie", label: "🇹🇳 Tunisie" },
  { value: "Maroc", label: "🇲🇦 Maroc" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Égypte", label: "🇪🇬 Égypte" },
];

const SECTOR_OPTIONS = [
  {
    value: "Agroalimentaire",
    label: "🍅 Agroalimentaire",
  },
  {
    value: "Énergie",
    label: "⚡ Énergie",
  },
  {
    value: "Textile",
    label: "👕 Textile",
  },
];

export default function ProfileCompletionPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [submitError, setSubmitError] =
    useState(null);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data) {
    setSubmitError(null);

    try {
      const payload = {
        ...data,

        certifications: data.certifications
          ? data.certifications
              .split(",")
              .map((c) => c.trim())
          : [],
      };

      const updated =
        await completeProfile(payload);

      updateUser({
        profile: updated.profile,
        profileStatus:
          updated.profileStatus,
      });

      navigate("/onboarding/listing");
    } catch (err) {
      setSubmitError(
        err.message ||
          "Erreur lors de l'enregistrement du profil"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "12px",
            }}
          >
            🏢
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: "800",
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Compléter votre profil entreprise
          </h1>

          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              color: "#6b7280",
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            Fournissez les informations de
            votre société afin d’accéder aux
            meilleures opportunités
            d’importation et d’exportation.
          </p>
        </div>

        {/* CARD */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            padding: "40px",
            boxShadow:
              "0 20px 60px rgba(15,23,42,0.08)",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* ENTREPRISE */}

            <FormField
              label="Nom de l'entreprise"
              name="companyName"
              register={register}
              rules={{
                required:
                  "Nom d'entreprise requis",
              }}
              error={errors.companyName}
            />

            {/* PAYS + SECTEUR */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  🌍 Pays
                </label>

                <Select
                  options={COUNTRY_OPTIONS}
                  placeholder="Choisir un pays"
                  value={watch("country")}
                  onChange={(value) =>
                    setValue(
                      "country",
                      value
                    )
                  }
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  🏭 Secteur
                </label>

                <Select
                  options={SECTOR_OPTIONS}
                  placeholder="Choisir un secteur"
                  value={watch("sector")}
                  onChange={(value) =>
                    setValue(
                      "sector",
                      value
                    )
                  }
                />
              </div>
            </div>

            {/* CERTIFICATIONS */}

            <div
              style={{
                padding: "18px",
                borderRadius: "16px",
                background: "#f8fafc",
                marginBottom: "20px",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  fontSize: "16px",
                }}
              >
                ✅ Certifications
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  marginTop: 0,
                  fontSize: "14px",
                }}
              >
                Exemple : ISO 9001, BIO,
                CE, HACCP...
              </p>

              <FormField
                label=""
                name="certifications"
                register={register}
                error={
                  errors.certifications
                }
              />
            </div>

            {/* ERREUR */}

            <ErrorMessage>
              {submitError}
            </ErrorMessage>

            {/* BOUTON */}

            <Button
              type="submit"
              style={{
                width: "100%",
                padding: "18px",
                fontSize: "18px",
                fontWeight: "700",
                borderRadius: "16px",
              }}
            >
              ✅ Enregistrer et continuer
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}