import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaBoxOpen,
  FaDollarSign,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaClock,
  FaCommentDots,
} from "react-icons/fa";

import { useResourceList } from "../hooks/useResourceList";
import { getMatches } from "../api/matches";
import { getOrCreateConversation } from "../features/messaging/api/messages";
import AsyncState from "../components/organisms/AsyncState";
import { colors, radius, shadow, spacing, typography } from "../styles/tokens";

// Chaque clé de `reasons` correspond à un critère évalué par l'agent IA.
const REASON_META = {
  product: { icon: <FaBoxOpen />, label: "Produit" },
  price: { icon: <FaDollarSign />, label: "Prix" },
  location: { icon: <FaMapMarkerAlt />, label: "Localisation" },
  reliability: { icon: <FaShieldAlt />, label: "Fiabilité" },
  deadline: { icon: <FaClock />, label: "Délai" },
};

const SCORE_FIELD_OPTIONS = [
  { value: "", label: "Tous les scores" },
  { value: "80", label: "80 et plus" },
  { value: "60", label: "60 et plus" },
];

function scoreColor(score) {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.info;
  return colors.neutral;
}

export default function MatchingPage() {
  const navigate = useNavigate();

  // useResourceList appelle getMatches(filters) à chaque changement de
  // filtres -> GET /matches?minScore=... côté vraie API.
  const { items: matches, filters, setFilters, isLoading, error } =
    useResourceList(getMatches, {});

  const [contactingId, setContactingId] = useState(null);
  const [contactError, setContactError] = useState(null);

  async function handleContact(match) {
    setContactingId(match.id);
    setContactError(null);
    try {
      const conversation = await getOrCreateConversation(
        match.listingId,
        match.listing,
        match.counterpart
      );
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      setContactError(
        err.message || "Impossible de contacter cette correspondance pour le moment."
      );
    } finally {
      setContactingId(null);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaRobot color={colors.primary} />
            Matching IA
          </h1>

          <p style={{ marginTop: "8px", color: colors.textMuted }}>
            Les correspondances que notre agent IA a identifiées pour vos
            annonces, triées par score de pertinence.
          </p>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
          }}
        >
          Score minimum
          <select
            value={filters.minScore || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minScore: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${colors.border}`,
              fontSize: 14,
              backgroundColor: "#fff",
            }}
          >
            {SCORE_FIELD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {contactError && (
        <p
          style={{
            color: colors.danger,
            marginBottom: spacing.md,
            fontSize: 14,
          }}
        >
          {contactError}
        </p>
      )}

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={matches.length === 0}
        emptyLabel="Aucune correspondance trouvée pour le moment. Revenez plus tard : l'agent IA analyse en continu le catalogue."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.lg,
          }}
        >
          {matches.map((match) => {
            const isContacting = contactingId === match.id;

            return (
              <div
                key={match.id}
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                  boxShadow: shadow.card,
                }}
              >
                {/* HEADER : score + contrepartie + annonce concernée */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: spacing.md,
                    marginBottom: spacing.md,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: typography.fontSizeMd,
                      }}
                    >
                      {match.counterpart?.name || "Entreprise partenaire"}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: colors.textMuted,
                        fontSize: typography.fontSizeBase,
                      }}
                    >
                      {match.counterpart?.country && (
                        <>🌍 {match.counterpart.country} · </>
                      )}
                      Correspond à votre annonce «{" "}
                      {match.listing?.product || "Annonce"} »
                    </p>
                  </div>

                  {/* SCORE */}
                  <div style={{ textAlign: "right", minWidth: "160px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: 800,
                          color: scoreColor(match.matchScore),
                        }}
                      >
                        {match.matchScore}%
                      </span>
                      <span style={{ fontSize: 13, color: colors.textMuted }}>
                        de pertinence
                      </span>
                    </div>

                    <div
                      style={{
                        width: "160px",
                        height: "8px",
                        borderRadius: "999px",
                        backgroundColor: colors.neutralBg,
                        overflow: "hidden",
                        marginLeft: "auto",
                      }}
                    >
                      <div
                        style={{
                          width: `${match.matchScore}%`,
                          height: "100%",
                          backgroundColor: scoreColor(match.matchScore),
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* DETAIL : raisons du match */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: spacing.sm,
                    marginBottom: spacing.md,
                  }}
                >
                  {Object.entries(REASON_META).map(([key, meta]) => {
                    const reasonText = match.reasons?.[key];
                    if (!reasonText) return null;

                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          gap: 10,
                          padding: spacing.sm,
                          backgroundColor: colors.surface,
                          borderRadius: radius.sm,
                        }}
                      >
                        <div
                          style={{
                            color: colors.primary,
                            fontSize: 16,
                            marginTop: 2,
                          }}
                        >
                          {meta.icon}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 12,
                              fontWeight: 700,
                              color: colors.textMuted,
                              textTransform: "uppercase",
                              letterSpacing: "0.4px",
                            }}
                          >
                            {meta.label}
                          </p>
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: 13.5,
                              color: colors.textPrimary,
                            }}
                          >
                            {reasonText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ACTION : contacter cette correspondance */}
                <button
                  onClick={() => handleContact(match)}
                  disabled={isContacting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: radius.sm,
                    backgroundColor: colors.primary,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: typography.fontSizeSm,
                    cursor: isContacting ? "not-allowed" : "pointer",
                    opacity: isContacting ? 0.7 : 1,
                  }}
                >
                  <FaCommentDots />
                  {isContacting ? "Connexion..." : "Contacter"}
                </button>
              </div>
            );
          })}
        </div>
      </AsyncState>
    </div>
  );
}
