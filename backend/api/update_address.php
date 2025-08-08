<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

include_once(__DIR__ . '/../config/db.php');


$data = json_decode(file_get_contents("php://input"), true);

$address_id = $data['address_id'] ?? null;
$customer_id = $data['customer_id'] ?? null;

if (!$address_id || !$customer_id) {
  echo json_encode(["success" => false, "message" => "Missing address ID"]);
  exit;
}

$sql = "UPDATE customer_addresses SET 
          name=?, phone=?, pincode=?, address_line1=?, address_line2=?, 
          city=?, state=?, landmark=?, is_default=? 
        WHERE id=? AND customer_id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "ssssssssiii",
  $data['name'], $data['phone'], $data['pincode'],
  $data['address_line1'], $data['address_line2'], $data['city'],
  $data['state'], $data['landmark'], $data['is_default'],
  $address_id, $customer_id
);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
