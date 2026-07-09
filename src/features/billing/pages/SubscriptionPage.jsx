import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AsyncState from "../../../components/organisms/AsyncState";
import SectionCard from "../../../components/molecules/SectionCard";
import DetailCard from "../../../components/molecules/DetailCard";
import Button from "../../../components/atoms/Button";
import BillingSubNav from "../components/BillingSubNav";
import { getSubscription, getPaymentMethods, cancelSubscription } from "../api/billing";
import { colors, spacing, typography } from "../../../styles/tokens";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  function load() {
    setIsLoading(true);
    Promise.all([getSubscription(), getPaymentMethods()])
      .then(([subscriptionData, methodsData]) => {
        setSubscription(subscriptionData);
        setPaymentMethods(methodsData);
      })
      .catch((err) => setError(err.message || "Erreur lors du chargement"))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleCancel() {
    setIsCanceling(true);
    try {
      const updated = await cancelSubscription();
      setSubscription(updated);
      setConfirmingCancel(false);
    } catch (err) {
      setError(err.message || "Impossible de résilier l'abonnement");
    } finally {
      setIsCanceling(false);
    }
  }

  const defaultMethod = paymentMethods.find((m) => m.isDefault);

  return (
    <div>
      <h1 style={{ fontFamily: typography.display, fontSize: typography.fontSizeXl, fontWeight: 800, marginBottom: spacing.xs }}>
        Mon abonnement
      </h1>
      <p style={{ color: colors.textMuted, marginBottom: spacing.lg }}>
        Consultez l'état de votre abonnement et gérez son renouvellement.
      </p>

      <BillingSubNav />

      <AsyncState isLoading={isLoading} error={error}>
        {subscription && (
          <SectionCard title={subscription.planTitle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <DetailCard
                icon="💳"
                title="Statut"
                value={subscription.status === "active" ? "Actif" : "Résilié"}
              />
              <DetailCard icon="💶" title="Tarif" value={subscription.price} />
              <DetailCard
                icon="📅"
                title="Prochain renouvellement"
                value={subscription.status === "active" ? subscription.renewalDate : "—"}
              />
              <DetailCard
                icon="🏦"
                title="Moyen de paiement"
                value={
                  defaultMethod
                    ? defaultMethod.type === "card"
                      ? `${defaultMethod.brand} •••• ${defaultMethod.last4}`
                      : "PayPal"
                    : "Aucun"
                }
              />
            </div>

            <div style={{ display: "flex", gap: spacing.sm, flexWrap: "wrap" }}>

              <Link to="/billing/payment-methods">
                <Button variant="secondary">Gérer mes moyens de paiement</Button>
              </Link>

              {subscription.status === "active" && !confirmingCancel && (
                <Button variant="danger" onClick={() => setConfirmingCancel(true)}>
                  Résilier l'abonnement
                </Button>
              )}
            </div>

            {confirmingCancel && (
              <div
                style={{
                  marginTop: spacing.md,
                  padding: spacing.md,
                  backgroundColor: colors.dangerBg,
                  borderRadius: 12,
                }}
              >
                <p style={{ margin: 0, color: colors.danger, fontWeight: 600 }}>
                  Confirmer la résiliation ? Vous garderez l'accès Premium jusqu'au{" "}
                  {subscription.renewalDate}, puis votre compte repassera au plan Gratuit.
                </p>
                <div style={{ display: "flex", gap: spacing.sm, marginTop: spacing.sm }}>
                  <Button variant="danger" onClick={handleCancel} disabled={isCanceling}>
                    {isCanceling ? "Résiliation..." : "Oui, résilier"}
                  </Button>
                  <Button variant="secondary" onClick={() => setConfirmingCancel(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {subscription.status !== "active" && (
              <div style={{ marginTop: spacing.md }}>
                <Button onClick={() => navigate("/billing/plans")}>Réactiver un abonnement</Button>
              </div>
            )}
          </SectionCard>
        )}
      </AsyncState>
    </div>
  );
}
