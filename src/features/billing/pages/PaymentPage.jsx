import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Wallet,
  Landmark,
  CheckCircle2,
} from "lucide-react";
import { mockPlans } from "../mocks/billing.mock";
import { changePlan } from "../api/billing";

const PAYMENT_METHODS = [
  { id: "card", label: "Carte bancaire", Icon: CreditCard },
  { id: "paypal", label: "PayPal", Icon: Wallet },
  { id: "bank", label: "Virement bancaire", Icon: Landmark },
];

export default function PaymentPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = mockPlans.find((p) => p.id === planId) || mockPlans[mockPlans.length - 1];

  const [method, setMethod] = useState("card");
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Référence de commande unique — c'est CE code, pas l'email, qui permettra
  // de faire correspondre un virement reçu à cette commande précise.
  const [orderReference] = useState(
    () => `IND2-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit() {
    // Pas de vrai traitement de paiement — aucun backend/Stripe branché
    // pour l'instant. On simule juste le comportement attendu :
    // carte/PayPal sont vérifiables instantanément par le prestataire de
    // paiement, un virement bancaire ne l'est jamais (il faut recevoir les
    // fonds et rapprocher la référence, ce qui prend plusieurs jours).
    setIsPaying(true);
    setTimeout(async () => {
      setIsPaying(false);
      if (method === "bank") {
        setIsPending(true);
      } else {
        // Carte/PayPal : le prestataire confirme instantanément, on peut
        // donc activer l'offre tout de suite (contrairement au virement).
        await changePlan(planId);
        setIsPaid(true);
      }
    }, 1200);
  }

  if (isPending) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Landmark size={32} color="#b45309" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
          Virement en attente de confirmation
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          Votre demande d'abonnement <strong>{plan.title.replace(/^\S+\s/, "")}</strong> est
          enregistrée. Elle sera activée automatiquement dès réception de votre virement —
          généralement sous 1 à 3 jours ouvrés.
        </p>

        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 14,
            padding: 18,
            marginBottom: 20,
            textAlign: "left",
          }}
        >
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#92400e", fontWeight: 700 }}>
            ⚠️ Référence obligatoire à indiquer dans le virement
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 20,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "0.05em",
            }}
          >
            {orderReference}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "#92400e" }}>
            Sans cette référence exacte, nous ne pourrons pas identifier votre paiement et
            l'associer à votre compte.
          </p>
        </div>

        <Link to="/billing">
          <button
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: 12,
              background: "linear-gradient(135deg,#4f46e5,#4338ca)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retour à la facturation
          </button>
        </Link>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <CheckCircle2 size={36} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Paiement confirmé</h1>
        <p style={{ color: "#6b7280", marginBottom: 28 }}>
          Votre abonnement <strong>{plan.title.replace(/^\S+\s/, "")}</strong> est maintenant actif.
          Un reçu vous a été envoyé par email.
        </p>
        <Link to="/billing">
          <button
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: 12,
              background: "linear-gradient(135deg,#4f46e5,#4338ca)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retour à la facturation
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      {/* Bandeau de confiance — imite une barre d'adresse sécurisée */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 10,
          padding: "8px 14px",
          marginBottom: 20,
          fontSize: 13,
          color: "#166534",
          fontFamily: "monospace",
        }}
      >
        <Lock size={14} />
        https://secure-payment.indeed2.com
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 4,
        }}
      >
        <ShieldCheck size={22} color="#4f46e5" />
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Paiement sécurisé</h1>
      </div>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Vos informations sont chiffrées et ne sont jamais stockées sur nos serveurs.
      </p>

      {/* Récapitulatif du plan choisi */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>{plan.title}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{plan.subtitle}</p>
        </div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#4f46e5" }}>{plan.price}</p>
      </div>

      {/* Choix du mode de paiement */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {PAYMENT_METHODS.map(({ id, label, Icon }) => {
          const selected = method === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 8px",
                borderRadius: 12,
                border: selected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                backgroundColor: selected ? "#eef2ff" : "#fff",
                cursor: "pointer",
              }}
            >
              <Icon size={20} color={selected ? "#4f46e5" : "#6b7280"} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: selected ? "#4f46e5" : "#374151",
                  textAlign: "center",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {method === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <TextField
              placeholder="Nom sur la carte"
              register={register}
              name="cardName"
              rules={{ required: "Nom requis" }}
              error={errors.cardName}
            />
            <TextField
              placeholder="Numéro de carte"
              register={register}
              name="cardNumber"
              rules={{
                required: "Numéro requis",
                pattern: { value: /^\d{13,19}$/, message: "Numéro invalide" },
              }}
              error={errors.cardNumber}
              inputMode="numeric"
            />
            <div style={{ display: "flex", gap: 12 }}>
              <TextField
                placeholder="MM/AA"
                register={register}
                name="expiry"
                rules={{ required: "Requis" }}
                error={errors.expiry}
              />
              <TextField
                placeholder="CVC"
                register={register}
                name="cvc"
                rules={{ required: "Requis" }}
                error={errors.cvc}
                inputMode="numeric"
              />
            </div>
          </div>
        )}

        {method === "paypal" && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              fontSize: 14,
              color: "#374151",
            }}
          >
            Vous serez redirigé vers PayPal pour finaliser le paiement en toute sécurité.
          </div>
        )}

        {method === "bank" && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              fontSize: 14,
              color: "#374151",
              lineHeight: 1.8,
            }}
          >
            IBAN : TN59 1000 6035 0000 0012 3456 <br />
            BIC : BIATTNTT <br />
            Référence à indiquer (obligatoire) :{" "}
            <strong style={{ fontFamily: "monospace" }}>{orderReference}</strong>
          </div>
        )}

        <button
          type="submit"
          disabled={isPaying}
          style={{
            width: "100%",
            padding: 16,
            border: "none",
            borderRadius: 14,
            background: "linear-gradient(135deg,#4f46e5,#4338ca)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: isPaying ? "default" : "pointer",
            opacity: isPaying ? 0.7 : 1,
          }}
        >
          {isPaying
            ? "Traitement en cours..."
            : method === "bank"
            ? "Confirmer la demande de virement"
            : `🔒 Payer ${plan.price}`}
        </button>
      </form>

      <button
        type="button"
        onClick={() => navigate("/billing")}
        style={{
          display: "block",
          margin: "16px auto 0",
          background: "none",
          border: "none",
          color: "#6b7280",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        ← Annuler et revenir
      </button>
    </div>
  );
}

function TextField({ placeholder, register, name, rules, error, inputMode }) {
  return (
    <div>
      <input
        placeholder={placeholder}
        inputMode={inputMode}
        {...register(name, rules)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: `1px solid ${error ? "#dc2626" : "#d1d5db"}`,
          fontSize: 14,
          boxSizing: "border-box",
        }}
      />
      {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "4px 0 0" }}>{error.message}</p>}
    </div>
  );
}
