<?php
require __DIR__ . '/includes/koneksi.php';

// Path diarahkan ke dalam folder data/buku.json
$json_file = 'data/buku.json'; 

if (!file_exists($json_file)) {
    die("Error: File $json_file tidak ditemukan! Pastikan foldernya sudah benar.");
}

$json_data = file_get_contents($json_file);
$buku_list = json_decode($json_data, true);

if ($buku_list === null) {
    die("Error: Format JSON tidak valid!");
}

$jumlah_sukses = 0;
$jumlah_gagal = 0;

foreach ($buku_list as $buku) {
    $judul     = $buku['judul'] ?? '';
    $pengarang = $buku['pengarang'] ?? '';
    $tahun     = $buku['tahun'] ?? 2024;
    $stok      = $buku['stok'] ?? 1;

    try {
        $stmt = $pdo->prepare("INSERT INTO buku (judul, pengarang, tahun, stok) VALUES (:judul, :pengarang, :tahun, :stok)");
        $stmt->execute([
            'judul'     => $judul,
            'pengarang' => $pengarang,
            'tahun'     => $tahun,
            'stok'      => $stok
        ]);
        $jumlah_sukses++;
    } catch (PDOException $e) {
        echo "Gagal memasukkan buku '$judul': " . $e->getMessage() . "<br>";
        $jumlah_gagal++;
    }
}

echo "<h3>Proses Migrasi Selesai!</h3>";
echo "Total data berhasil dipindahkan: <strong>$jumlah_sukses</strong><br>";
echo "Total data gagal: <strong>$jumlah_gagal</strong>";
?>