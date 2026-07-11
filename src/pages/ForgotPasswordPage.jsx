import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { requestPasswordReset } from "../api/auth";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  async function onSubmit(data) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await requestPasswordReset(data.email);
      setIsSent(true);
    } catch (err) {
      setSubmitError(err.message || "Une erreur est survenue. Réessayez plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "28px",
          padding: "40px",
          boxShadow:
            "0 20px 50px rgba(15,23,42,.08)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "12px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            Mot de passe oublié
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.7,
            }}
          >
            Saisissez votre adresse email afin
            de recevoir un lien de réinitialisation.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Email professionnel
              </label>

              <input
                type="email"
                placeholder="contact@entreprise.com"
                {...register("email", {
                  required: "Email requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Adresse email invalide",
                  },
                })}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: `1px solid ${errors.email ? "#dc2626" : "#d1d5db"}`,
                  borderRadius: "12px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />

              {errors.email && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: "6px",
                    fontSize: "14px",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {submitError && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "14px",
                }}
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg,#4f46e5,#4338ca)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                cursor: isSubmitting ? "default" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Envoi en cours..." : "📩 Envoyer le lien"}
            </button>
          </form>
        ) : (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "58px",
                marginBottom: "12px",
              }}
            >
              ✅
            </div>

            <h2
              style={{
                marginBottom: "12px",
              }}
            >
              Email envoyé
            </h2>

            <p
              style={{
                color: "#64748b",
                lineHeight: 1.7,
              }}
            >
              Si un compte est associé à cette
              adresse email, vous recevrez un
              lien de réinitialisation dans
              quelques instants.
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              border: "none",
              background: "transparent",
              color: "#4f46e5",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
}
