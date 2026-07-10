import apiClient, { USE_MOCKS } from "../../../api/client";

/**
 * Contrat attendu du backend réel (Stagiaire 2) pour Stripe :
 * POST /payments/create-intent { planId } -> { clientSecret }
 *
 * Le PaymentIntent DOIT être créé côté serveur (avec la clé secrète
 * Stripe, sk_...) — c'est une règle de sécurité Stripe non négociable,
 * la clé secrète ne doit jamais transiter côté frontend.
 *
 * Tant qu'aucun backend n'est branché (USE_MOCKS = true), cette fonction
 * ne renvoie rien : StripeCardForm sait qu'il doit se rabattre sur la
 * tokenisation seule (stripe.createPaymentMethod) pour tester
 * l'intégration Elements sans confirmation serveur.
 */
export async function createPaymentIntent(planId) {
  if (USE_MOCKS) {
    return null;
  }

  const { data } = await apiClient.post("/payments/create-intent", { planId });
  return data;
}
