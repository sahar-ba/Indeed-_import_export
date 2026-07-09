import { useState, useMemo } from "react";
import FilterBar from "../components/organisms/FilterBar";
import { Link } from "react-router-dom";
import { useResourceList } from "../hooks/useResourceList";
import { getMyListings, updateListing } from "../api/listings";
import AsyncState from "../components/organisms/AsyncState";
import StatusBadge from "../components/molecules/StatusBadge";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../styles/tokens";
const TYPE_FIELD = {
  name: "type",
  placeholder: "Tous les types",
  options: [
    { value: "offer", label: "Offres" },
    { value: "demand", label: "Demandes" },
  ],
};

const STATUS_FIELD = {
  name: "status",
  placeholder: "Tous les statuts",
  options: [
    { value: "active", label: "Actives" },
    { value: "suspended", label: "Suspendues" },
    { value: "closed", label: "Clôturées" },
  ],
};

const COUNTRY_FIELD = {
  name: "country",
  placeholder: "Tous les pays",
  options: [
  { value: "Tunisie", label: "🇹🇳 Tunisie" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Italie", label: "🇮🇹 Italie" },
  { value: "Espagne", label: "🇪🇸 Espagne" },
  { value: "Allemagne", label: "🇩🇪 Allemagne" },
  { value: "Belgique", label: "🇧🇪 Belgique" },
  { value: "Pays-Bas", label: "🇳🇱 Pays-Bas" },
  { value: "Maroc", label: "🇲🇦 Maroc" },
  { value: "Algérie", label: "🇩🇿 Algérie" },
  { value: "Égypte", label: "🇪🇬 Égypte" },
  { value: "Turquie", label: "🇹🇷 Turquie" },
  { value: "Chine", label: "🇨🇳 Chine" },
  { value: "Inde", label: "🇮🇳 Inde" },
  { value: "États-Unis", label: "🇺🇸 États-Unis" },
  { value: "Canada", label: "🇨🇦 Canada" },
  ],
};

const CATEGORY_FIELD = {
  name: "category",
  placeholder: "Toutes les catégories",
  options: [
    { value: "Agroalimentaire", label: "Agroalimentaire" },
    { value: "Énergie", label: "Énergie" },
    { value: "Textile", label: "Textile" },
    { value: "Électronique", label: "Électronique" },
    { value: "Automobile", label: "Automobile" },
    { value: "Cosmétique", label: "Cosmétique" },
    { value: "Construction", label: "Construction" },
    { value: "Machines industrielles", label: "Machines industrielles" },
    { value: "Emballage & Logistique", label: "Emballage & Logistique" },
  ],
};
export default function MyListingsPage() {
  const {
    items,
    isLoading,
    error,
    refetch,
  } = useResourceList(getMyListings);

  const [pendingId, setPendingId] =
    useState(null);

  const [confirmCloseId, setConfirmCloseId] =
    useState(null);
const [filters, setFilters] = useState({});
  async function handleStatusChange(
    id,
    status
  ) {
    setPendingId(id);

    try {
      await updateListing(id, {
        status,
      });

      await refetch();
    } finally {
      setPendingId(null);
    }
  }
const filterFields = useMemo(
  () => [
    TYPE_FIELD,
    COUNTRY_FIELD,
    CATEGORY_FIELD,
  ],
  []
);

const filteredItems = items.filter(
  (listing) =>
    (!filters.type ||
      listing.type === filters.type) &&
    (!filters.status ||
      listing.status === filters.status) &&
    (!filters.country ||
      listing.country === filters.country) &&
    (!filters.category ||
      listing.category === filters.category)
);
  return (
    <>
      <div>
<div
  style={{
    marginBottom: spacing.xl,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
      flexWrap: "wrap",
      gap: "16px",
    }}
  >
    <div>
      <h1
        style={{
          margin: 0,
          fontSize: "38px",
          fontWeight: "800",
        }}
      >
        Mes annonces
      </h1>

      <p
        style={{
          marginTop: "8px",
          color: colors.textMuted,
        }}
      >
        Gérez et suivez toutes vos annonces.
      </p>
    </div>

    <Link to="/listings/create">
      <button
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "14px",
          backgroundColor: colors.primary,
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow:
            "0 8px 20px rgba(79,70,229,.25)",
        }}
      >
        + Nouvelle annonce
      </button>
    </Link>
  </div>

  {/* <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "20px",
      border: `1px solid ${colors.border}`,
      boxShadow: shadow.card,
    }}
  > */}
    <FilterBar
      fields={filterFields}
      filters={filters}
      onChange={setFilters}
    />
  {/* </div> */}
</div>

        <AsyncState
          isLoading={isLoading}
          error={error}
          isEmpty={filteredItems.length === 0}
          emptyLabel="Vous n'avez pas encore publié d'annonce."
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            {filteredItems.map((listing) => {
              const isPending =
                pendingId === listing.id;

              return (
                <div
                  key={listing.id}
                  style={{
                    backgroundColor:
                      "#fff",
                    border: `1px solid ${colors.border}`,
                    borderRadius:
                      radius.md,
                    padding:
                      spacing.lg,
                    boxShadow:
                      shadow.card,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display:
                            "flex",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <StatusBadge
                          status={
                            listing.type
                          }
                        />

                        <StatusBadge
                          status={
                            listing.status
                          }
                        />
                      </div>

                      <h3
                        style={{
                          fontSize:
                            typography.fontSizeMd,
                          margin: 0,
                        }}
                      >
                        {listing.product}
                      </h3>

                      <p
                        style={{
                          color:
                            colors.textMuted,
                          fontSize:
                            typography.fontSizeBase,
                          margin:
                            "4px 0 0",
                        }}
                      >
                        {
                          listing.quantity
                        }{" "}
                        ·{" "}
                        {listing.price}{" "}
                        ·{" "}
                        {
                          listing.country
                        }
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap:
                        spacing.sm,
                      flexWrap:
                        "wrap",
                      marginTop:
                        spacing.md,
                    }}
                  >
                    <Link
                      to={`/listings/${listing.id}`}
                    >
                      <ActionButton>
                        Voir
                      </ActionButton>
                    </Link>

                    <Link
                      to={`/listings/${listing.id}/edit`}
                    >
                      <ActionButton>
                        Modifier
                      </ActionButton>
                    </Link>

                    {listing.status !==
                      "closed" && (
                      <ActionButton
                        disabled={
                          isPending
                        }
                        onClick={() =>
                          handleStatusChange(
                            listing.id,
                            listing.status ===
                              "suspended"
                              ? "active"
                              : "suspended"
                          )
                        }
                      >
                        {listing.status ===
                        "suspended"
                          ? "Réactiver"
                          : "Suspendre"}
                      </ActionButton>
                    )}

                    {listing.status !==
                      "closed" && (
                      <ActionButton
                        variant="danger"
                        disabled={
                          isPending
                        }
                        onClick={() =>
                          setConfirmCloseId(
                            listing.id
                          )
                        }
                      >
                        Clôturer
                      </ActionButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AsyncState>
      </div>

      {/* POPUP CONFIRMATION */}

      {confirmCloseId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "420px",
              maxWidth: "90%",
              borderRadius: "20px",
              padding: "28px",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#111827",
              }}
            >
              ⚠️ Clôturer l'annonce ?
            </h3>

            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: "24px",
              }}
            >
              Cette action rendra
              l'annonce clôturée.
              Elle ne sera plus
              affichée comme active.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setConfirmCloseId(
                    null
                  )
                }
                style={{
                  padding:
                    "10px 16px",
                  border:
                    "1px solid #d1d5db",
                  borderRadius:
                    "10px",
                  background:
                    "#fff",
                  cursor:
                    "pointer",
                  fontWeight: 600,
                }}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={async () => {
                  await handleStatusChange(
                    confirmCloseId,
                    "closed"
                  );

                  setConfirmCloseId(
                    null
                  );
                }}
                style={{
                  padding:
                    "10px 16px",
                  border: "none",
                  borderRadius:
                    "10px",
                  background:
                    "#dc2626",
                  color: "#fff",
                  cursor:
                    "pointer",
                  fontWeight: 600,
                }}
              >
                Oui, clôturer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "default",
}) {
  const isDanger =
    variant === "danger";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      style={{
        padding: "7px 14px",
        borderRadius: radius.sm,
        border: `1px solid ${
          isDanger
            ? colors.danger
            : colors.border
        }`,
        backgroundColor: "#fff",
        color: isDanger
          ? colors.danger
          : colors.textPrimary,
        fontSize:
          typography.fontSizeSm,
        fontWeight: 600,
        cursor: disabled
          ? "not-allowed"
          : "pointer",
        opacity: disabled
          ? 0.6
          : 1,
      }}
    >
      {children}
    </button>
  );
}