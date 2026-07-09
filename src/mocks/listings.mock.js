export const mockListings = [
  {
    id: "1",
    type: "offer",
    product: "Huile d'olive extra vierge",

    quantity: 5000,
    quantityUnit: "L",

    price: 3.2,
    currency: "USD",

    country: "Tunisie",
    category: "Agroalimentaire",

    incoterm: "FOB",

    deadline: "2026-09-15",

    certifications: [
      "Bio",
      "ISO 22000",
    ],

    ownerId: "user_42",

    status: "active",

    attachments: [
      {
        name: "certificat-bio.pdf",

        label:
          "Certification Bio UE 2026",

        type: "certificate",
      },

      {
        name: "fiche-technique.pdf",

        label:
          "Fiche technique Huile d'olive extra vierge",

        type: "technical_sheet",
      },

      {
        name: "photo-produit.jpg",

        label:
          "Photo bouteille huile d'olive",

        type: "photo",
      },
    ],
  },

  {
    id: "2",

    type: "demand",

    product:
      "Panneaux solaires monocristallins",

    quantity: 2000,
    quantityUnit: "piece",

    price: 150000,
    currency: "USD",

    country: "Maroc",

    category: "Industrie",

    incoterm: "CIF",

    deadline: "2026-08-01",

    certifications: ["CE"],

    ownerId: "user_42",

    status: "active",

    attachments: [
      {
        name: "cahier-des-charges.pdf",

        label:
          "Cahier des charges du projet",

        type: "technical_sheet",
      },
    ],
  },

  {
    id: "3",

    type: "offer",

    product:
      "Textile coton bio",

    quantity: 10,
    quantityUnit: "tonne",

    price: 4.8,
    currency: "USD",

    country: "Égypte",

    category: "Textile",

    incoterm: "EXW",

    deadline: "2026-10-01",

    certifications: ["GOTS"],

    ownerId: "user_88",

    status: "active",

    attachments: [
      
    ],
  },
];

export const mockMatches = [
  {
    id: "m1",

    listingId: "1",

    matchScore: 87,

    reasons: {
      product:
        "Correspondance exacte de catégorie",

      price:
        "Dans la fourchette budgétaire",

      location:
        "Proximité logistique favorable",

      reliability:
        "Fournisseur certifié depuis 3 ans",

      deadline:
        "Délai compatible",
    },

    counterpart: {
      name: "Green Import Co.",
      country: "France",
    },
  },
];