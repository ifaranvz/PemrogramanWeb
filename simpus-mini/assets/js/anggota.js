// Fungsi untuk memuat daftar anggota menggunakan fungsi generik dari app.js
function muatDaftarAnggota() {
    muatDataGenerik(
        "../data/anggota.json",
        ".table-responsive table tbody",
        "loading-indicator",
        ["no_anggota", "nama", "alamat", "no_hp"],
        (anggota) => '<button type="button">Edit</button> <button type="button" class="btn-hapus">Hapus</button>'
    );
}

// Jalankan saat halaman pertama kali dibuka
document.addEventListener("DOMContentLoaded", muatDaftarAnggota);