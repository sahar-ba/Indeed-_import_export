export default function Select({
  value,
  options,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          minWidth: "180px",
          height: "44px",

          padding: "0 40px 0 16px", // ← espace à droite

          border: `1px solid ${error ? "#dc2626" : "#E2E8F0"}`,
          borderRadius: "12px",

          backgroundColor: "#fff",
          color: "#0F172A",

          fontSize: "15px",
          fontWeight: "500",

          outline: "none",
          cursor: "pointer",

          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",

          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,

          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          backgroundSize: "16px",
        }}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* `error` est une simple chaîne ici (pas un objet react-hook-form
          comme pour Input), puisque ce Select est un composant contrôlé
          en dehors du register() — mais le rendu visuel reste identique. */}
      {error && (
        <p style={{ color: "#dc2626", fontSize: 13, margin: "4px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}