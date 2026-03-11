import { useState } from "react";
import { USERS } from "../data/users";

export default function LoginPage({ onLogin }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setErr("");
    // محاكاة تأخير شبكة — في الإنتاج: استخدم Firebase Auth
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.name === creds.username && u.password === creds.password
      );
      if (user) {
        onLogin(user);
      } else {
        setErr("بيانات الدخول غير صحيحة");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg-base)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "40px 40px", opacity: 0.3,
      }} />
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600,
        background: "radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-bright)",
        borderRadius: 20, padding: "48px 40px", width: 420, position: "relative",
        animation: "fadeIn 0.5s ease",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,216,0.1)",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "20%", right: "20%",
          height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          borderRadius: 1,
        }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 64, height: 64, background: "var(--accent-glow)",
            border: "1.5px solid var(--accent)", borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 28,
            animation: "glow 3s ease-in-out infinite",
          }}>
            🏥
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>منصة الجودة الصحية</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: 2 }}>
            CBAHI COMPLIANCE PLATFORM v2.0
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              اسم المستخدم
            </label>
            <input
              value={creds.username}
              onChange={(e) => setCreds((p) => ({ ...p, username: e.target.value }))}
              placeholder="أدخل اسمك..."
              style={{
                width: "100%", padding: "12px 16px",
                background: "var(--bg-base)", border: "1px solid var(--border-bright)",
                borderRadius: 10, color: "var(--text-primary)", fontSize: 14,
                fontFamily: "var(--font)", outline: "none", direction: "rtl",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={creds.password}
              onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "12px 16px",
                background: "var(--bg-base)", border: "1px solid var(--border-bright)",
                borderRadius: 10, color: "var(--text-primary)", fontSize: 14,
                fontFamily: "var(--font)", outline: "none", direction: "rtl",
              }}
            />
          </div>

          {err && (
            <div style={{
              color: "var(--danger)", fontSize: 13, textAlign: "center",
              background: "var(--danger-glow)", padding: "8px 16px",
              borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)",
            }}>
              {err}
            </div>
          )}

          <button
            onClick={handle}
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading
                ? "var(--bg-elevated)"
                : "linear-gradient(135deg, var(--accent-2), var(--accent))",
              border: "none", borderRadius: 10, color: "#fff",
              fontSize: 15, fontWeight: 600, fontFamily: "var(--font)",
              cursor: loading ? "default" : "pointer", transition: "all 0.2s",
              marginTop: 4,
              boxShadow: loading ? "none" : "0 4px 20px rgba(0,180,216,0.3)",
            }}
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: 24, padding: "16px", background: "var(--bg-base)",
          borderRadius: 10, border: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textAlign: "center" }}>
            بيانات تجريبية
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => setCreds({ username: u.name, password: u.password })}
                style={{
                  background: "none", border: "none",
                  color: "var(--text-secondary)", fontSize: 12,
                  cursor: "pointer", textAlign: "right", padding: "2px 0",
                  fontFamily: "var(--font)",
                }}
              >
                <span style={{ color: u.role === "admin" ? "var(--accent)" : "var(--text-muted)" }}>●</span>{" "}
                {u.name} —{" "}
                <span style={{ fontFamily: "var(--mono)" }}>{u.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
