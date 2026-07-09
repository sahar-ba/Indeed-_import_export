import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useResourceList } from "../hooks/useResourceList";
import { getListings } from "../api/listings";
import { useAuth } from "../context/AuthContext";
import FilterBar from "../components/organisms/FilterBar";
import ListingCard from "../components/organisms/ListingCard";
import AsyncState from "../components/organisms/AsyncState";
import { colors } from "../styles/tokens";

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

const TYPE_FIELD = {
  name: "type",
  placeholder: "Tous types",
  options: [
    { value: "offer", label: "Offres" },
    { value: "demand", label: "Demandes" },
  ],
};

export default function ListingsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || undefined;

  // Un importateur cherche des OFFRES (ce que proposent les exportateurs).
  // Un exportateur cherche des DEMANDES (ce que veulent les importateurs).
  const forcedType = user?.role === "importer" ? "offer" : user?.role === "exporter" ? "demand" : undefined;

  const fields = useMemo(
    () => (forcedType ? [COUNTRY_FIELD, CATEGORY_FIELD] : [TYPE_FIELD, COUNTRY_FIELD, CATEGORY_FIELD]),
    [forcedType]
  );

  const { items: allItems, filters, setFilters, isLoading, error } = useResourceList(getListings, {
    ...(forcedType ? { type: forcedType } : {}),
    ...(categoryFromUrl ? { category: categoryFromUrl } : {}),
  });

  // On ne montre jamais ses propres annonces dans le catalogue : c'est un
  // catalogue pour trouver des correspondances chez d'autres entreprises.
  const items = user ? allItems.filter((listing) => listing.ownerId !== user.id) : allItems;

  return (
    <div>
      <h1 style={{ marginBottom: 10 }}>
        Catalogue des annonces
      </h1>
      {forcedType && (
        <p style={{ color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: 16 }}>
          Affichage des {forcedType === "offer" ? "offres" : "demandes"} correspondant à votre profil.
        </p>
      )}

      <FilterBar fields={fields} filters={filters} onChange={setFilters} />

      <AsyncState
        isLoading={isLoading}
        error={error}
        isEmpty={items.length === 0}
        emptyLabel="Aucune annonce ne correspond à ces filtres."
      >
        {items.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </AsyncState>
    </div>
  );
}
