<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$name = $_GET['name'] ?? '';

if (!$name) {
  echo json_encode([]);
  exit;
}

// JOIN products with productdetail to get full details
$sql = "
SELECT p.*, d.colour, d.storage, d.condition 
FROM products p 
LEFT JOIN productdetail d ON p.id = d.product_id 
WHERE p.name = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $name);
$stmt->execute();

$result = $stmt->get_result();
$variants = [];

while ($row = $result->fetch_assoc()) {
  $variants[] = $row;
}

echo json_encode($variants);
