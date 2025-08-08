<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$result = $conn->query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL");

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row['category'];
}

echo json_encode(["categories" => $categories]);
