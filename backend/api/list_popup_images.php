<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Folder path relative to this script
$imagesDir = '../api/images/welcome_popup/';
$baseUrl = 'http://localhost:8000/api/images/welcome_popup/';

if (!is_dir($imagesDir)) {
    echo json_encode(["images" => []]);
    exit;
}

$files = scandir($imagesDir);

$imageUrls = [];
foreach ($files as $file) {
    if (!in_array($file, ['.', '..']) && is_file($imagesDir . $file)) {
        $imageUrls[] = $baseUrl . $file;
    }
}

echo json_encode(["images" => $imageUrls]);
