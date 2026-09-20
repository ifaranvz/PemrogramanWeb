<?php
session_start();

// Mengosongkan variabel $_SESSION dan menghancurkan sesi di server
session_unset();
session_destroy();

// Mulai sesi baru untuk mengirimkan flash message konfirmasi
session_start();
$_SESSION['flash'] = ['type' => 'success', 'pesan' => 'Seluruh data sesi berhasil di-reset.'];

header('Location: index.php');
exit;