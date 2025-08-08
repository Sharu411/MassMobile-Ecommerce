<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // allow POST and preflight
header("Access-Control-Allow-Headers: Content-Type");   // 👈 allow Content-Type header

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Your normal logic starts here
include '../config/db.php';
// ...


$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? 0;
$status = $data['tracking_status'] ?? '';

if (!$order_id || !$status) {
  echo json_encode(["success" => false, "message" => "Missing fields"]);
  exit;
}

if ($status === 'Delivered') {
  $sql = "UPDATE orders SET tracking_status = ?, status = 'Delivered', delivered_at = NOW() WHERE id = ?";
} else {
  $sql = "UPDATE orders SET tracking_status = ? WHERE id = ?";
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
  echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
  exit;
}

$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
