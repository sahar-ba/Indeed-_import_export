// Répertoire des informations "publiques" de compte, consultables par les
// autres utilisateurs (ex: avant de contacter le propriétaire d'une annonce).
// Clé = userId (correspond à `ownerId` sur les annonces).
export const mockAccounts = {
  user_42: {
    id: "user_42",
    role: "importer", // "importer" | "exporter"
    companyName: "Green Import Co.",
    country: "France",
    sector: "Agroalimentaire",
    certifications: ["ISO 22000"],
    memberSince: "2023",
    profileStatus: "validated",
  },
  user_88: {
    id: "user_88",
    role: "exporter",
    companyName: "Nile Cotton Trading",
    country: "Égypte",
    sector: "Textile",
    certifications: ["GOTS"],
    memberSince: "2021",
    profileStatus: "validated",
  },
};
