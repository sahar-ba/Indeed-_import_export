import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // TODO API reset password
    setIsSent(true);
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
          <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius: "12px",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              type="submit"
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
                cursor: "pointer",
              }}
            >
              📩 Envoyer le lien
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