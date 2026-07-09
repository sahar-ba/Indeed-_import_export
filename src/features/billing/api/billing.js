import { createResourceApi } from "../../../api/createResourceApi";
import { delay } from "../../../utils/delay";
import {
  mockInvoices,
  mockSubscription,
  mockPaymentMethods,
  mockUsage,
  mockPlans,
} from "../mocks/billing.mock";

// Ressource générique "factures" — réutilise le même client CRUD mocké/réel
// que les autres modules (annonces, conversations...).
const invoicesApi = createResourceApi("invoices", mockInvoices);

export const getInvoices = invoicesApi.getAll;
export const getInvoiceById = invoicesApi.getById;

// L'abonnement et les moyens de paiement ne rentrent pas dans le CRUD
// générique (un seul abonnement actif, opérations dédiées type "annuler",
// "changer de plan", "définir par défaut"), donc fonctions spécifiques ici —
// même schéma que sendMessage/updateConversationStatus dans api/messages.js.

export async function getUsage() {
  await delay(150);
  return mockUsage;
}

// Consomme un crédit de message — appelé à chaque envoi de message réussi.
// Ne fait rien si l'utilisateur a un abonnement actif illimité (Premium).
export async function incrementUsage() {
  await delay(100);
  if (mockSubscription.planId !== "premium" || mockSubscription.status !== "active") {
    mockUsage.usedChats += 1;
  }
  return mockUsage;
}

// Un seul point de vérité pour savoir si l'envoi de messages doit être
// bloqué : plan gratuit + crédits épuisés + pas d'abonnement payant actif.
export async function checkPaywallStatus() {
  await delay(100);
  const hasUnlimitedPlan = mockSubscription.planId === "premium" && mockSubscription.status === "active";
  const isPayPerUse = mockSubscription.planId === "pay-per-use";
  const isBlocked = !hasUnlimitedPlan && !isPayPerUse && mockUsage.usedChats >= mockUsage.maxChats;
  return {
    isBlocked,
    usage: mockUsage,
  };
}

// Notification intelligente : si le coût cumulé du paiement à l'usage
// dépasse le prix de l'abonnement Premium, on le signale à l'utilisateur.
export async function getSmartRecommendation() {
  await delay(100);
  const payPerUsePlan = mockPlans.find((p) => p.id === "pay-per-use");
  const premiumPlan = mockPlans.find((p) => p.id === "premium");
  if (!payPerUsePlan || !premiumPlan) return null;

  const estimatedPayPerUseCost = mockUsage.usedChats * payPerUsePlan.priceValue;
  const isPremiumCheaper = estimatedPayPerUseCost > premiumPlan.priceValue;
  const isRelevant = mockSubscription.planId !== "premium" || mockSubscription.status !== "active";

  if (!isPremiumCheaper || !isRelevant) return null;

  return {
    estimatedPayPerUseCost,
    premiumPrice: premiumPlan.priceValue,
    savings: estimatedPayPerUseCost - premiumPlan.priceValue,
    messageCount: mockUsage.usedChats,
  };
}

export async function getSubscription() {
  await delay(250);
  return mockSubscription;
}

export async function cancelSubscription() {
  await delay(400);
  mockSubscription.status = "canceled";
  return mockSubscription;
}

export async function changePlan(planId) {
  await delay(400);
  const plan = mockPlans.find((p) => p.id === planId);
  if (!plan) throw new Error("Offre introuvable");
  mockSubscription.planId = plan.id;
  mockSubscription.planTitle = plan.title;
  mockSubscription.price = plan.price;
  mockSubscription.status = "active";
  // Une fois un plan utilisé, il ne doit plus jamais être proposable à
  // nouveau (ex: le plan Gratuit ne doit apparaître qu'une seule fois).
  if (!mockSubscription.usedPlanIds.includes(plan.id)) {
    mockSubscription.usedPlanIds.push(plan.id);
  }
  return mockSubscription;
}

export async function getPaymentMethods() {
  await delay(250);
  return mockPaymentMethods;
}

export async function addPaymentMethod(method) {
  await delay(400);
  const newMethod = { ...method, id: `pm-${Date.now()}`, isDefault: false };
  mockPaymentMethods.push(newMethod);
  return newMethod;
}

export async function removePaymentMethod(id) {
  await delay(300);
  const index = mockPaymentMethods.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Moyen de paiement introuvable");
  mockPaymentMethods.splice(index, 1);
  return { success: true };
}

export async function setDefaultPaymentMethod(id) {
  await delay(300);
  mockPaymentMethods.forEach((m) => {
    m.isDefault = m.id === id;
  });
  mockSubscription.defaultPaymentMethodId = id;
  return mockPaymentMethods;
}
