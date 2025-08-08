<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
include_once(__DIR__ . '/../config/db.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$address_id = $data['address_id'] ?? null;
$customer_id = $data['customer_id'] ?? null;

if (!$address_id || !$customer_id) {
  echo json_encode(["success" => false, "message" => "Missing data"]);
  exit;
}

$sql = "DELETE FROM customer_addresses WHERE id = ? AND customer_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $address_id, $customer_id);
if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Delete failed"]);
}
?>
