<?php
session_start();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Debug Session</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f4f4f4; }
        pre { background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h2>Isi Raw $_SESSION</h2>
    <pre><?php print_r($_SESSION); ?></pre>
</body>
</html>
