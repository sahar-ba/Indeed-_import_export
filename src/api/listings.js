import { createResourceApi } from "./createResourceApi";
import { delay } from "../utils/delay";
import { mockListings } from "../mocks/listings.mock";

const CURRENT_USER_ID = "user_42";

function filterMock(data, { country, category, type } = {}) {
  return data
    .filter((l) => l.status !== "suspended" && l.status !== "closed")
    .filter(
      (l) =>
        (!country || l.country === country) &&
        (!category || l.category === category) &&
        (!type || l.type === type)
    );
}

const listingsApi = createResourceApi("listings", mockListings, { filterMock });

// Alias explicites pour un code appelant plus lisible dans les pages
export const getListings = listingsApi.getAll;
export const getListingById = listingsApi.getById;

export async function createListing(payload) {
  const created = await listingsApi.create({
    ...payload,
    ownerId: CURRENT_USER_ID,
    status: "active",
  });
  // Garde les mocks en mémoire synchronisés pour que "Mes annonces" et
  // le catalogue reflètent immédiatement la nouvelle annonce.
  mockListings.push(created);
  return created;
}

export async function updateListing(id, payload) {
  await delay(300);
  const index = mockListings.findIndex((l) => l.id === id);
  if (index === -1) throw new Error("Annonce introuvable");
  mockListings[index] = { ...mockListings[index], ...payload };
  return mockListings[index];
}

// Toutes les annonces du propriétaire, quel que soit leur statut
// (contrairement au catalogue public qui masque suspendues/clôturées).
export async function getMyListings() {
  await delay(300);
  return mockListings.filter((l) => l.ownerId === CURRENT_USER_ID);
}
