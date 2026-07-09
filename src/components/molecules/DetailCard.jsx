export default function DetailCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          fontSize: "26px",
          color: "#4f6ef7",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#64748b",
          fontSize: "13px",
          fontWeight: "600",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#0f172a",
          fontSize: "18px",
          fontWeight: "700",
          margin: 0,
        }}
      >
        {value}
      </p>
    </div>
  );
}