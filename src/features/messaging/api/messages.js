import { createResourceApi } from "../../../api/createResourceApi";
import { delay } from "../../../utils/delay";
import { mockConversations } from "../mocks/messages.mock";
// Couplage volontaire avec le module Facturation : chaque message envoyé
// consomme un crédit de conversation, et l'envoi est bloqué si le paywall
// est actif (plan gratuit + 50 messages déjà utilisés).
import { checkPaywallStatus, incrementUsage } from "../../billing/api/billing";

const CURRENT_USER_ID = "user_42";

const conversationsApi = createResourceApi("conversations", mockConversations);

export const getConversations = conversationsApi.getAll;
export const getConversationById = conversationsApi.getById;

export async function sendMessage(conversationId, text, attachment) {
  const { isBlocked } = await checkPaywallStatus();
  if (isBlocked) {
    throw new Error(
      "Limite de messages gratuits atteinte. Passez à un abonnement pour continuer à échanger."
    );
  }

  await delay(300);
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (!conversation) throw new Error("Conversation introuvable");

  const message = {
    id: `m-${Date.now()}`,
    senderId: CURRENT_USER_ID,
    text,
    sentAt: new Date().toISOString(),
    ...(attachment ? { attachment } : {}),
  };

  conversation.messages.push(message);
  conversation.updatedAt = message.sentAt;

  await incrementUsage();

  return message;
}

export async function updateConversationStatus(conversationId, status) {
  await delay(300);
  const conversation = mockConversations.find((c) => c.id === conversationId);
  if (!conversation) throw new Error("Conversation introuvable");
  conversation.status = status;
  return conversation;
}

export async function getOrCreateConversation(listingId, listing, counterpartInfo) {
  await delay(300);
  // Chercher si une conversation existe déjà pour ce listing
  let conversation = mockConversations.find((c) => c.listingId === listingId);
  
  if (!conversation) {
    // Créer une nouvelle conversation
    conversation = {
      id: `c-${Date.now()}`,
      listingId: listingId,
      listingProduct: listing?.product || "Annonce",
      counterpart: counterpartInfo || { name: "Vendeur", country: "Non spécifié" },
      status: "suggested",
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    mockConversations.push(conversation);
  }
  
  return conversation;
}

export { CURRENT_USER_ID };
