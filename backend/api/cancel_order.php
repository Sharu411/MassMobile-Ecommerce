<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$order_id = isset($data['order_id']) ? intval($data['order_id']) : 0;
$reason = isset($data['reason']) ? trim($data['reason']) : '';

if ($order_id <= 0) {
  echo json_encode(["success" => false, "message" => "Invalid order ID"]);
  exit;
}

if (empty($reason)) {
  echo json_encode(["success" => false, "message" => "Cancellation reason required"]);
  exit;
}

// Step 1: Check current order status
$checkQuery = "SELECT status, tracking_status, product_id FROM orders WHERE id = ?";

$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
  echo json_encode(["success" => false, "message" => "Order not found"]);
  exit;
}
if (in_array($row['status'], ['Delivered']) || in_array($row['tracking_status'], ['Out for Delivery', 'Delivered'])) {
  echo json_encode([
    "success" => false,
    "message" => "Order cannot be cancelled at this stage. Please receive the product and use the Return option if needed."
  ]);
  exit;
}


$product_id = $row['product_id'];

// Step 2: Update order as cancelled
$updateQuery = "UPDATE orders SET status = 'Cancelled', cancel_reason = ?, cancelled_at = NOW() WHERE id = ?";
$stmt = $conn->prepare($updateQuery);
$stmt->bind_param("si", $reason, $order_id);

if ($stmt->execute()) {
  // Step 3: Increase product quantity by 1
  $updateQtyQuery = "UPDATE products SET quantity = quantity + 1 WHERE id = ?";
  $stmtQty = $conn->prepare($updateQtyQuery);
  $stmtQty->bind_param("i", $product_id);
  $stmtQty->execute();

  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Cancel failed"]);
}
?>
