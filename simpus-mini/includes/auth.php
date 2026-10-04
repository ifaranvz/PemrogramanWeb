<?php
// Guard clause: di-include di baris paling atas setiap halaman yang
// membutuhkan login (sebelum header.php mengeluarkan output apa pun),
// agar header('Location: ...') masih bisa dipanggil.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Jika belum login lewat session, cek apakah ada cookie "Ingat Saya"
if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_user'])) {
    require_once __DIR__ . '/koneksi.php';
    
    $user_id = $_COOKIE['remember_user'];
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nama'] = $user['nama'];
        $_SESSION['role'] = $user['role'];
    }
}

// Jika tetap tidak ada session (cookie tidak ada/invalid), lempar ke halaman login
if (!isset($_SESSION['user_id'])) {
    header('Location: ../auth/login.php');
    exit;
}