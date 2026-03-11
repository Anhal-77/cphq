/**
 * معايير CBAHI — CBAHI Standards
 * category: ESR | Major | Minor
 * ESR = Essential Safety Requirements (المتطلبات الأساسية للسلامة)
 */
export const CBAHI_STANDARDS = [
  {
    id: "IC.1",
    text: "يوجد برنامج موثق لمكافحة العدوى يشمل جميع أقسام المنشأة",
    category: "ESR",
    department: "مكافحة العدوى",
  },
  {
    id: "IC.2",
    text: "يتم تطبيق احتياطات العزل وفق بروتوكولات معتمدة",
    category: "Major",
    department: "مكافحة العدوى",
  },
  {
    id: "IC.3",
    text: "يتم توثيق معدلات العدوى المكتسبة داخل المنشأة شهرياً",
    category: "Minor",
    department: "مكافحة العدوى",
  },
  {
    id: "MM.1",
    text: "توجد سياسة موثقة لإدارة الأدوية تشمل الدورة الدوائية الكاملة",
    category: "ESR",
    department: "الصيدلية",
  },
  {
    id: "MM.2",
    text: "يتم التحقق من هوية المريض قبل إعطاء الدواء بثلاثة معرّفات",
    category: "Major",
    department: "الصيدلية",
  },
  {
    id: "MM.3",
    text: "يتم حفظ الأدوية عالية التنبيه في أماكن مؤمّنة ومميزة",
    category: "ESR",
    department: "الصيدلية",
  },
  {
    id: "NR.1",
    text: "تتوفر نسبة تمريض كافية وفق معايير سباهي لكل قسم",
    category: "Major",
    department: "التمريض",
  },
  {
    id: "NR.2",
    text: "يتم توثيق تقييم المريض عند الاستقبال خلال ساعة واحدة",
    category: "Major",
    department: "التمريض",
  },
  {
    id: "NR.3",
    text: "توجد خطة رعاية تمريضية فردية لكل مريض مقيم",
    category: "Minor",
    department: "التمريض",
  },
  {
    id: "PS.1",
    text: "يوجد نظام موثق للإبلاغ عن الأحداث الحرجة (Sentinel Events)",
    category: "ESR",
    department: "سلامة المرضى",
  },
  {
    id: "PS.2",
    text: "يتم تطبيق بروتوكول التحقق الجراحي في جميع العمليات",
    category: "ESR",
    department: "سلامة المرضى",
  },
  {
    id: "PS.3",
    text: "يتم توثيق سقوط المرضى والإجراءات الوقائية المتخذة",
    category: "Major",
    department: "سلامة المرضى",
  },
  {
    id: "QM.1",
    text: "يوجد مؤشرات جودة مفعّلة ويتم رفع تقارير دورية عنها",
    category: "Major",
    department: "إدارة الجودة",
  },
  {
    id: "QM.2",
    text: "يتم عقد اجتماعات لجنة الجودة بشكل منتظم وتوثيق محاضرها",
    category: "Minor",
    department: "إدارة الجودة",
  },
  {
    id: "HR.1",
    text: "توجد ملفات توظيف كاملة تشمل التراخيص والشهادات لجميع الكوادر",
    category: "Major",
    department: "الموارد البشرية",
  },
];

export const DEPARTMENTS = [...new Set(CBAHI_STANDARDS.map((s) => s.department))];
