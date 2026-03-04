# 🚘 Baraka Avto Savdo — CRM Tizimi

## O'rnatish va ishga tushirish

### Talablar
- Node.js 18+ (https://nodejs.org)
- npm yoki yarn

### Qadamlar

```bash
# 1. Papkaga kiring
cd baraka-avto-crm

# 2. Kutubxonalarni o'rnating
npm install

# 3. Ishga tushiring
npm run dev
```

Brauzerda: **http://localhost:3000**

---

## Kirish ma'lumotlari

| Rol    | Login  | Parol    |
|--------|--------|----------|
| Admin  | admin  | admin123 |
| Xodim  | jasur  | jasur123 |
| Xodim  | malika | malika123|

---

## Tuzilma

```
baraka-avto-crm/
├── public/
│   └── logo.jpg              ← Baraka Avto logotipi
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       ← Yon panel
│   │   └── UI.jsx            ← Umumiy komponentlar
│   ├── context/
│   │   └── AppContext.jsx    ← Global holat (state)
│   ├── data/
│   │   └── mockData.js       ← Boshlang'ich ma'lumotlar
│   ├── pages/
│   │   ├── LoginPage.jsx     ← Kirish sahifasi
│   │   ├── Dashboard.jsx     ← Bosh sahifa
│   │   ├── CarsPage.jsx      ← Mashinalar / Sotilganlar
│   │   ├── ExpensesPage.jsx  ← Xarajatlar
│   │   ├── EmployeesPage.jsx ← Xodimlar
│   │   ├── ReportsPage.jsx   ← Hisobotlar (Admin)
│   │   ├── AuditPage.jsx     ← Audit log (Admin)
│   │   └── SettingsPage.jsx  ← Sozlamalar
│   ├── utils/
│   │   ├── helpers.js        ← Yordamchi funksiyalar
│   │   └── theme.js          ← Rang sxemasi
│   ├── App.jsx               ← Asosiy komponent
│   ├── main.jsx              ← Kirish nuqtasi
│   └── index.css             ← Global stillar
├── index.html
├── vite.config.js
└── package.json
```

---

## Imkoniyatlar

- 🔐 Admin / Xodim rollari
- 🚗 Mashinalar CRUD (qo'shish, tahrirlash, o'chirish, sotish)
- ✅ Sotilgan mashinalar tarixi
- 📉 Xarajatlar boshqaruvi
- 👥 Xodimlar statistikasi
- 📊 Hisobotlar + Excel eksport (Admin)
- 🔍 Audit log (Admin)
- ⚙️ Sozlamalar — parol o'zgartirish, foydalanuvchi boshqaruvi
- 💰 Narxlar O'zbek so'mida

---

## Build (Production)

```bash
npm run build
# dist/ papkasiga tayyor fayl chiqadi
```
