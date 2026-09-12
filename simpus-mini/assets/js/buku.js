// Fungsi untuk memuat daftar buku memanggil fungsi generik dari app.js
function muatDaftarBuku() {
    muatDataGenerik(
        "../data/buku.json",
        ".table-responsive table tbody",
        "loading-indicator",
        ["judul", "pengarang", "tahun", "stok"],
        (buku) => '<button type="button">Edit</button> <button type="button" class="btn-hapus">Hapus</button>'
    );
}

// Jalankan saat halaman pertama kali dibuka
document.addEventListener("DOMContentLoaded", muatDaftarBuku);

// Event listener untuk tombol muat ulang
document.getElementById('btnMuatUlang').addEventListener('click', () => {
    muatDaftarBuku();
});