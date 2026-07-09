import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm();

  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  async function onSubmit(data) {
    try {
      await registerUser(data);
      navigate("/profile/complete");
    } catch (err) {
      setSubmitError(err.message);
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
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.08)",
        }}
      >
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
          Créer un compte
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Rejoignez la plateforme <b>Indeed&sup2;</b>
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
              {...register("email")}
              placeholder="votre@email.com"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: "25px" }}>
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
              {...register("password")}
              placeholder="********"
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Rôle */}
          <h3
            style={{
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            Je suis :
          </h3>

          <div
            onClick={() => setValue("role", "exporter")}
            style={{
              border:
                watch("role") === "exporter"
                  ? "2px solid #4f46e5"
                  : "1px solid #ddd",
              borderRadius: "16px",
              padding: "18px",
              cursor: "pointer",
              marginBottom: "12px",
              background:
                watch("role") === "exporter"
                  ? "#eef2ff"
                  : "#fff",
            }}
          >
            <h4>🚢 Exportateur</h4>

            <p
              style={{
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              Je vends et exporte des produits.
            </p>
          </div>

          <div
            onClick={() => setValue("role", "importer")}
            style={{
              border:
                watch("role") === "importer"
                  ? "2px solid #4f46e5"
                  : "1px solid #ddd",
              borderRadius: "16px",
              padding: "18px",
              cursor: "pointer",
              marginBottom: "25px",
              background:
                watch("role") === "importer"
                  ? "#eef2ff"
                  : "#fff",
            }}
          >
            <h4>📦 Importateur</h4>

            <p
              style={{
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              Je recherche des fournisseurs.
            </p>
          </div>

          {submitError && (
            <div
              style={{
                marginBottom: "15px",
                color: "#dc2626",
              }}
            >
              {submitError}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: "#4f46e5",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Créer mon compte
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          Déjà membre ?{" "}
          <Link
            to="/auth/login"
            style={{
              color: "#4f46e5",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
