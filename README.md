# AssalamCare Wakaf Dashboard

Sistem Semakan Status Wakaf Al-Quran untuk Assalam Care Malaysia. Aplikasi ini membolehkan pewakaf menyemak status wakaf mereka menggunakan No. Telefon atau No. Invois, melihat bukti gambar/video, dan menerima mesej penghargaan peribadi yang dijana oleh AI.

## 🌟 Ciri-Ciri Utama

*   **Carian Pantas:** Semakan menggunakan No. Telefon atau No. Invois.
*   **Integrasi Google Sheets:** Data diambil terus dari Google Sheets (sebagai database) menggunakan Google Apps Script.
*   **Bukti Media:** Paparan galeri untuk gambar, video, dan pautan Telegram (Embed).
*   **Mesej AI:** Menjana ayat penghargaan khas untuk pewakaf menggunakan DeepSeek API.
*   **Status Penghantaran:** Memaparkan status serahan (Institusi & Tarikh) secara automatik.
*   **Reka Bentuk Responsif:** Paparan cantik di telefon bimbit dan desktop (Tailwind CSS).

## 🛠 Teknologi Digunakan

*   **Frontend:** React (Vite), TypeScript
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Backend (Database):** Google Sheets + Google Apps Script
*   **AI:** DeepSeek API (melalui `fetch`)
*   **Deployment:** Vercel (Frontend)

## 🚀 Cara Menggunakan (Pembangunan Tempatan)

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/USERNAME/NAMA-REPO-ANDA.git
    cd assalamcare-wakaf-dashboard
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Cipta fail `.env` di root folder dan masukkan API Key DeepSeek anda:
    ```env
    VITE_API_KEY=sk-your-deepseek-api-key-here
    ```

4.  **Jalankan Server:**
    ```bash
    npm run dev
    ```

## 🌐 Cara Deploy (Vercel)

1.  Push kod anda ke **GitHub**.
2.  Buka **Vercel** dan klik **"Add New Project"**.
3.  Import repository GitHub anda.
4.  Di bahagian **Environment Variables**, tambah:
    *   `VITE_API_KEY`: Masukkan API Key DeepSeek anda.
5.  Klik **Deploy**.

## 📊 Konfigurasi Google Apps Script (Backend)

Aplikasi ini memerlukan Google Apps Script yang di-deploy sebagai Web App.

1.  Buka Google Sheet database anda.
2.  Pergi ke **Extensions > Apps Script**.
3.  Copy & Paste kod dari fail `services/dataService.ts` (bahagian komen hijau).
4.  **Deploy:**
    *   Klik `Deploy` > `New deployment`.
    *   Select type: `Web app`.
    *   Who has access: `Anyone`.
    *   Klik `Deploy`.
5.  Salin **Web App URL** (`.../exec`) dan kemaskini variable `GOOGLE_SCRIPT_URL` di dalam fail `src/services/dataService.ts`.

## 📂 Struktur Projek

```
├── public/              # Fail statik (logo, favicon)
├── src/
│   ├── components/      # Komponen UI (ResultCard, Header, dll)
│   ├── services/        # Logik API (Google Script & AI)
│   ├── types.ts         # Definisi TypeScript
│   ├── App.tsx          # Halaman Utama
│   └── main.tsx         # Entry Point
├── index.html           # HTML Template
├── package.json         # Dependencies
├── tailwind.config.js   # (Optional jika guna CDN)
└── vite.config.ts       # Konfigurasi Vite
```

---
&copy; 2025 Assalam Care Malaysia.