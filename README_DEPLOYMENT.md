# Panduan Deployment SWAPRO

## Masalah Deployment ke Vercel

Aplikasi SWAPRO adalah full-stack application dengan Express.js backend dan React frontend. Vercel hanya mendukung static sites atau serverless functions, bukan Express server yang berjalan terus menerus.

## Solusi Deployment

### Opsi 1: Deploy Frontend ke Vercel + Backend ke Railway/Render

1. **Frontend di Vercel:**
   - Gunakan konfigurasi `vercel.json` yang sudah dibuat
   - Set environment variable `VITE_API_BASE_URL` ke URL backend
   - Deploy hanya folder frontend

2. **Backend di Railway/Render:**
   - Deploy folder `server/` ke platform yang mendukung Node.js
   - Set environment variables untuk database

### Opsi 2: Deploy Keseluruhan ke Railway/Render

1. **Railway.app (Recommended):**
   - Langsung deploy keseluruhan repo
   - Railway otomatis mendeteksi dan menjalankan Express server
   - Set environment variables untuk production

2. **Render.com:**
   - Deploy sebagai Web Service
   - Set build command: `npm run build`
   - Set start command: `npm start`

### Opsi 3: Mengubah untuk Vercel (Memerlukan Refactoring)

Jika tetap ingin menggunakan Vercel, perlu mengubah:
1. Backend menjadi Vercel serverless functions
2. Database menjadi serverless (Vercel Postgres/Supabase)
3. Struktur folder menjadi `/api` functions

## Environment Variables yang Diperlukan

```
DATABASE_URL=your_postgres_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
NODE_ENV=production
```

## Langkah Deployment ke Railway (Termudah)

1. Push code ke GitHub
2. Connect GitHub repo ke Railway
3. Set environment variables
4. Deploy otomatis berjalan
5. Akses melalui URL yang diberikan Railway

## Catatan Penting

- Vercel tidak cocok untuk aplikasi full-stack dengan Express server
- Railway/Render lebih cocok untuk deployment ini
- Konfigurasi saat ini sudah optimal untuk Railway