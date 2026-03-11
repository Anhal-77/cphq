import { CBAHI_STANDARDS, DEPARTMENTS } from "../data/standards";
import { CAPA_MAP } from "../data/capa";

/**
 * محرك الامتثال — Compliance Engine
 *
 * القواعد:
 * 1. ESR Logic: أي معيار ESR بصفر → CRITICAL FAILURE للتقرير كاملاً
 * 2. النسبة المئوية المرجّحة: مجموع الدرجات / (المعايير المنطبقة × 2) × 100
 * 3. N/A (-1) مستثنى من المقام تماماً
 * 4. خريطة المخاطر: ≥80% خضر | ≥60% أصفر | <60% أحمر
 */
export function computeReport(submissions) {
  if (!submissions || submissions.length === 0) return null;

  let totalWeighted = 0;
  let totalMax = 0;
  let criticalFailure = false;
  let gaps = [];

  // تهيئة درجات الأقسام
  const deptScores = {};
  DEPARTMENTS.forEach((dept) => {
    deptScores[dept] = { total: 0, max: 0, count: 0, gaps: 0 };
  });

  CBAHI_STANDARDS.forEach((std) => {
    const sub = submissions.find((s) => s.standardId === std.id);
    const score = sub ? sub.score : null;

    // استثناء N/A والمعايير غير المُجابة
    if (score === -1 || score === null) return;

    // ESR Logic: فشل حرج فوري
    if (score === 0 && std.category === "ESR") {
      criticalFailure = true;
    }

    // تسجيل الفجوات
    if (score < 2) {
      gaps.push({
        ...std,
        score,
        capa: CAPA_MAP[std.id] || "يرجى إعداد خطة تصحيحية مخصصة بالتنسيق مع فريق الجودة",
      });
    }

    // تراكم الدرجات
    totalWeighted += score;
    totalMax += 2;

    if (deptScores[std.department]) {
      deptScores[std.department].total += score;
      deptScores[std.department].max += 2;
      deptScores[std.department].count += 1;
      if (score < 2) deptScores[std.department].gaps += 1;
    }
  });

  // حساب النسبة المئوية الكلية
  const overallPct = totalMax > 0 ? Math.round((totalWeighted / totalMax) * 100) : 0;

  // حساب مستوى المخاطرة لكل قسم
  const deptRisks = {};
  Object.keys(deptScores).forEach((dept) => {
    const d = deptScores[dept];
    const pct = d.max > 0 ? Math.round((d.total / d.max) * 100) : 100;
    deptRisks[dept] = {
      level: pct >= 80 ? "green" : pct >= 60 ? "yellow" : "red",
      pct,
      ...d,
    };
  });

  return {
    overallPct,
    criticalFailure,
    gaps,
    deptRisks,
    totalMax,
    totalWeighted,
    submittedCount: submissions.length,
  };
}

/**
 * تحديد لون نتيجة الامتثال
 */
export function getScoreColor(pct) {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
}

/**
 * تصنيف مستوى المخاطرة
 */
export const RISK_CONFIG = {
  green:  { label: "منخفض",  color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  icon: "🟢" },
  yellow: { label: "متوسط",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: "🟡" },
  red:    { label: "مرتفع",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   icon: "🔴" },
};
