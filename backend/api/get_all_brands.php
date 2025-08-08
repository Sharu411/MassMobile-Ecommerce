<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/db.php';

$result = $conn->query("SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL");
$brands = [];

while ($row = $result->fetch_assoc()) {
    $brands[] = $row['brand'];
}

echo json_encode(["brands" => $brands]);
