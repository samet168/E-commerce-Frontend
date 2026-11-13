# 💻 Omni POS & Delivery — Admin Web Dashboard

An enterprise-grade, high-performance web dashboard built with **Next.js 14**, **React 18**, and **Tailwind CSS**. Designed for managing real-time orders, multi-branch store operations, products & stock inventory, staff accounts, and delivery dispatch.

---

## 🌟 Key Features

- **⚡ Real-Time Operations Dispatcher:** Live order stream with audio notifications, status timeline progression (Pending → Preparing → Out for Delivery → Delivered).
- **📦 Products & Inventory Management:** Cloudinary image uploads, barcode generator, cost & profit margins, and stock control.
- **🏬 Multi-Branch Store Management:** Store branches with GPS coordinates, phone contacts, and operating hours.
- **👥 Staff & User Management:** Comprehensive account administration (Admins, Cashiers, Drivers, Customers) with role filtering and account activation toggles.
- **🏷️ Product Categories & Coupons:** Food and drink taxonomy management with discount promotion codes.
- **🛡️ Enterprise Error Resiliency:** Root React ErrorBoundary catching exceptions and providing 1-click session recovery.
- **🌙 Modern Dark & Light Mode:** Professional luxury dashboard UI with responsive sidebar navigation.

---

## 📁 Project Architecture

```
admin_web/
├── public/                 # Static assets, logos, favicons, audio chime
├── src/
│   ├── pages/
│   │   ├── _app.jsx        # Root application wrapper with ErrorBoundary & ToastProvider
│   │   ├── index.jsx       # Main Dashboard (Dispatcher, Inventory, Branches, Staff)
│   │   └── login.jsx       # Secure Admin & Cashier Authentication Page
│   └── styles/
│       └── globals.css     # Tailwind CSS base styles & custom scrollbars
├── .env.example            # Environment variables template
├── .gitignore              # Standard Next.js gitignore
├── next.config.js          # Next.js configuration & image domain whitelist
├── package.json            # Project dependencies & npm scripts
├── tailwind.config.js      # Tailwind theme configuration
└── vercel.json             # Vercel deployment framework configuration
```

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploying to Vercel (Vercel.com)

Since this project is built on **Next.js**, it deploys natively on **Vercel** with zero complex setup.

### Step-by-Step Deployment Guide:
1. Push this repository to GitHub: `https://github.com/samet168/E-commerce-Frontend.git`.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New...** → **Project**.
4. Select and import the `samet168/E-commerce-Frontend` repository.
5. Vercel automatically detects **Next.js**.
6. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | Your Render Backend URL (e.g., `https://ecommerce-backend-xxx.onrender.com/api/v1`) |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `643600505402-qfbt52mg2j51v9jmnam1cso3mslpnhhi.apps.googleusercontent.com` |
7. Click **Deploy**.
8. Within seconds, your live Admin Dashboard will be active at:
   `https://e-commerce-frontend-xxx.vercel.app`!

---

## 🔑 Default Admin Credentials
- **Email:** `admin@omni.com`
- **Password:** `admin123`
- **Role:** `admin`

---

## 📄 License
MIT License. Developed for Omni POS & Delivery Ecosystem.
