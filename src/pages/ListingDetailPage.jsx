import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../api/listings";
import { useResourceItem } from "../hooks/useResourceItem";
import { getOrCreateConversation } from "../features/messaging/api/messages";
import { getPublicAccount } from "../api/accounts";
import { useAuth } from "../context/AuthContext";
import {
  isListingFavorited,
  toggleFavorite,
} from "../api/favorites";
import AsyncState from "../components/organisms/AsyncState";
import DetailCard from "../components/molecules/DetailCard";

import {
  FaBox,
  FaDollarSign,
  FaGlobe,
  FaTruck,
  FaCalendarAlt,
  FaCertificate,
  FaHeart,
  FaRegHeart,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";

const ROLE_LABEL = {
  importer: "Importateur",
  exporter: "Exportateur",
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isContactingLoading, setIsContactingLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState(null);

const {
  item: listing,
  isLoading,
  error,
} = useResourceItem(
  getListingById,
  id
);

const { user } = useAuth();

const isMyListing =
  listing?.ownerId === user?.id;

  const [ownerAccount, setOwnerAccount] = useState(null);
  const [isOwnerAccountLoading, setIsOwnerAccountLoading] = useState(false);

  // Charge les infos publiques du compte (importateur/exportateur)
  // propriétaire de l'annonce, pour les afficher avant/pendant le contact.
  useEffect(() => {
    let isMounted = true;
    if (!listing?.ownerId || isMyListing) {
      setOwnerAccount(null);
      return;
    }

    setIsOwnerAccountLoading(true);
    getPublicAccount(listing.ownerId)
      .then((account) => {
        if (isMounted) setOwnerAccount(account);
      })
      .catch(() => {
        // Silencieux : l'absence d'infos de compte ne bloque pas le contact
      })
      .finally(() => {
        if (isMounted) setIsOwnerAccountLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [listing?.ownerId, isMyListing]);

  // Charge l'état favori courant dès que l'annonce est identifiée
  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    isListingFavorited(id)
      .then((value) => {
        if (isMounted) setIsFavorite(value);
      })
      .catch(() => {
        // Silencieux : l'absence de statut favori ne bloque pas l'affichage
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleToggleFavorite() {
    if (!listing) return;

    setIsFavoriteLoading(true);
    setFavoriteError(null);
    try {
      const result = await toggleFavorite(id, isFavorite);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      setFavoriteError(
        err.message || "Impossible de mettre à jour les favoris."
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  async function handleContact() {
    if (!listing) return;
    
    setIsContactingLoading(true);
    try {
      // Créer une conversation avec le vendeur, en utilisant les vraies
      // infos de son compte (nom d'entreprise, pays, rôle) quand elles sont
      // disponibles, plutôt qu'un libellé générique.
      const conversation = await getOrCreateConversation(
        id,
        listing,
        {
          name: ownerAccount?.companyName || "Vendeur",
          country: ownerAccount?.country || listing.country,
          role: ownerAccount?.role,
        }
      );
      
      // Naviguer vers la messagerie avec cette conversation
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      console.error("Erreur lors du contact:", err);
    } finally {
      setIsContactingLoading(false);
    }
  }

  function getDocumentTypeLabel(type) {
    const labels = {
      photo: "📸 Photo produit",
      technical_sheet: "📄 Fiche technique",
      certificate: "✅ Certification",
      lab_report: "🧪 Analyse laboratoire",
      brochure: "📚 Brochure commerciale",
      other: "📎 Autre document",
    };

    return labels[type] || "📎 Document";
  }

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* RETOUR */}

        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/listings");
            }
          }}
          style={{
            border: "none",
            background: "none",
            color: "#4f46e5",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "25px",
            padding: 0,
            fontSize: "16px",
          }}
        >
          ← Retour
        </button>

        <AsyncState
          isLoading={isLoading}
          error={error}
        >
          {listing && (
            <>
              {/* HEADER */}

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "35px",
                  marginBottom: "30px",
                  textAlign: "center",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.05)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <h1
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: "#0f172a",
                    marginBottom: "10px",
                  }}
                >
                  {listing.product}
                </h1>

                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  Détails de l'annonce
                </p>
              </div>

              {/* INFORMATIONS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                <DetailCard
                  icon={<FaBox />}
                  title="Quantité"
                  value={
                    listing.quantityUnit
                      ? `${listing.quantity} ${listing.quantityUnit}`
                      : listing.quantity
                  }
                />

                <DetailCard
                  icon={<FaDollarSign />}
                  title="Prix"
                  value={
                    listing.currency
                      ? `${listing.price} ${listing.currency}`
                      : listing.price
                  }
                />

                <DetailCard
                  icon={<FaGlobe />}
                  title="Pays"
                  value={listing.country}
                />

                <DetailCard
                  icon={<FaTruck />}
                  title="Incoterm"
                  value={listing.incoterm}
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  title="Délai"
                  value={listing.deadline}
                />

                <DetailCard
                  icon={<FaCertificate />}
                  title="Certifications"
                  value={
                    listing.certifications?.join(", ") ||
                    "Aucune"
                  }
                />
              </div>

              {/* DOCUMENTS */}

              {listing.attachments?.length > 0 && (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "24px",
                    padding: "30px",
                    marginTop: "24px",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "22px",
                      marginBottom: "20px",
                      color: "#0f172a",
                    }}
                  >
                    📎 Documents associés (
                    {listing.attachments.length})
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {listing.attachments.map(
                      (file, index) => (
                        <div
                          key={index}
                          style={{
                            border:
                              "1px solid #e2e8f0",
                            borderRadius:
                              "16px",
                            padding: "18px",
                            background:
                              "#f8fafc",
                          }}
                        >
                          {/* TYPE */}

                          <div
                            style={{
                              display:
                                "inline-block",
                              padding:
                                "6px 10px",
                              background:
                                "#eef2ff",
                              borderRadius:
                                "999px",
                              color:
                                "#4f46e5",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "12px",
                            }}
                          >
                            {getDocumentTypeLabel(
                              file.type
                            )}
                          </div>

                          {/* LABEL */}

                          <div
                            style={{
                              fontSize:
                                "18px",
                              fontWeight:
                                "700",
                              color:
                                "#0f172a",
                              marginBottom:
                                "8px",
                            }}
                          >
                            {file.label ||
                              file.name}
                          </div>

                          {/* NOM FICHIER */}

                          <div
                            style={{
                              color:
                                "#64748b",
                              fontSize:
                                "14px",
                              wordBreak:
                                "break-word",
                            }}
                          >
                            📄 {file.name}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* CONTACT */}

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  padding: "30px",
                  marginTop: "30px",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.05)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "20px",
                    color: "#0f172a",
                  }}
                >
                  🤝 Contacter le propriétaire
                </h2>

                <p
                  style={{
                    color: "#64748b",
                    marginBottom: "25px",
                  }}
                >
                  Intéressé par cette annonce ?
                  Contactez le vendeur pour obtenir
                  plus d'informations.
                </p>

                {!isMyListing && (isOwnerAccountLoading || ownerAccount) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 20px",
                      borderRadius: "16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      marginBottom: "25px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg,#4f46e5,#4338ca)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        flexShrink: 0,
                      }}
                    >
                      <FaBuilding />
                    </div>

                    {isOwnerAccountLoading ? (
                      <p style={{ margin: 0, color: "#64748b" }}>
                        Chargement des informations du compte...
                      </p>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "16px",
                              color: "#0f172a",
                            }}
                          >
                            {ownerAccount.companyName}
                          </strong>

                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "3px 10px",
                              borderRadius: "999px",
                              background: "#eef2ff",
                              color: "#4f46e5",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            <FaUserTie />
                            {ROLE_LABEL[ownerAccount.role] ||
                              ownerAccount.role}
                          </span>

                          {ownerAccount.profileStatus === "validated" && (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#16a34a",
                              }}
                            >
                              ✅ Profil validé
                            </span>
                          )}
                        </div>

                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#64748b",
                            fontSize: "14px",
                          }}
                        >
                          🌍 {ownerAccount.country}
                          {ownerAccount.sector && (
                            <> · {ownerAccount.sector}</>
                          )}
                          {ownerAccount.certifications?.length > 0 && (
                            <> · {ownerAccount.certifications.join(", ")}</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

<div
  style={{
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  }}
>
  {isMyListing ? (
    <>
      <button
        onClick={() =>
          navigate(
            `/listings/${listing.id}/edit`
          )
        }
        style={{
          padding: "14px 24px",
          border: "none",
          borderRadius: "12px",
          background: "#4f46e5",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        ✏️ Modifier l'annonce
      </button>
    </>
  ) : (
    <>
      <button
        onClick={handleContact}
        disabled={isContactingLoading}
        style={{
          padding: "14px 24px",
          border: "none",
          borderRadius: "12px",
          background: "#4f46e5",
          color: "white",
          fontWeight: "600",
          cursor: isContactingLoading
            ? "not-allowed"
            : "pointer",
          opacity:
            isContactingLoading
              ? 0.7
              : 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isContactingLoading
          ? "⏳ Connexion..."
          : "📩 Contacter le vendeur"}
      </button>

      <button
        onClick={handleToggleFavorite}
        disabled={isFavoriteLoading}
        style={{
          padding: "14px 24px",
          border: `1px solid ${
            isFavorite
              ? "#dc2626"
              : "#e2e8f0"
          }`,
          borderRadius: "12px",
          background: isFavorite
            ? "#fef2f2"
            : "#ffffff",
          color: isFavorite
            ? "#dc2626"
            : "#0f172a",
          fontWeight: "600",
          cursor:
            isFavoriteLoading
              ? "not-allowed"
              : "pointer",
          opacity:
            isFavoriteLoading
              ? 0.7
              : 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isFavorite ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}

        {isFavorite
          ? "Retirer des favoris"
          : "Ajouter aux favoris"}
      </button>
    </>
  )}
</div>

                {favoriteError && (
                  <p
                    style={{
                      color: "#dc2626",
                      marginTop: "12px",
                      fontSize: "14px",
                    }}
                  >
                    {favoriteError}
                  </p>
                )}
              </div>
            </>
          )}
        </AsyncState>
      </div>
    </div>
  );
}