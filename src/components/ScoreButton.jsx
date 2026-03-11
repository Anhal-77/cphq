/**
 * زر التقييم — Score Selection Button
 * يدعم: 2 (امتثال كامل) | 1 (جزئي) | 0 (عدم امتثال) | -1 (N/A)
 */
export default function ScoreButton({ val, label, icon, selected, onClick }) {
  const colors = { 2: "#10b981", 1: "#f59e0b", 0: "#ef4444", "-1": "#4a6fa5" };
  const col = colors[String(val)] || "#aaa";

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 6px",
        border: `2px solid ${selected ? col : "var(--border)"}`,
        background: selected ? `${col}22` : "var(--bg-base)",
        borderRadius: 8,
        cursor: "pointer",
        color: selected ? col : "var(--text-secondary)",
        fontSize: 12,
        fontFamily: "var(--font)",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 10, lineHeight: 1.3, textAlign: "center" }}>{label}</span>
    </button>
  );
}
