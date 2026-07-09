import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors, radius, shadow, typography } from "../../styles/tokens";
import { useAuth } from "../../context/AuthContext";

export default function CategoryCard({ label, Icon, category }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    const query = `?category=${encodeURIComponent(category)}`;
    if (user) {
      navigate(`/listings/catalog${query}`);
    } else {
      navigate(`/listings${query}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "28px 16px",
        borderRadius: radius.md,
        border: `1px solid ${hovered ? colors.primary : colors.border}`,
        backgroundColor: "#fff",
        boxShadow: hovered ? shadow.raised : shadow.card,
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.18s ease",
        fontFamily: typography.body,
      }}
    >
      <Icon
        size={28}
        color={hovered ? colors.primary : colors.textPrimary}
        strokeWidth={1.75}
        style={{ transition: "color 0.18s ease" }}
      />
      <span style={{ fontSize: typography.fontSizeBase, fontWeight: 600, color: colors.textPrimary }}>
        {label}
      </span>
    </button>
  );
}
