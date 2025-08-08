<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php'; // Adjust path if needed

$data = json_decode(file_get_contents("php://input"), true);
$order_id = isset($data['order_id']) ? intval($data['order_id']) : 0;

if ($order_id <= 0) {
  echo json_encode(["success" => false, "message" => "Invalid order ID"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"));
$order_id = $data->order_id;
$reason = $data->reason ?? '';

$query = "UPDATE orders SET return_requested = 1, return_reason = ?, return_status = 'Requested' WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $reason, $order_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Database update failed"]);
}
?>
