# KALAHAN — WhatsApp Auto-React ⚡

لوحة تحكم ويب لربط حساب واتساب وعمل رياكت تلقائي على الستوريات، مبنية بـ Express + Baileys.

## المميزات

- ربط الحساب بكود (Pairing Code) من غير ما تسكان QR
- اختيار إيموجي الرياكشن أو كتابة إيموجي مخصص
- قراءة تلقائية للستوريات
- سجل نشاط لحظي (Live) عبر Server-Sent Events
- تصميم Glassmorphism داكن مع أنيميشن

## التثبيت والتشغيل

```bash
git clone https://github.com/USERNAME/REPO-NAME.git
cd REPO-NAME
npm install
node server.js
```

بعد كده افتحي المتصفح على:

```
http://localhost:3000
```

## المتطلبات

- Node.js 18 أو أحدث

## هيكل المشروع

```
├── server.js       # السيرفر (Express + Baileys)
├── index.html      # الواجهة
├── style.css       # التصميم
├── script.js       # منطق الواجهة
└── package.json    # المكتبات
```

## ملاحظة

الجلسات (`sessions/`) وملف البيانات (`data/session.json`) بيتعملوا تلقائي أول ما تشغلي السيرفر، ومش لازم يترفعوا على جيت هاب — متضافين في `.gitignore`.
