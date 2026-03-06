export default function StatCard({ title, value, bg, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: bg,
        padding: "18px",
        borderRadius: "18px",
        width: "260px",
        minHeight: "150px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: 10 }}>
        {title}
      </div>

      <div style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: 26 }}>
        {value}
      </div>

      <div style={{ fontSize: "13px", color: "#64748b" }}>Click to view →</div>
    </div>
  );
}