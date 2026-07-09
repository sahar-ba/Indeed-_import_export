import { colors, radius, spacing, shadow } from "../../styles/tokens";

export default function Card({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.surfaceRaised,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        boxShadow: shadow.card,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.boxShadow = shadow.raised)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.boxShadow = shadow.card)}
    >
      {children}
    </div>
  );
}
