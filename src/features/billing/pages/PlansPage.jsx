import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsyncState from "../../../components/organisms/AsyncState";
import BillingSubNav from "../components/BillingSubNav";
import PricingCard from "../components/PricingCard";
import SmartRecommendationBanner from "../components/SmartRecommendationBanner";
import { getSubscription, getSmartRecommendation } from "../api/billing";
import { mockPlans } from "../mocks/billing.mock";
import { colors, spacing, typography } from "../../../styles/tokens";

export default function PlansPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSubscription(), getSmartRecommendation()])
      .then(([sub, rec]) => {
        if (!isMounted) return;
        setSubscription(sub);
        setRecommendation(rec);
      })
      .catch((err) => isMounted && setError(err.message || "Erreur lors du chargement"))
      .finally(() => isMounted && setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: typography.display, fontSize: typography.fontSizeXl, fontWeight: 800, marginBottom: spacing.xs }}>
        Comparer les offres
      </h1>
      <p style={{ color: colors.textMuted, marginBottom: spacing.lg }}>
        Choisissez la formule adaptée à votre activité. Vous pourrez en changer à tout moment.
      </p>

      <BillingSubNav />

      <AsyncState isLoading={isLoading} error={error}>
        <SmartRecommendationBanner recommendation={recommendation} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: spacing.lg,
            alignItems: "stretch",
          }}
        >
          {mockPlans
            .filter((plan) => !subscription?.usedPlanIds?.includes(plan.id))
            .map((plan) => (
              <PricingCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                subtitle={plan.subtitle}
                features={plan.features}
                buttonLabel={subscription?.planId === plan.id ? "Plan actuel" : plan.buttonLabel}
                highlighted={plan.highlighted}
                isCurrent={subscription?.planId === plan.id}
                disabled={subscription?.planId === plan.id}
                onClick={() => navigate(`/billing/checkout/${plan.id}`)}
              />
            ))}
        </div>
      </AsyncState>
    </div>
  );
}
