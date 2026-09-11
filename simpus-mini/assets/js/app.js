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
function initHapusConfirm() {
    const table = document.querySelector("table");
    document.querySelectorAll(".btn-hapus").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const row = btn.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
            if (yakin && row) {
                row.remove();
                if (table) {
                    updateCounter(table);
                }
            }
        });
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

        const judul = form.querySelector("[name='judul'], [name='nama']");
        if (judul && judul.value.trim() === "") {
            tampilkanError(judul, "Field ini wajib diisi.");
            valid = false;
        } else if (judul) {
            hapusError(judul);
        }

        const pengarang = form.querySelector("[name='pengarang']");
        if (pengarang && pengarang.value.trim() === "") {
            tampilkanError(pengarang, "Pengarang wajib diisi.");
            valid = false;
        } else if (pengarang) {
            hapusError(pengarang);
        }

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

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
});