import { NavLink, Outlet } from "react-router-dom";
import { colors, spacing, typography } from "../../styles/tokens";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/listings", label: "Annonces" },
  { to: "/Vmessages", label: "Messagerie" },
  { to: "/billing", label: "Facturation" },
  { to: "/contact", label: "Contact" },
];

export default function VisitorLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          padding: `${spacing.md}px ${spacing.lg}px`,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
                end={item.end}
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

          {/* Auth Buttons */}
          <div style={{ display: "flex", gap: spacing.sm, alignItems: "center", flexShrink: 0 }}>
            <NavLink
              to="/auth/login"
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? colors.primary : colors.textPrimary,
                fontSize: typography.fontSizeSm,
                fontWeight: 600,
                padding: `${spacing.sm}px ${spacing.md}px`,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                backgroundColor: "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                whiteSpace: "nowrap",
              })}
            >
              Connexion
            </NavLink>

            <NavLink
              to="/auth/register"
              style={{
                textDecoration: "none",
                color: colors.background,
                fontSize: typography.fontSizeSm,
                fontWeight: 700,
                padding: `${spacing.sm}px ${spacing.md}px`,
                backgroundColor: colors.primary,
                border: `1px solid ${colors.primary}`,
                borderRadius: "6px",
                transition: "all 0.2s",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Inscription
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          overflow: "auto",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: `${spacing.xl}px ${spacing.lg}px` }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
