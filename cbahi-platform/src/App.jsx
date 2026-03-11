import { useState } from "react";
import "./styles.css";
import LoginPage from "./pages/LoginPage";
import EmployeeForm from "./pages/EmployeeForm";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [auditLog, setAuditLog] = useState([
    {
      action: "النظام",
      user: "System",
      dept: "—",
      time: new Date().toLocaleString("ar-SA"),
      count: "-",
    },
  ]);

  const handleLogin = (loggedInUser) => {
    setAuditLog((prev) => [
      {
        action: "تسجيل دخول",
        user: loggedInUser.name,
        dept: loggedInUser.dept,
        time: new Date().toLocaleString("ar-SA"),
        count: "-",
      },
      ...prev,
    ]);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setAuditLog((prev) => [
      {
        action: "تسجيل خروج",
        user: user.name,
        dept: user.dept,
        time: new Date().toLocaleString("ar-SA"),
        count: "-",
      },
      ...prev,
    ]);
    setUser(null);
  };

  const handleSubmit = (newSubs) => {
    setSubmissions((prev) => {
      // استبدال الاستجابات القديمة من نفس القسم
      const filtered = prev.filter((s) => !newSubs.find((n) => n.standardId === s.standardId));
      return [...filtered, ...newSubs];
    });
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* ─── Header ─── */}
      <header style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, background: "var(--accent-glow)",
            border: "1px solid var(--accent)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            animation: "glow 3s ease-in-out infinite",
          }}>
            🏥
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>منصة الجودة الصحية</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
              CBAHI COMPLIANCE v2.0
            </div>
          </div>
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: user.role === "admin" ? "var(--accent)" : "var(--minor-color)" }}>
              {user.role === "admin" ? "مدير الجودة" : `موظف — ${user.dept}`}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 14px", background: "none",
              border: "1px solid var(--border)", borderRadius: 8,
              color: "var(--text-secondary)", cursor: "pointer",
              fontFamily: "var(--font)", fontSize: 12, transition: "all 0.2s",
            }}
          >
            خروج
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {user.role === "admin" ? (
          <AdminDashboard submissions={submissions} auditLog={auditLog} />
        ) : (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>نموذج التقييم</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                قيّم معايير سباهي الخاصة بقسمك وارفع الأدلة المرئية لكل معيار
              </p>
            </div>
            <EmployeeForm
              user={user}
              onSubmit={handleSubmit}
              setAuditLog={setAuditLog}
            />
          </div>
        )}
      </main>
    </div>
  );
}
