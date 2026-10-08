<div align="center">

  <img src="src/assets/mpl-official.webp" alt="Masur Premier League 2026" width="160" />

  # 🏆 MASUR PREMIER LEAGUE 2026 (MPL)
  ### Official Player Registration & Tournament Management Platform

  <p align="center">
    <strong>Play Fearless. Play for Glory. Play MPL 2026.</strong>
  </p>

  <!-- Badges -->
  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite 5" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://web.dev/progressive-web-apps/"><img src="https://img.shields.io/badge/PWA-Installable-FF6A00?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" /></a>
    <img src="https://img.shields.io/badge/Status-Active_Registration-FFC83D?style=for-the-badge" alt="Status Active" />
  </p>

  <p align="center">
    <strong>🌟 DEVELOPED BY: AJINKYA CHALKE 🌟</strong>
  </p>

</div>

---

## 📖 Overview

The **Masur Premier League 2026 (MPL 2026)** web application is a high-performance, mobile-first, and broadcast-grade cricket player registration and auction management portal. Designed for local cricket talent, organizers, and team owners, it replaces manual paperwork with a sleek 2-step registration wizard, automated image optimization, instant UPI verification, real-time Telegram alerts, and an official printable registration slip.

---

## ✨ Key Features & Enhancements

### 🎨 1. Stadium-Inspired Visuals & Rich Animations
- **Cinematic Shimmer Header (`GifText`)**: The title *"MASUR PREMIER LEAGUE"* and developer credits *"DEVELOPED BY : AJINKYA CHALKE"* utilize an animated gold shimmer effect that continuously flows with dynamic lighting reflections.
- **Active Glowing BorderBeam**: Animated glowing border trails (`#ff6a00` to `#ffc83d`) encircle form containers, interactive cards, dropdowns, and payment QR modules.
- **Atmospheric Stadium Glow**: Soft rotating stadium lights, breathing golden radial bloom, and a deep night-match contrast color scheme.

### 📱 2. Progressive Web App (PWA) & Native App Install
- **Downloadable to Home Screen**: Installable as a standalone app on Android, iPhone (iOS Safari), and Desktop (Chrome / Edge).
- **Official App Icons & Favicons**: Generated across multiple resolutions (`favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png` 180x180, `pwa-192x192.png`, `pwa-512x512.png`, and `maskable-icon-512x512.png`).
- **Offline Service Worker (`sw.js`)**: Caches static assets for instant load times and resilient offline operation.
- **Smart Install Button & Banner**: Dedicated header install button with BorderBeam animation and an intelligent mobile floating banner with native and iOS step-by-step guides.

### 🏏 3. Streamlined 2-Step Registration Wizard
- **Step 1: Personal Information**
  - **Simplified 3-Dropdown DOB Picker**: Dedicated Day (`01–31`), Month (`Jan–Dec`), and Year (`1970–2014`) dropdowns replacing awkward calendar wheels, complete with a live **Age Preview** (e.g., `✓ 15/07/2000 · Age: 25 years old`).
  - **Smart Jersey Name**: Auto-defaults to the player's Full Name if left blank.
  - **Flexible Indian Phone Validation**: Handles `+91`, prefixes, and spaces automatically.
  - **HTML5 Canvas Auto-Compression**: Compresses heavy mobile camera photos (8MB–15MB) into high-quality ~300KB JPEGs on the client side before uploading, guaranteeing compatibility with Supabase storage limits.
- **Step 2: Cricket Profile & Payment**
  - Playing roles (Batsman, Bowler, All-Rounder, Wicket-Keeper), batting style, and bowling preferences.
  - ₹100 Player Registration Fee badge.
  - **Direct UPI App Launcher**: 1-tap launcher prefilled with ₹100 (`upi://pay?pa=9158482736-3@ibl...`) for PhonePe, Google Pay, and Paytm.
  - **PhonePe QR Code**: Official QR code for payee `DIPAK MAHADEV SHIRTODE` with copyable UPI ID (`9158482736-3@ibl`).
  - Safe mobile UUID generator ensuring crash-free navigation across mobile LAN/Wi-Fi (`http://`) environments.

### 📄 4. Official Registration Slip & Fresh Form Reset
- **Instant Digital Slip Generator**: Produces an official MPL 2026 Registration Receipt featuring official branding watermark, unique Registration ID, verified photo, player summary, and payment verification notice.
- **Print & PDF Export**: Clean, high-contrast print stylesheet (`window.print()`) formatted for A4/receipt printers.
- **Share Capability**: Native Web Share API integration to send receipts via WhatsApp, Telegram, or SMS.
- **Fresh Page Reset**: Tapping **Done ✓** immediately clears all sensitive form memory, resets to Step 1, and scrolls smoothly to the homepage top for the next registration.

### ⏳ 5. Live Countdown Timer
- **Registration Deadline**: Synchronized to **25 October 2026, 11:59:59 PM IST**.
- **Scoreboard Display**: Live animated scoreboard blocks calculating Days, Hours, Minutes, and Seconds remaining.

### 🛡️ 6. Organizer Admin Portal
- Protected with server-validated `ADMIN_PIN`.
- Review submitted players, inspect payment screenshots, filter by playing roles, verify payments, and trigger Telegram notification retries.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + CSS Variables + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **PWA & Offline** | Web App Manifest + Service Worker (`sw.js`) + [Sharp](https://sharp.pixelplumbing.com/) (Asset generation) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Storage Buckets, Edge Functions) |
| **Notifications** | Telegram Bot API integration via Edge Functions |

---

## 📁 Project Structure

```bash
mpl/
├── public/                     # Static PWA assets & icons
│   ├── apple-touch-icon.png    # iOS Safari Home Screen icon (180x180)
│   ├── favicon.ico             # Browser multi-size favicon
│   ├── favicon-32x32.png       # 32x32 PNG favicon
│   ├── favicon-16x16.png       # 16x16 PNG favicon
│   ├── manifest.json           # Web App Manifest for PWA installation
│   ├── pwa-192x192.png         # Android PWA app icon (192x192)
│   ├── pwa-512x512.png         # High-res PWA launch icon (512x512)
│   ├── maskable-icon-512x512.png# Maskable icon for Android adaptive icons
│   └── sw.js                   # Service Worker for offline caching
├── scripts/
│   └── generate-pwa-icons.js   # Script to generate crisp icons from official logo
├── src/
│   ├── assets/                 # Branding, stadium hero, gold shimmer GIF, QR
│   │   ├── hero-banner.jpg
│   │   ├── mpl-official.webp
│   │   ├── mpl-gold-shimmer.gif
│   │   └── payment-qr.png
│   ├── components/
│   │   ├── registration-steps/
│   │   │   ├── PersonalInfoStep.tsx    # Step 1: 3-dropdown DOB, name, mobile, photo
│   │   │   └── CricketProfileStep.tsx  # Step 2: Role, stats, ₹100 fee, PhonePe QR
│   │   ├── ui/
│   │   │   ├── border-beam.tsx         # Glowing animated BorderBeam component
│   │   │   ├── gif-text.tsx            # Shimmering golden text animation
│   │   │   └── file-upload.tsx         # Canvas image auto-compressor & uploader
│   │   ├── Countdown.tsx               # Live countdown to 25 Oct 2026
│   │   ├── Hero.tsx                    # Stadium hero with large logo & credits
│   │   ├── InstallPwaButton.tsx        # Header PWA Download App button
│   │   ├── InstallPwaBanner.tsx        # Mobile floating install banner
│   │   ├── MplLogo.tsx                 # Official shared logo component
│   │   ├── RegistrationForm.tsx        # Multi-step wizard coordinator
│   │   └── RegistrationReceipt.tsx     # Printable receipt slip modal
│   ├── contexts/
│   │   └── RegistrationContext.tsx     # Form state management
│   ├── pages/
│   │   ├── Index.tsx                   # Main tournament registration page
│   │   ├── Admin.tsx                   # PIN-protected organizer dashboard
│   │   └── NotFound.tsx
│   ├── index.css                       # Design tokens, theme colors & animations
│   └── main.tsx                        # React application bootstrap
└── supabase/
    └── functions/                      # Deno edge functions
        ├── submit-registration/        # Idempotent registration submission
        ├── upload-player-media/        # Strict media storage handler
        └── notify-registration/        # Telegram alert dispatcher
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Clone the Repository
```bash
git clone https://github.com/ajinkyachalke008/masur_premier_league-.git
cd masur_premier_league-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.  
To test on your mobile device over the same Wi-Fi, open the displayed network address (e.g., `http://192.168.x.x:8080/`).

### 5. Build for Production
```bash
npm run build
```
The optimized output will be generated in the `dist/` folder.

---

## 📲 Installing the PWA on Your Device

### On Android (Chrome / Brave / Edge):
1. Open the website on your phone.
2. Tap the **"Download App"** button in the header or tap **"Install"** on the bottom banner.
3. Confirm **Install** — the app icon will appear on your home screen and open in full-screen mode!

### On iPhone (Safari):
1. Open the website in Safari.
2. Tap the **Share** button (`⎋`) at the bottom.
3. Scroll down and select **"Add to Home Screen"** (`⊞`).
4. Tap **Add** in the top right corner.

---

## 👨‍💻 Developer & Credits

<div align="center">

  ### 🏏 Built with passion for cricket by:
  ## **AJINKYA CHALKE**
  *Lead Full-Stack Developer & UI/UX Architect*

  <p>
    <strong>Masur Premier League 2026</strong> · <em>Play Fearless. Play for Glory.</em>
  </p>

</div>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). All rights reserved by **Masur Premier League 2026**.
