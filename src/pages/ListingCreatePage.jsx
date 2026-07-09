import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import FormField from "../components/molecules/FormField";
import Select from "../components/atoms/Select";
import ErrorMessage from "../components/atoms/ErrorMessage";
import SectionCard from "../components/molecules/SectionCard";
import FileDropzone from "../components/molecules/FileDropzone";
import { createListing, updateListing, getListingById } from "../api/listings";

const TYPE_OPTIONS = [
  { value: "offer", label: "🚢 Offre (j'exporte)" },
  { value: "demand", label: "📦 Demande (j'importe)" },
];

const INCOTERM_OPTIONS = [
  { value: "EXW", label: "EXW" },
  { value: "FOB", label: "FOB" },
  { value: "CIF", label: "CIF" },
];

const QUANTITY_UNIT_OPTIONS = [
  { value: "kg", label: "Kg" },
  { value: "g", label: "g" },
  { value: "tonne", label: "Tonne" },
  { value: "L", label: "Litre" },
  { value: "m3", label: "m³" },
  { value: "piece", label: "Pièce" },
];

const CURRENCY_OPTIONS = [
  { value: "TND", label: "🇹🇳 TND" },
  { value: "EUR", label: "🇪🇺 EUR" },
  { value: "USD", label: "🇺🇸 USD" },
  { value: "GBP", label: "🇬🇧 GBP" },
];

const CATEGORY_OPTIONS = [
 { value: "Agroalimentaire", label: "Agroalimentaire" },
    { value: "Énergie", label: "Énergie" },
    { value: "Textile", label: "Textile" },
    { value: "Électronique", label: "Électronique" },
    { value: "Automobile", label: "Automobile" },
    { value: "Cosmétique", label: "Cosmétique" },
    { value: "Construction", label: "Construction" },
    { value: "Machines industrielles", label: "Machines industrielles" },
    { value: "Emballage & Logistique", label: "Emballage & Logistique" },
];

const COUNTRY_OPTIONS = [
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
];

export default function ListingCreatePage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [submitError, setSubmitError] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isLoadingListing, setIsLoadingListing] = useState(false);

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // En mode édition, on charge l'annonce existante et on préremplit le formulaire
  useEffect(() => {
    if (!isEditMode) return;
    setIsLoadingListing(true);
    getListingById(id)
      .then((listing) => {
        reset({
          type: listing.type,
          product: listing.product,
          quantity: listing.quantity,
          quantityUnit: listing.quantityUnit,
          category: listing.category,
          price: listing.price,
          currency: listing.currency,
          incoterm: listing.incoterm,
          country: listing.country,
          deadline: listing.deadline,
          certifications: listing.certifications?.join(", ") || "",
        });
        setAttachments(listing.attachments || []);
      })
      .finally(() => setIsLoadingListing(false));
  }, [id, isEditMode, reset]);

async function onSubmit(data) {
  setSubmitError(null);

  if (!data.quantityUnit) {
    setSubmitError(
      "Veuillez sélectionner une unité."
    );
    return;
  }

    if (!data.incoterm) {
    setSubmitError(
      "Veuillez sélectionner un terme d'incoterm."
    );
    return;
  }

  if (!data.currency) {
    setSubmitError(
      "Veuillez sélectionner une devise."
    );
    return;
  }

  try {
    const payload = {
      ...data,
      certifications: data.certifications
        ? data.certifications
            .split(",")
            .map((c) => c.trim())
        : [],
      attachments,
    };

    if (isEditMode) {
      await updateListing(id, payload);
    } else {
      await createListing(payload);
    }

    navigate("/listings/mine");
  } catch (err) {
    setSubmitError(
      err.message ||
        "Erreur lors de l'enregistrement de l'annonce"
    );
  }
}

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  };

  const sectionTitleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "24px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
            }}
          >
            📦
          </div>

          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "10px",
            }}
          >
            {isEditMode ? "Modifier l'annonce" : "Publier une annonce"}
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            {isEditMode
              ? "Mettez à jour les informations de votre annonce"
              : "Créez rapidement une offre ou une demande"}
          </p>
        </div>

        {isLoadingListing ? (
          <p style={{ textAlign: "center", color: "#6b7280" }}>Chargement de l'annonce...</p>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* SECTION PRODUIT */}

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              📦 Informations produit
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Type d'annonce
              </label>

              <Select
                options={TYPE_OPTIONS}
                placeholder="Choisir un type"
                value={watch("type")}
                onChange={(value) =>
                  setValue("type", value)
                }
              />
            </div>

            <FormField
              label="Produit"
              name="product"
              register={register}
              rules={{
                required: "Produit requis",
              }}
              error={errors.product}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr",
                gap: "15px",
              }}
            >
              <FormField
                label="Quantité"
                name="quantity"
                register={register}
                rules={{
                  required: "Quantité requise",
                }}
                error={errors.quantity}
              />

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  Unité
                </label>

                <Select
                  options={QUANTITY_UNIT_OPTIONS}
                  placeholder="Unité"
                  value={watch("quantityUnit")}
                  onChange={(value) =>
                    setValue(
                      "quantityUnit",
                      value
                    )
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Catégorie
              </label>

              <Select
                options={CATEGORY_OPTIONS}
                placeholder="Choisir une catégorie"
                value={watch("category")}
                onChange={(value) =>
                  setValue("category", value)
                }
              />
            </div>
          </div>

          {/* SECTION COMMERCIALE */}

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              💰 Conditions commerciales
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr",
                gap: "15px",
              }}
            >
              <FormField
                label="Prix"
                name="price"
                register={register}
                rules={{
                  required: "Prix requis",
                }}
                error={errors.price}
              />

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}  
                >
                  Devise
                </label>

                <Select
                  options={CURRENCY_OPTIONS}
                  placeholder="Devise"
                  value={watch("currency")}
                  onChange={(value) =>
                    setValue(
                      "currency",
                      value
                    )
                  }
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Incoterm
              </label>

              <Select
                options={INCOTERM_OPTIONS}
                placeholder="Choisir un incoterm"
                value={watch("incoterm")}
                onChange={(value) =>
                  setValue("incoterm", value)
                }
              />
            </div>
          </div>

          {/* SECTION LOGISTIQUE */}

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              🚚 Logistique & conformité
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Pays
              </label>

              <Select
                options={COUNTRY_OPTIONS}
                placeholder="Choisir un pays"
                value={watch("country")}
                onChange={(value) =>
                  setValue("country", value)
                }
              />
            </div>

            <FormField
              label="Délai (date)"
              name="deadline"
              type="date"
              register={register}
              error={errors.deadline}
            />

            <FormField
              label="Certifications (séparées par des virgules)"
              name="certifications"
              register={register}
              error={errors.certifications}
            />
          </div>

          {/* SECTION PIÈCES JOINTES */}

          <SectionCard title="📎 Pièces jointes">
            <FileDropzone files={attachments} onChange={setAttachments} />
          </SectionCard>

          {/* ERREUR */}
          <ErrorMessage>
            {submitError}
          </ErrorMessage>

          {/* BOUTON */}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg,#4f46e5,#4338ca)",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow:
                "0 12px 30px rgba(79,70,229,0.25)",
            }}
          >
            {isEditMode ? "💾 Enregistrer les modifications" : "🚀 Publier l'annonce"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
