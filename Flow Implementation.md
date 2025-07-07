# Langkah-langkah Pengembangan Todolist App

## 1. Pembuatan PRD (Product Requirements Document)

Meminta Claude AI untuk membuat PRD basic untuk todolist app dengan fitur yang diminta:

```
create prd with basic function of todolist application.
- todolist consist of: task, description, deadline
- database is sqlite
- backend using express js with javascript
- frontend using basic html, Tailwind CSS 
- focus on mvp and this project will be develop by claude code.
```

## 2. Menyimpan PRD

Membuat file PRD di folder project `./docs/prd.md` menggunakan hasil dari prompt di atas.

## 3. Inisialisasi Project dengan Claude Code

Masuk ke Claude Code dan meminta untuk membuat project menggunakan PRD yang sudah dibuat:

```
create application using ./docs/prd.md document
```

## 4. Mengikuti Instruksi Setup

Mengikuti instruksi dari Claude Code untuk membuatkan project ini.

## 5. Testing Project Awal

Menjalankan project dan memastikan berjalan sesuai dengan PRD yang dibuat.

## 6. Penambahan Fitur Authentication

Menambahkan fitur register dan login dengan prompt:

```
add register and login feature using basic user and password (no need to use JWT) into backend
add register and login feature on frontend
update prd.md and readme.md with new feature
```

## 7. Testing Fitur Authentication

Menjalankan project dan memastikan fitur authentication berjalan sesuai permintaan.

## 8. Upgrade ke JWT Authentication

Mengubah mekanisme authentication menggunakan JWT:

```
update authentication using JWT to the application
update prd.md and readme.md with new feature
```

## 9. Redesign UI Modern

Mengubah design agar menjadi lebih modern dengan color scheme biru:

```
Redesign the user interface to be more modern, sleek, and incorporate a bluish color scheme with contemporary design elements.
```

## 10. Setup Git dan Environment

Membuat file konfigurasi untuk deployment:

```
create gitignore file
create .env file and update backend to use .env file
```

## 11. Fixing Environment Variables

Mengatasi masalah backend yang belum membaca .env file:

```
it looks like env values is not found. i have got Environment: undefined on terminal log. analyze and fix it
```

## 12. Troubleshooting Database Error

Mengatasi error database SQLite:

```
Error opening database: [Error: SQLITE_CANTOPEN: unable to open database file] {
  errno: 14,
  code: 'SQLITE_CANTOPEN'
}
Failed to initialize database: [Error: SQLITE_CANTOPEN: unable to open database file] {
  errno: 14,
  code: 'SQLITE_CANTOPEN'
}
```

## 13. Manual Fix Environment File

Memindahkan manual file `.env` ke folder backend untuk mengatasi masalah konfigurasi, dan aplikasi berjalan dengan baik.

## 14. Update Dokumentasi

Memperbarui dokumentasi dengan fitur-fitur terbaru:

```
update prd.md and readme.md with latest updated feature  
```

## 15. Deployment ke GitHub

Melakukan commit dan push semua perubahan ke GitHub:

```
commit and push all changes to github https://github.com/anggamalau/binar-wshop-09.git
```

---

## Ringkasan

Project todolist app berhasil dikembangkan dengan fitur lengkap meliputi:
- CRUD todolist (task, description, deadline)
- Authentication dengan JWT
- UI modern dengan color scheme biru
- Database SQLite
- Backend Express.js
- Frontend HTML + Tailwind CSS

Project telah berhasil di-deploy ke GitHub repository: https://github.com/anggamalau/binar-wshop-09.git