<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include_once('../config/db.php');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

$category = $data['category'] ?? null;
$brand = $data['brand'] ?? null;
$offer_name = $data['offer_name'] ?? null;


// Validate required field
if (!$offer_name) {
    echo json_encode(["success" => false, "message" => "Offer name is required"]);
    exit;
}

// Build SQL
$sql = "UPDATE products SET offer_name = ?";
$conditions = [];
$params = [$offer_name];
$types = "s";

if (!empty($category)) {
    $conditions[] = "category = ?";
    $params[] = $category;
    $types .= "s";
}

if (!empty($brand)) {
    $conditions[] = "brand = ?";
    $params[] = $brand;
    $types .= "s";
}

if (count($conditions) > 0) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL error: " . $conn->error]);
    exit;
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Offer applied successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database update failed"]);
}

$stmt->close();
$conn->close();
