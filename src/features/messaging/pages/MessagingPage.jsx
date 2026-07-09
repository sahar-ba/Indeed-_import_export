import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Paperclip, Send, ArrowLeft, Lock } from "lucide-react";
import { useResourceList } from "../../../hooks/useResourceList";
import {
  getConversations,
  getConversationById,
  sendMessage,
  updateConversationStatus,
  CURRENT_USER_ID,
} from "../api/messages";
import { checkPaywallStatus } from "../../billing/api/billing";
import StatusBadge from "../../../components/molecules/StatusBadge";
import AsyncState from "../../../components/organisms/AsyncState";

const STATUS_FLOW = ["suggested", "in_contact", "negotiating", "concluded"];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: conversations, isLoading, error, refetch } = useResourceList(getConversations);

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  const selected = sorted.find((c) => c.id === id) || null;

  return (
    <>
      {/* Liste des conversations - Sidebar gauche */}
      <div
        style={{
          width: "300px",
          backgroundColor: "white",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>
            Conversations
          </h2>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>
            {sorted.length} conversation{sorted.length > 1 ? "s" : ""}
          </p>
        </div>

        <AsyncState
          isLoading={isLoading}
          error={error}
          isEmpty={sorted.length === 0}
          emptyLabel="Aucune conversation pour l'instant."
        >
          <div style={{ flex: 1, overflowY: "auto" }}>
            {sorted.map((conv) => {
              const isActive = conv.id === id;
              const lastMessage = conv.messages[conv.messages.length - 1];
              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/messages/${conv.id}`)}
                  style={{
                    display: "flex",
                    gap: 12,
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 12px",
                    border: "none",
                    backgroundColor: isActive ? "#eef2ff" : "transparent",
                    borderLeft: isActive ? "4px solid #4f46e5" : "4px solid transparent",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#c7d2fe",
                      color: "#3730a3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {initials(conv.counterpart.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.counterpart.name}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 6px",
                        fontSize: 11,
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.listingProduct}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 11,
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {lastMessage ? lastMessage.text : "Aucun message"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </AsyncState>
      </div>

      {/* Fil de discussion - Zone principale */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        {!selected ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            Sélectionnez une conversation pour commencer
          </div>
        ) : (
          <ConversationThread key={selected.id} conversation={selected} onRefetch={refetch} />
        )}
      </div>
    </>
  );
}

function ConversationThread({ conversation, onRefetch }) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [sendError, setSendError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkPaywallStatus().then(({ isBlocked }) => setIsBlocked(isBlocked));
  }, [conversation.id]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() && !attachment) return;
    setIsSending(true);
    setSendError(null);
    try {
      await sendMessage(conversation.id, text.trim(), attachment);
      setText("");
      setAttachment(null);
      await onRefetch();
    } catch (err) {
      setSendError(err.message);
      setIsBlocked(true);
    } finally {
      setIsSending(false);
    }
  }

  async function handleStatusChange(status) {
    await updateConversationStatus(conversation.id, status);
    await onRefetch();
  }

  const currentStepIndex = STATUS_FLOW.indexOf(conversation.status);

  return (
    <>
      {/* En-tête */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>
              {conversation.counterpart.name}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              {conversation.listingProduct} · {conversation.counterpart.country}
            </p>
          </div>
        </div>

        {/* Contrôle du statut de mise en relation */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          {conversation.status === "rejected" || conversation.status === "concluded" ? (
            <StatusBadge status={conversation.status} />
          ) : (
            <>
              {currentStepIndex >= 0 && currentStepIndex < STATUS_FLOW.length - 1 && (
                <button
                  onClick={() => handleStatusChange(STATUS_FLOW[currentStepIndex + 1])}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: "1px solid #4f46e5",
                    backgroundColor: "#eef2ff",
                    color: "#4f46e5",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Passer à « {statusLabel(STATUS_FLOW[currentStepIndex + 1])} »
                </button>
              )}
              <button
                onClick={() => handleStatusChange("rejected")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid #fecaca",
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Rejeter
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {conversation.messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", marginTop: 40 }}>
            Aucun message. Lancez la conversation !
          </p>
        )}
        {conversation.messages.map((msg) => {
          const isMine = msg.senderId === CURRENT_USER_ID;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 16,
                  borderBottomRightRadius: isMine ? 4 : 16,
                  borderBottomLeftRadius: isMine ? 16 : 4,
                  backgroundColor: isMine ? "#4f46e5" : "#f3f4f6",
                  color: isMine ? "#fff" : "#111827",
                  fontSize: 14,
                  lineHeight: 1.4,
                }}
              >
                {msg.text}
                {msg.attachment && (
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 10px",
                      borderRadius: 10,
                      backgroundColor: isMine ? "rgba(255,255,255,0.15)" : "#e5e7eb",
                      fontSize: 12,
                    }}
                  >
                    <Paperclip size={13} />
                    {msg.attachment.name}
                  </div>
                )}
              </div>
              <p
                style={{
                  margin: "4px 4px 0",
                  fontSize: 11,
                  color: "#9ca3af",
                  textAlign: isMine ? "right" : "left",
                }}
              >
                {formatTime(msg.sentAt)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Composeur */}
      {isBlocked ? (
        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            backgroundColor: "#fffbeb",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lock size={18} color="#b45309" />
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#92400e" }}>
                Limite de 50 messages gratuits atteinte
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
                {sendError || "Passez à un abonnement ou au paiement à l'usage pour continuer à échanger."}
              </p>
            </div>
          </div>
          <Link to="/billing/plans">
            <button
              type="button"
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: 10,
                background: "linear-gradient(135deg,#4f46e5,#4338ca)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Voir les offres
            </button>
          </Link>
        </div>
      ) : (
      <form
        onSubmit={handleSend}
        style={{
          borderTop: "1px solid #f1f5f9",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {attachment && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#4f46e5",
              backgroundColor: "#eef2ff",
              padding: "6px 10px",
              borderRadius: 8,
              width: "fit-content",
            }}
          >
            <Paperclip size={12} />
            {attachment.name}
            <button
              type="button"
              onClick={() => setAttachment(null)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#4f46e5", fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              borderRadius: 12,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
            aria-label="Joindre un document"
          >
            <Paperclip size={17} color="#6b7280" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => e.target.files?.[0] && setAttachment({ name: e.target.files[0].name })}
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez votre message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={isSending || (!text.trim() && !attachment)}
            style={{
              border: "none",
              borderRadius: 12,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#4f46e5,#4338ca)",
              cursor: isSending ? "default" : "pointer",
              opacity: isSending || (!text.trim() && !attachment) ? 0.5 : 1,
              flexShrink: 0,
            }}
            aria-label="Envoyer"
          >
            <Send size={17} color="#fff" />
          </button>
        </div>
      </form>
      )}
    </>
  );
}

function statusLabel(status) {
  const labels = {
    suggested: "Suggérée",
    in_contact: "En contact",
    negotiating: "En négociation",
    concluded: "Conclue",
  };
  return labels[status] || status;
}
