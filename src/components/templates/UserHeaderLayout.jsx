import { NavLink, Outlet, useLocation } from "react-router-dom";
import { colors, spacing, typography } from "../../styles/tokens";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/listings/catalog", label: "Annonces" },
  { to: "/listings/mine", label: "Mes annonces" },
  { to: "/messages", label: "Messagerie" },
  { to: "/billing", label: "Facturation" },
  { to: "/profile", label: "Profil" },
];

// Routes qui doivent occuper toute la largeur/hauteur disponible,
// sans le padding/max-width applique par defaut au contenu (ex: messagerie).
const FULL_BLEED_PATHS = ["/messages"];

export default function UserHeaderLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const isFullBleed = FULL_BLEED_PATHS.some((path) => location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", height: isFullBleed ? "100vh" : "auto" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          padding: `${spacing.md}px ${spacing.lg}px`,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: spacing.lg,
          }}
        >
          {/* Logo */}
          <NavLink
            to="/"
            style={{ display: "flex", alignItems: "center", gap: spacing.sm, textDecoration: "none" }}
          >
            <span
              style={{
                fontSize: typography.fontSizeLg,
                fontWeight: 800,
                color: colors.textPrimary,
                fontFamily: typography.display,
              }}
            >
              Indeed²
            </span>
          </NavLink>

          {/* Navigation */}
          <nav style={{ display: "flex", gap: spacing.sm, alignItems: "center", flexWrap: "wrap" }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? colors.primary : colors.textMuted,
                  fontSize: typography.fontSizeSm,
                  fontWeight: isActive ? 700 : 500,
                  padding: `${spacing.sm}px ${spacing.md}px`,
                  borderRadius: "6px",
                  backgroundColor: isActive ? colors.primarySoft : "transparent",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Bouton Deconnexion */}
          <button
            onClick={handleLogout}
            style={{
              flexShrink: 0,
              color: "#ffffff",
              fontSize: typography.fontSizeSm,
              fontWeight: 700,
              padding: `${spacing.sm}px ${spacing.md}px`,
              backgroundColor: colors.danger,
              border: `1px solid ${colors.danger}`,
              borderRadius: "6px",
              transition: "all 0.2s",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      {isFullBleed ? (
        <main style={{ flex: 1, backgroundColor: colors.surface, overflow: "hidden", display: "flex" }}>
          <Outlet />
        </main>
      ) : (
        <main style={{ flex: 1, backgroundColor: colors.surface, overflow: "auto" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: `${spacing.xl}px ${spacing.lg}px` }}>
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
}
