/**
 * شارة تصنيف المعيار — Standard Category Badge
 * ESR | Major | Minor
 */
export default function Badge({ cat }) {
  const map = {
    ESR:   { color: "#ff6b6b", bg: "#ff6b6b22" },
    Major: { color: "#ffd166", bg: "#ffd16622" },
    Minor: { color: "#06d6a0", bg: "#06d6a022" },
  };
  const { color, bg } = map[cat] || { color: "#aaa", bg: "#aaa22" };

  return (
    <span style={{
      background: bg,
      color,
      border: `1px solid ${color}44`,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "var(--mono)",
      letterSpacing: 1,
      whiteSpace: "nowrap",
    }}>
      {cat}
    </span>
  );
}
