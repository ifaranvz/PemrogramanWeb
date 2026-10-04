<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require __DIR__ . '/../includes/koneksi.php';

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// 1. Inisialisasi array percobaan login jika belum ada
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = [];
}

// 2. Cek apakah username ini sudah gagal 3 kali atau lebih
$attempts = $_SESSION['login_attempts'][$username] ?? 0;
if ($attempts >= 3) {
    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'Terlalu banyak percobaan login gagal! Akun terblokir sementara.'
    ];
    header('Location: login.php');
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    // 3. Login sukses -> Hapus/reset hitungan gagal untuk username ini
    unset($_SESSION['login_attempts'][$username]);

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['nama'] = $user['nama'];
    $_SESSION['role'] = $user['role'];

    // Fitur "Ingat Saya": buat cookie berlaku 7 hari jika checkbox dicentang
    if (isset($_POST['remember_me'])) {
        $cookie_value = $user['id'];
        $cookie_expire = time() + (7 * 24 * 60 * 60); // 7 hari
        setcookie('remember_user', $cookie_value, $cookie_expire, '/', '', false, true);
    }

    header('Location: ../index.php');
    exit;
}

// 4. Login gagal -> Tambah hitungan percobaan gagal (+1)
$_SESSION['login_attempts'][$username] = $attempts + 1;
$sisa_percobaan = 3 - $_SESSION['login_attempts'][$username];

if ($sisa_percobaan > 0) {
    $pesan_error = "Username atau password salah. Sisa percobaan: {$sisa_percobaan}";
} else {
    $pesan_error = "Terlalu banyak percobaan login gagal! Akun terblokir sementara.";
}

$_SESSION['flash'] = ['type' => 'error', 'pesan' => $pesan_error];
header('Location: login.php');
exit;