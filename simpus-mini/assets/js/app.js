// ===== Hamburger menu (JS-driven, menggantikan checkbox hack) =====
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

// ===== Fungsi helper untuk update counter baris =====
function updateCounter(table) {
    const counterEl = document.getElementById("counter-text");
    if (!counterEl || !table) return;

    const rows = table.querySelectorAll("tr");
    let total = 0;
    let tampil = 0;

    rows.forEach(function (row, index) {
        if (index === 0) return; // Lewati baris header
        total++;
        if (row.style.display !== "none") {
            tampil++;
        }
    });

    counterEl.textContent = `Menampilkan ${tampil} dari ${total} data`;
}

// ===== Konfirmasi hapus (front-end only, belum ke server) =====
// Memakai event delegation di document karena baris tabel sekarang
// dirender dinamis via fetch (lihat buku.js/anggota.js) sehingga
// tombol .btn-hapus belum tentu ada saat DOMContentLoaded.
function initHapusConfirm() {
    document.addEventListener("click", function (e) {
        console.log(e.target);

        const btn = e.target.closest(".btn-hapus");
        if (!btn) return;

        const row = btn.closest("tr");
        const nama = row ? row.querySelector("td")?.textContent : "data ini";
        const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
        if (yakin && row) {
            row.remove();
        }
    });
}

// ===== Filter/pencarian tabel real-time =====
function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector("table");
    if (!input || !table) return;

    // Inisialisasi counter saat halaman pertama dimuat
    updateCounter(table);

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tr");
        rows.forEach(function (row, index) {
            if (index === 0) return; // Jangan sembunyikan baris header
            const teks = row.textContent.toLowerCase();
            row.style.display = teks.includes(keyword) ? "" : "none";
        });

        // Perbarui counter setiap kali mengetik filter
        updateCounter(table);
    });
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        let valid = true;

        // Daftar field wajib diisi menggunakan array
        const fieldWajib = [
            { selector: "[name='judul'], [name='nama']", pesan: "Field ini wajib diisi." },
            { selector: "[name='pengarang']", pesan: "Pengarang wajib diisi." }
        ];

        fieldWajib.forEach(function (item) {
            const input = form.querySelector(item.selector);
            if (input && input.value.trim() === "") {
                tampilkanError(input, item.pesan);
                valid = false;
            } else if (input) {
                hapusError(input);
            }
        });

        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const nilai = parseInt(tahun.value, 10);
            if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {
                tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilai = parseInt(stok.value, 10);
            if (isNaN(nilai) || nilai < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        const isbn = form.querySelector("[name='isbn']");
        if (isbn && isbn.value.trim() !== "") {
            const isbnPola = /^[0-9-]+$/;
            if (!isbnPola.test(isbn.value.trim())) {
                tampilkanError(isbn, "ISBN hanya boleh berisi angka dan tanda hubung (-).");
                valid = false;
            } else {
                hapusError(isbn);
            }
        } else if (isbn) {
            hapusError(isbn);
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

// Fungsi generik untuk memuat data tabel secara asinkron
async function muatDataGenerik(urlFileJson, selectorTbody, idLoading, daftarKunci, renderTombolAksi) {
    const tbody = document.querySelector(selectorTbody);
    const loading = document.getElementById(idLoading);
    if (!tbody) return;

    if (loading) loading.style.display = "block";
    tbody.innerHTML = "";

    try {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulasi delay

        const res = await fetch(urlFileJson);
        if (!res.ok) {
            throw new Error("Gagal mengambil data (status " + res.status + ")");
        }
        const dataList = await res.json();

        dataList.forEach(function (item) {
            const tr = document.createElement("tr");
            
            // Loop dinamis berdasarkan daftar kunci/properti yang dikirim
            let htmlKolom = "";
            daftarKunci.forEach(function (kunci) {
                htmlKolom += "<td>" + item[kunci] + "</td>";
            });

            // Tambahkan kolom tombol aksi jika ada
            if (renderTombolAksi) {
                htmlKolom += "<td>" + renderTombolAksi(item) + "</td>";
            }

            tr.innerHTML = htmlKolom;
            tbody.appendChild(tr);
        });
    } catch (err) {
        tbody.innerHTML = "<tr><td colspan=\"100\">Gagal memuat data: " + err.message + "</td></tr>";
    } finally {
        if (loading) loading.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
});