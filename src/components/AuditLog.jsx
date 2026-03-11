/**
 * سجل المراقبة — Audit Log Component
 * للقراءة فقط — Read Only
 */
export default function AuditLog({ auditLog }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>سجل المراقبة — Audit Log</div>
        <div style={{
          fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)",
          background: "var(--bg-card)", padding: "4px 12px",
          borderRadius: 20, border: "1px solid var(--border)",
        }}>
          🔒 READ ONLY
        </div>
      </div>

      {auditLog.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: 14 }}>
          لا يوجد سجلات بعد
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {auditLog.map((log, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "14px 18px",
                animation: `fadeIn 0.3s ease ${i * 0.03}s both`,
              }}
            >
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--accent)", flexShrink: 0,
                animation: i === 0 ? "pulse 2s ease-in-out infinite" : "none",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{log.action}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {log.user} · {log.dept}
                  {log.count !== "-" && ` · ${log.count} معيار`}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11,
                color: "var(--text-muted)", textAlign: "left", direction: "ltr",
              }}>
                {log.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
