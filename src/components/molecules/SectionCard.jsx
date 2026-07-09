export default function SectionCard({ title, children }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "30px",
        marginBottom: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
