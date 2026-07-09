import { colors, radius, spacing, typography } from "../../styles/tokens";

const variants = {
  primary: { backgroundColor: colors.primary, color: "#fff", border: "1px solid transparent" },
  secondary: { backgroundColor: "#fff", color: colors.textPrimary, border: `1px solid ${colors.border}` },
  danger: { backgroundColor: colors.danger, color: "#fff", border: "1px solid transparent" },
};

export default function Button({ children, variant = "primary", onClick, type = "button", disabled, fullWidth }) {
  const style = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...style,
        padding: `${spacing.sm + 3}px ${spacing.lg}px`,
        borderRadius: radius.sm,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontFamily: typography.body,
        fontSize: typography.fontSizeBase,
        fontWeight: 600,
        transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        width: fullWidth ? "100%" : "auto",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") e.currentTarget.style.backgroundColor = colors.primaryHover;
        if (variant === "secondary") e.currentTarget.style.backgroundColor = colors.surface;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = style.backgroundColor;
      }}
    >
      {children}
    </button>
  );
}
