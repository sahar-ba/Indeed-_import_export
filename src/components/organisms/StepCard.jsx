export default function StepCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #eef2f7",
        boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
        height: "100%",
        minHeight: "220px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "14px",
          background: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          marginBottom: "18px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: "12px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#64748B",
          lineHeight: 1.7,
          fontSize: "16px",
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}