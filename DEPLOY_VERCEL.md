# Panduan Deploy Luma ke Vercel

## Langkah 1: Siapkan Database PostgreSQL (Gratis)

### Opsi A: Neon (Recommended)
1. Buka https://neon.tech dan daftar gratis
2. Create new project → Nama: `luma`
3. Copy **Connection String** yang diberikan
   ```
   postgresql://user:password@ep-xxx.neon.tech/luma?sslmode=require
   ```

### Opsi B: Supabase
1. Buka https://supabase.com dan daftar
2. Create new project
3. Pergi ke Settings → Database → Connection string (URI)

---

## Langkah 2: Push Kode ke GitHub

```bash
# Di folder luma
git init
git add .
git commit -m "Ready for Vercel deployment"

# Buat repo baru di github.com, lalu:
git remote add origin https://github.com/USERNAME/luma.git
git branch -M main
git push -u origin main
```

---

## Langkah 3: Deploy ke Vercel

1. Buka https://vercel.com dan login dengan GitHub
2. Klik **"Add New..."** → **"Project"**
3. Import repository `luma` dari GitHub
4. **PENTING**: Tambahkan Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Connection string dari Neon/Supabase |
| `NEXTAUTH_SECRET` | `supersecretkey123` (atau generate baru) |
| `NEXTAUTH_URL` | Biarkan kosong dulu, update setelah deploy |
| `GROQ_API_KEY` | API key dari console.groq.com |

5. Klik **Deploy**
6. Tunggu build selesai (~2-3 menit)

---

## Langkah 4: Setup Database

Setelah deploy berhasil, jalankan di terminal lokal:

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database cloud
npx prisma db push
```

Atau di Vercel, bisa jalankan via Build Command:
```
npx prisma generate && npx prisma db push && next build
```

---

## Langkah 5: Update NEXTAUTH_URL

1. Setelah deploy, Vercel akan memberikan URL seperti:
   `https://luma-xxx.vercel.app`
2. Pergi ke Vercel Dashboard → Project → Settings → Environment Variables
3. Update `NEXTAUTH_URL` dengan URL tersebut
4. Redeploy

---

## ✅ Selesai!

Aplikasi Luma sekarang live di:
```
https://luma-xxx.vercel.app
```

---

## Troubleshooting

**Error: Can't reach database server**
- Pastikan DATABASE_URL sudah benar
- Cek apakah IP Vercel sudah di-whitelist di Neon/Supabase

**Error: NEXTAUTH_URL mismatch**
- Update NEXTAUTH_URL sesuai domain Vercel

**Error: Prisma Client not generated**
- Tambahkan `"postinstall": "prisma generate"` di package.json scripts
