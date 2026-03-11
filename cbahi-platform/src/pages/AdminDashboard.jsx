import { useState } from "react";
import { computeReport, getScoreColor, RISK_CONFIG } from "../engine/complianceEngine";
import { DEPARTMENTS } from "../data/standards";
import Badge from "../components/Badge";
import AuditLog from "../components/AuditLog";

const TABS = [
  { id: "overview", label: "نظرة عامة",    icon: "📊" },
  { id: "heatmap",  label: "خريطة المخاطر", icon: "🗺" },
  { id: "gap",      label: "تقرير الفجوات", icon: "📋" },
  { id: "audit",    label: "سجل المراقبة",  icon: "🔒" },
];

export default function AdminDashboard({ submissions, auditLog }) {
  const [activeTab, setActiveTab] = useState("overview");
  const report = computeReport(submissions);

  return (
    <div style={{ animation: "fadeIn 0.4s" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24,
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 12, padding: 6,
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
              background: activeTab === t.id ? "var(--accent-glow)" : "none",
              color: activeTab === t.id ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer", fontFamily: "var(--font)", fontSize: 13,
              fontWeight: activeTab === t.id ? 600 : 400,
              borderBottom: activeTab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab report={report} submissions={submissions} />}
      {activeTab === "heatmap"  && <HeatmapTab report={report} />}
      {activeTab === "gap"      && <GapTab report={report} />}
      {activeTab === "audit"    && <AuditLog auditLog={auditLog} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Overview Tab
// ────────────────────────────────────────────────────────
function OverviewTab({ report, submissions }) {
  if (!report || submissions.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
      <div style={{ fontSize: 18 }}>لا توجد بيانات مُسلَّمة بعد</div>
      <div style={{ fontSize: 13, marginTop: 8 }}>انتظر تسليم الموظفين لتقاريرهم</div>
    </div>
  );

  const scoreColor = getScoreColor(report.overallPct);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Critical failure banner */}
      {report.criticalFailure && (
        <div style={{
          borderRadius: 14, padding: "20px 24px",
          border: "1.5px solid rgba(239,68,68,0.5)",
          animation: "criticalPulse 2s ease-in-out infinite",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ fontSize: 36 }}>🚨</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
              CRITICAL FAILURE — فشل حرج
            </div>
            <div style={{ fontSize: 13, color: "#fca5a5", marginTop: 4 }}>
              معيار ESR حصل على صفر — يجب معالجته فوراً قبل إجراء أي تقييم رسمي
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "الامتثال الكلي",    value: `${report.overallPct}%`, color: scoreColor,        icon: "🎯" },
          { label: "الفجوات المكتشفة",  value: report.gaps.length,      color: "#f59e0b",         icon: "⚠" },
          { label: "التسليمات",          value: report.submittedCount,   color: "var(--accent)",   icon: "📨" },
        ].map((kpi) => (
          <div key={kpi.label} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "24px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: kpi.color, fontFamily: "var(--mono)" }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Overall compliance bar */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>مستوى الامتثال الإجمالي</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 16, color: scoreColor, fontWeight: 700 }}>
            {report.overallPct}%
          </span>
        </div>
        <div style={{ height: 12, background: "var(--bg-base)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${report.overallPct}%`,
            background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
            borderRadius: 6, transition: "width 1s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--text-muted)" }}>
          <span>0%</span><span>60% — مقبول</span><span>80% — جيد</span><span>100%</span>
        </div>
      </div>

      {/* Score distribution */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "24px" }}>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>توزيع النتائج</div>
        {[
          { label: "امتثال كامل (2)",  count: submissions.filter((s) => s.score === 2).length,  color: "#10b981" },
          { label: "امتثال جزئي (1)", count: submissions.filter((s) => s.score === 1).length,  color: "#f59e0b" },
          { label: "عدم امتثال (0)",   count: submissions.filter((s) => s.score === 0).length,  color: "#ef4444" },
          { label: "غير منطبق (N/A)", count: submissions.filter((s) => s.score === -1).length, color: "#4a6fa5" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 90, fontSize: 11, color: "var(--text-secondary)", flexShrink: 0 }}>
              {item.label}
            </div>
            <div style={{ flex: 1, height: 8, background: "var(--bg-base)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(item.count / (submissions.length || 1)) * 100}%`,
                background: item.color, borderRadius: 4, transition: "width 0.8s",
              }} />
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: item.color, width: 24, textAlign: "center" }}>
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Heatmap Tab
// ────────────────────────────────────────────────────────
function HeatmapTab({ report }) {
  if (!report) return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>لا توجد بيانات</div>
  );

  return (
    <div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
        خريطة حرارية للمخاطر حسب الأقسام — Risk Heatmap by Department
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {DEPARTMENTS.map((dept) => {
          const data = report.deptRisks[dept];
          if (!data || data.max === 0) return null;
          const cfg = RISK_CONFIG[data.level];
          return (
            <div key={dept} style={{
              background: cfg.bg, border: `1.5px solid ${cfg.border}`,
              borderRadius: 14, padding: "20px", position: "relative",
              overflow: "hidden", animation: "fadeIn 0.4s ease",
            }}>
              <div style={{ position: "absolute", top: 12, left: 12, fontSize: 22 }}>{cfg.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, paddingLeft: 36 }}>{dept}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>
                {data.gaps} فجوة من {data.count} معيار
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, height: 6, background: "rgba(0,0,0,0.2)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${data.pct}%`, background: cfg.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700, color: cfg.color }}>
                  {data.pct}%
                </div>
              </div>
              <div style={{
                marginTop: 10, display: "inline-block",
                padding: "3px 10px", background: `${cfg.color}22`,
                borderRadius: 20, fontSize: 11, color: cfg.color,
                border: `1px solid ${cfg.color}44`,
              }}>
                مستوى المخاطرة: {cfg.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Gap Analysis Tab
// ────────────────────────────────────────────────────────
function GapTab({ report }) {
  if (!report) return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>لا توجد بيانات</div>
  );

  if (report.gaps.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#10b981" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>لا توجد فجوات!</div>
      <div style={{ fontSize: 13, marginTop: 8, color: "var(--text-secondary)" }}>
        جميع المعايير حققت الامتثال الكامل
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          تقرير فجوات الامتثال — Gap Analysis Report
        </div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, color: "var(--danger)",
          background: "var(--danger-glow)", padding: "4px 12px",
          borderRadius: 20, border: "1px solid rgba(239,68,68,0.3)",
        }}>
          {report.gaps.length} فجوة
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {report.gaps.map((gap, i) => {
          const scoreColor = gap.score === 1 ? "#f59e0b" : "#ef4444";
          return (
            <div key={gap.id} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px 24px",
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)" }}>{gap.id}</span>
                    <Badge cat={gap.category} />
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{gap.department}</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7 }}>{gap.text}</div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 26, fontWeight: 700, color: scoreColor }}>
                    {gap.score}
                  </div>
                  <div style={{ fontSize: 10, color: scoreColor }}>{gap.score === 1 ? "جزئي" : "صفر"}</div>
                </div>
              </div>

              <div style={{
                background: "rgba(0,180,216,0.05)", border: "1px solid rgba(0,180,216,0.15)",
                borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 6, fontWeight: 600 }}>
                  📌 خطة التصحيح المقترحة (CAPA):
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {gap.capa}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
