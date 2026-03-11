# 🏥 CBAHI Compliance Platform — منصة الجودة الصحية

> منصة ويب متطورة لإدارة الجودة الصحية والامتثال لمعايير سباهي (CBAHI)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-10.7-FFCA28)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 نظرة عامة

منصة متكاملة تتيح للمنشآت الصحية إدارة وقياس مستوى الامتثال لمعايير **هيئة الاعتماد الصحي السعودي (سباهي / CBAHI)** بشكل رقمي ودقيق.

---

## ✨ المميزات الرئيسية

### 🔐 نظام المصادقة
- تسجيل دخول آمن بصلاحيات متعددة (موظف / مدير جودة)
- سجل مراقبة (Audit Log) غير قابل للتعديل لكل عملية

### 👩‍⚕️ واجهة الموظف
- نموذج تقييم تفاعلي لمعايير سباهي حسب القسم
- نظام تنقيط ثلاثي: امتثال كامل (2) / جزئي (1) / عدم امتثال (0) + N/A
- رفع أدلة مرئية مباشرة من الكاميرا (منع رفع من الاستديو)
- تسجيل إحداثيات GPS وطابع زمني مع كل تسليم
- تحذير فوري على معايير ESR الحرجة

### 📊 داشبورد المدير
- **نظرة عامة**: KPIs + بانر CRITICAL FAILURE التلقائي
- **خريطة المخاطر**: هيت ماب ألوان (أحمر/أصفر/أخضر) لكل قسم
- **تقرير الفجوات**: Gap Analysis + خطة CAPA لكل فجوة
- **سجل المراقبة**: Audit Log زمني شامل

---

## 🧠 محرك الامتثال (Compliance Engine)

### منطق الفشل الحرج (ESR Logic)
```
إذا كان أي معيار مصنّف ESR = 0
  → التقرير كاملاً يُصنَّف: CRITICAL FAILURE
```

### حساب النسبة المئوية المرجّحة
```
النسبة = (مجموع الدرجات / (عدد المعايير المنطبقة × 2)) × 100
ملاحظة: معايير N/A مستثناة من المقام
```

### هيكل جدول المعايير
| الحقل | النوع | الوصف |
|-------|-------|-------|
| `id` | string | كود المعيار (مثل IC.1) |
| `text` | string | نص المعيار |
| `category` | enum | ESR / Major / Minor |
| `department` | string | القسم المسؤول |

### هيكل جدول الاستجابات
| الحقل | النوع | الوصف |
|-------|-------|-------|
| `standardId` | string | معرف المعيار |
| `score` | number | 2/1/0/-1 |
| `photo` | base64 | الدليل المرئي |
| `submittedBy` | string | اسم الموظف |
| `dept` | string | القسم |
| `timestamp` | string | الطابع الزمني |
| `lat` / `lng` | number | إحداثيات GPS |

---

## 🗂️ هيكل المشروع

```
cbahi-platform/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   ├── standards.js        # معايير CBAHI
│   │   ├── users.js            # بيانات المستخدمين
│   │   └── capa.js             # خطط CAPA
│   ├── engine/
│   │   └── complianceEngine.js # محرك الامتثال والحسابات
│   ├── components/
│   │   ├── Badge.jsx           # شارة تصنيف المعيار
│   │   ├── ScoreButton.jsx     # زر التقييم
│   │   └── AuditLog.jsx        # مكوّن سجل المراقبة
│   ├── pages/
│   │   ├── LoginPage.jsx       # صفحة تسجيل الدخول
│   │   ├── EmployeeForm.jsx    # نموذج الموظف
│   │   └── AdminDashboard.jsx  # داشبورد المدير
│   ├── App.jsx                 # المكوّن الجذر
│   ├── index.js
│   └── styles.css              # المتغيرات والأنيميشن
├── .env.example                # متغيرات Firebase
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 التشغيل المحلي

```bash
# 1. استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/cbahi-platform.git
cd cbahi-platform

# 2. تثبيت المكتبات
npm install

# 3. إعداد Firebase
cp .env.example .env
# عدّل .env بمعلومات مشروعك

# 4. تشغيل التطوير
npm start
```

---

## 🔥 إعداد Firebase

```javascript
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

### مجموعات Firestore المطلوبة
```
/standards          → معايير CBAHI
/submissions        → استجابات الموظفين
/users              → بيانات المستخدمين
/auditLog           → سجل المراقبة
```

---

## 🌐 النشر على GitHub Pages

```bash
# تثبيت أداة النشر
npm install --save-dev gh-pages

# إضافة للـ package.json
"homepage": "https://YOUR_USERNAME.github.io/cbahi-platform",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# النشر
npm run deploy
```

---

## 📊 معايير CBAHI المدرجة

| الكود | القسم | التصنيف |
|-------|-------|---------|
| IC.1 – IC.3 | مكافحة العدوى | ESR, Major, Minor |
| MM.1 – MM.3 | الصيدلية | ESR, ESR, Major |
| NR.1 – NR.3 | التمريض | Major, Major, Minor |
| PS.1 – PS.3 | سلامة المرضى | ESR, ESR, Major |
| QM.1 – QM.2 | إدارة الجودة | Major, Minor |
| HR.1 | الموارد البشرية | Major |

---

## 🛡️ الأمان والخصوصية

- جميع البيانات مشفّرة عبر Firebase Security Rules
- الصور المرفوعة محفوظة في Firebase Storage
- سجل المراقبة مقيّد للقراءة فقط (Read-Only)
- إحداثيات GPS مسجّلة مع كل تسليم لمنع التلاعب الجغرافي

---

## 👩‍💻 المطوّرة

تطوير بواسطة **أنهال** — مبتكرة صحة رقمية، مساعدة طب أسنان معتمدة من SCFHS  
مشروع ضمن مبادرات رؤية المملكة 2030 للتحول الرقمي الصحي 🇸🇦

---

## 📄 الرخصة

MIT License — حرّ الاستخدام مع الإشارة للمصدر
