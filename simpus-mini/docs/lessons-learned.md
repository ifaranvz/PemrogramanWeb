# Lessons Learned: Catatan & Refleksi Pengembangan `simpus-mini`

> **Mata Kuliah:** Pemrograman Web (Jobsheet 1–13)  
> **Proyek:** Sistem Informasi Perpustakaan Mini (`simpus-mini`)

---

## 1. Konsep Paling Menantang

Selama menyelesaikan rangkaian 13 jobsheet pada aplikasi `simpus-mini`, ada tiga topik utama yang menurut saya paling menantang sekaligus paling memberikan pemahaman mendalam tentang pengembangan aplikasi web modern:

1. **Jobsheet 10: Autentikasi & Otorisasi** (*Login*, *Register*, dan Pembatasan Hak Akses)
2. **Jobsheet 11: Keamanan Aplikasi Web** (Pencegahan *XSS*, *CSRF*, dan *Session Fixation*)
3. **Jobsheet 12: Integrasi Peminjaman** (*Database Transaction*, Relasi Tabel, dan Validasi Bisnis)

---

## 2. Mengapa Konsep-Konsep Tersebut Menantang?

### Autentikasi & Keamanan (Jobsheet 10 & 11)
* **Memahami Celah Keamanan Riil:** Tantangan utama dalam aspek keamanan adalah mengubah pola pikir dari sekadar "membuat fitur berjalan" menjadi "memastikan fitur tidak bisa disalahgunakan".
* **Pencegahan XSS & CSRF:** Mengimplementasikan sanitasi input/output secara konsisten di setiap halaman serta mengelola *CSRF Token* pada setiap form POST memerlukan ketelitian tinggi.
* **Pengelolaan Sesi yang Safe:** Menangani *Session Fixation* melalui regenerasi ID sesi (`session_regenerate_id()`) saat login dan memastikan pembatasan otorisasi agar halaman khusus petugas tidak bisa diakses langsung oleh tamu/publik.

### Integrasi Peminjaman & Transaksi (Jobsheet 12)
* **Keterhubungan Antar Tabel:** Mengelola relasi multi-tabel antara `anggota`, `buku`, dan `peminjaman` menggunakan kueri SQL bersarang dan *JOIN* yang akurat.
* **Integritas Data (*Database Transaction*):** Menggabungkan beberapa alur bisnis (mengecek keterlambatan, mengunci stok buku, mencatat peminjaman, dan mengurangi stok) ke dalam satu blok transaksi (`beginTransaction`, `commit`, `rollBack`). Jika ada satu langkah yang gagal, seluruh proses harus dibatalkan agar data di database tetap konsisten dan tidak rusak.

---

## 3. Solusi & Pembelajaran yang Diperoleh

* **Pola Pikir *Security-First*:** Berhasil menerapkan validasi berlapis—mulai dari `htmlspecialchars()` untuk penanganan XSS, *token CSRF* untuk keamanan form, hingga autentikasi sesi pada header halaman.
* **Keandalan Transaksi Data:** Memahami pentingnya penguncian baris (`FOR UPDATE`) dan *Database Transaction* untuk mencegah *race condition* pada stok buku saat diakses secara bersamaan.
* **Penanganan Eksepsi yang Rapi:** Menggunakan blok `try-catch` bersama *flash message* untuk memberikan umpan balik (*feedback*) yang jelas dan informatif kepada pengguna ketika terjadi kesalahan transaksi.

---

## 4. Kesimpulan untuk Persiapan Presentasi UAS

Pengalaman mengerjakan Jobsheet 10, 11, dan 12 memberikan gambaran nyata bahwa membangun aplikasi web bukan hanya tentang tampilan dan fungsi CRUD dasar, melainkan juga tentang **keamanan, keandalan data, dan arsitektur kode yang rapi**. Pemahaman mendalam atas konsep-konsep ini menjadi modal utama dan poin kunci yang siap saya refleksikan serta presentasikan pada UAS.