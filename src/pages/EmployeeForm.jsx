import { useState, useRef } from "react";
import { CBAHI_STANDARDS } from "../data/standards";
import Badge from "../components/Badge";
import ScoreButton from "../components/ScoreButton";

const SCORE_OPTIONS = [
  { val: 2,  label: "امتثال كامل",  icon: "✓" },
  { val: 1,  label: "امتثال جزئي", icon: "◑" },
  { val: 0,  label: "عدم امتثال",  icon: "✗" },
  { val: -1, label: "غير منطبق",   icon: "−" },
];

export default function EmployeeForm({ user, onSubmit, setAuditLog }) {
  const myStandards = CBAHI_STANDARDS.filter((s) => s.department === user.dept);
  const [scores, setScores] = useState({});
  const [photos, setPhotos] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const fileRefs = useRef({});

  const current = myStandards[currentIdx];
  const progress = Object.keys(scores).length;
  const total = myStandards.length;
  const pct = Math.round((progress / total) * 100);

  const handlePhoto = (stdId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotos((p) => ({ ...p, [stdId]: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // في الإنتاج: احصل على GPS الحقيقي عبر navigator.geolocation
    const newSubs = myStandards.map((s) => ({
      standardId: s.id,
      score: scores[s.id] ?? -1,
      photo: photos[s.id] || null,
      submittedBy: user.name,
      dept: user.dept,
      timestamp: new Date().toLocaleString("ar-SA"),
      lat: 24.7136,
      lng: 46.6753,
    }));
    onSubmit(newSubs);
    setAuditLog((prev) => [
      {
        action: "تسليم تقييم",
        user: user.name,
        dept: user.dept,
        time: new Date().toLocaleString("ar-SA"),
        count: newSubs.filter((s) => s.score !== -1).length,
      },
      ...prev,
    ]);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "60vh", flexDirection: "column", gap: 20, animation: "fadeIn 0.4s",
    }}>
      <div style={{
        width: 80, height: 80, background: "rgba(16,185,129,0.15)",
        border: "2px solid #10b981", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
      }}>✓</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>تم التسليم بنجاح</div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
        تم حفظ تقييمك مع الطابع الزمني وإحداثيات الموقع
      </div>
    </div>
  );

  if (myStandards.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
      <div>لا توجد معايير مخصصة لقسمك حالياً</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", animation: "fadeIn 0.4s" }}>
      {/* Progress header */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{user.dept}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user.name}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>
              {progress}/{total}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>معيار مكتمل</div>
          </div>
        </div>
        <div style={{ height: 6, background: "var(--bg-base)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg, var(--accent-2), var(--accent))",
            borderRadius: 3, transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Standards tab pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {myStandards.map((s, i) => {
          const done = scores[s.id] !== undefined;
          const active = i === currentIdx;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentIdx(i)}
              style={{
                padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${active ? "var(--accent)" : done ? "#10b98133" : "var(--border)"}`,
                background: active ? "var(--accent-glow)" : done ? "rgba(16,185,129,0.08)" : "var(--bg-card)",
                color: active ? "var(--accent)" : done ? "#10b981" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 12, fontFamily: "var(--mono)", fontWeight: 600,
              }}
            >
              {done ? "✓ " : ""}{s.id}
            </button>
          );
        })}
      </div>

      {/* Current standard card */}
      {current && (
        <div
          key={current.id}
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border-bright)",
            borderRadius: 16, padding: "28px", animation: "fadeIn 0.3s",
          }}
        >
          {/* Standard info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)", marginBottom: 6 }}>
                {current.id}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.7 }}>{current.text}</div>
            </div>
            <Badge cat={current.category} />
          </div>

          {/* ESR warning */}
          {current.category === "ESR" && (
            <div style={{
              background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              fontSize: 12, color: "#ff6b6b", display: "flex", alignItems: "center", gap: 8,
            }}>
              ⚠ معيار حرج ESR — أي نتيجة صفر ستتسبب في CRITICAL FAILURE للتقرير كاملاً
            </div>
          )}

          {/* Score selection */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
              نتيجة التقييم:
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {SCORE_OPTIONS.map((opt) => (
                <ScoreButton
                  key={opt.val}
                  {...opt}
                  selected={scores[current.id] === opt.val}
                  onClick={() => setScores((p) => ({ ...p, [current.id]: opt.val }))}
                />
              ))}
            </div>
          </div>

          {/* Evidence photo upload */}
          <div style={{
            border: "1.5px dashed var(--border-bright)", borderRadius: 12,
            padding: 20, textAlign: "center",
          }}>
            {photos[current.id] ? (
              <div>
                <img
                  src={photos[current.id]} alt="دليل"
                  style={{ maxHeight: 180, borderRadius: 8, maxWidth: "100%" }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: "#10b981" }}>
                  ✓ تم رفع الدليل المرئي
                </div>
                <button
                  onClick={() => setPhotos((p) => { const n = { ...p }; delete n[current.id]; return n; })}
                  style={{
                    marginTop: 6, background: "none", border: "1px solid var(--border)",
                    borderRadius: 6, color: "var(--text-muted)", cursor: "pointer",
                    padding: "4px 12px", fontSize: 12, fontFamily: "var(--font)",
                  }}
                >
                  إزالة الصورة
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 6 }}>
                  رفع دليل مرئي
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
                  يُفضّل التقاط الصورة مباشرة من الكاميرا للتحقق الجغرافي
                </div>
                <label style={{
                  display: "inline-block", padding: "10px 20px",
                  background: "var(--accent-glow)", border: "1px solid var(--accent)",
                  borderRadius: 8, color: "var(--accent)", cursor: "pointer", fontSize: 13,
                }}>
                  اختيار صورة
                  <input
                    ref={(el) => (fileRefs.current[current.id] = el)}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handlePhoto(current.id, e)}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {currentIdx > 0 && (
              <button
                onClick={() => setCurrentIdx((i) => i - 1)}
                style={{
                  flex: 1, padding: "12px", background: "var(--bg-elevated)",
                  border: "1px solid var(--border)", borderRadius: 10,
                  color: "var(--text-secondary)", cursor: "pointer",
                  fontFamily: "var(--font)", fontSize: 14,
                }}
              >
                السابق
              </button>
            )}

            {currentIdx < myStandards.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => i + 1)}
                disabled={scores[current.id] === undefined}
                style={{
                  flex: 2, padding: "12px",
                  background: scores[current.id] !== undefined
                    ? "linear-gradient(135deg, var(--accent-2), var(--accent))"
                    : "var(--bg-elevated)",
                  border: "none", borderRadius: 10,
                  color: scores[current.id] !== undefined ? "#fff" : "var(--text-muted)",
                  cursor: scores[current.id] !== undefined ? "pointer" : "default",
                  fontFamily: "var(--font)", fontSize: 14, fontWeight: 600,
                  boxShadow: scores[current.id] !== undefined ? "0 4px 16px rgba(0,180,216,0.25)" : "none",
                }}
              >
                التالي ←
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={progress < total}
                style={{
                  flex: 2, padding: "12px",
                  background: progress >= total
                    ? "linear-gradient(135deg, #059669, #10b981)"
                    : "var(--bg-elevated)",
                  border: "none", borderRadius: 10,
                  color: progress >= total ? "#fff" : "var(--text-muted)",
                  cursor: progress >= total ? "pointer" : "default",
                  fontFamily: "var(--font)", fontSize: 14, fontWeight: 700,
                  boxShadow: progress >= total ? "0 4px 20px rgba(16,185,129,0.3)" : "none",
                }}
              >
                {progress >= total ? "🚀 تسليم التقرير" : `أكمل ${total - progress} معيار متبقي`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
