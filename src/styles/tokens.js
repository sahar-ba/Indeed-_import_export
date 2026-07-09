// Identité visuelle "SaaS moderne" inspirée des templates Webflow gratuits :
// fond clair, cartes avec ombre douce, coins arrondis, accent indigo.

export const colors = {
  background: "#FFFFFF",
  surface: "#F8FAFC",     // fond de page (légèrement gris)
  surfaceRaised: "#FFFFFF", // cartes

  textPrimary: "#0F172A",
  textMuted: "#64748B",

  primary: "#4F46E5",     // indigo — CTA, liens, accents
  primaryHover: "#4338CA",
  primarySoft: "#EEF2FF",

  border: "#E2E8F0",

  success: "#15803D",
  successBg: "#DCFCE7",
  info: "#1D4ED8",
  infoBg: "#DBEAFE",
  danger: "#DC2626",
  dangerBg: "#FEE2E2",
  neutral: "#475569",
  neutralBg: "#F1F5F9",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const typography = {
  display: "'Manrope', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",

  fontSizeSm: 13,
  fontSizeBase: 15,
  fontSizeMd: 17,
  fontSizeLg: 22,
  fontSizeXl: 32,
};

export const shadow = {
  card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.05)",
  raised: "0 8px 24px rgba(15, 23, 42, 0.08)",
};
