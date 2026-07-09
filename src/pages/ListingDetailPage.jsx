import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById } from "../api/listings";
import { useResourceItem } from "../hooks/useResourceItem";
import { getOrCreateConversation } from "../features/messaging/api/messages";
import AsyncState from "../components/organisms/AsyncState";
import DetailCard from "../components/molecules/DetailCard";

import {
  FaBox,
  FaDollarSign,
  FaGlobe,
  FaTruck,
  FaCalendarAlt,
  FaCertificate,
} from "react-icons/fa";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isContactingLoading, setIsContactingLoading] = useState(false);

  const {
    item: listing,
    isLoading,
    error,
  } = useResourceItem(getListingById, id);

  async function handleContact() {
    if (!listing) return;
    
    setIsContactingLoading(true);
    try {
      // Créer une conversation avec le vendeur
      const conversation = await getOrCreateConversation(
        id,
        listing,
        { name: "Vendeur", country: listing.country }
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
                    cursor: isContactingLoading ? "not-allowed" : "pointer",
                    opacity: isContactingLoading ? 0.7 : 1,
                  }}
                >
                  {isContactingLoading ? "⏳ Connexion..." : "📩 Envoyer un message"}
                </button>
              </div>
            </>
          )}
        </AsyncState>
      </div>
    </div>
  );
}