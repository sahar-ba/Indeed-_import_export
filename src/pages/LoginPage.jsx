import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [submitError, setSubmitError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data) {
    setSubmitError(null);

    try {
      await login(data);
      navigate("/listings/catalog");
    } catch (err) {
      setSubmitError(
        err.message || "Identifiants invalides"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icône */}
        <div
          style={{
            textAlign: "center",
            fontSize: "60px",
            marginBottom: "15px",
          }}
        >
          🌍
        </div>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Bon retour
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Connectez-vous à votre espace <b>Indeed&sup2;</b>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Email
            </label>

            <input
              type="email"
              {...register("email", {
                required: "Email requis",
              })}
              placeholder="votre@email.com"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            {errors.email && (
              <p
                style={{
                  color: "#dc2626",
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Mot de passe
            </label>

            <input
              type="password"
              {...register("password", {
                required: "Mot de passe requis",
              })}
              placeholder="********"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            {errors.password && (
              <p
                style={{
                  color: "#dc2626",
                  marginTop: "5px",
                  fontSize: "14px",
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Erreur de connexion */}
          {submitError && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "10px",
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }}
            >
              {submitError}
            </div>
          )}

{/* Mot de passe oublié */}

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  }}
>
  <Link
    to="/forgot-password"
    style={{
      textDecoration: "none",
      color: "#4f46e5",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    Mot de passe oublié ?
  </Link>
</div>

{/* Bouton */}

<button
  type="submit"
  style={{
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg,#4f46e5,#4338ca)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  }}
>
  🔐 Se connecter
</button>
        </form>

        {/* Inscription */}
        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#6b7280",
          }}
        >
          Pas encore de compte ?{" "}
          <Link
            to="/auth/register"
            style={{
              color: "#4f46e5",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
``