<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

// Validate and sanitize customer ID
$customer_id = isset($_GET['customer_id']) ? intval($_GET['customer_id']) : 0;

if ($customer_id <= 0) {
  echo json_encode(["error" => "Valid customer ID required"]);
  exit;
}

// Ensure DB connection is okay
if (!$conn || $conn->connect_error) {
  echo json_encode(["error" => "Database connection failed"]);
  exit;
}

$sql = "
SELECT 
  o.id as order_id,
  o.amount,
  o.payment_mode,
  o.razorpay_payment_id,
  o.status,
  o.tracking_status,      
  o.order_date,
  o.return_requested,
  o.return_status,
  o.cancel_reason,
  p.name as product_name,
  p.image,
  a.address_line1,
  a.address_line2,
  a.city,
  a.state,
  a.pincode,
  a.phone,
  a.name as receiver_name
FROM orders o
JOIN products p ON o.product_id = p.id
LEFT JOIN customer_addresses a ON o.address_id = a.id
WHERE o.customer_id = ?
ORDER BY o.order_date DESC
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
  echo json_encode(["error" => "SQL prepare failed", "details" => $conn->error]);
  exit;
}

$stmt->bind_param("i", $customer_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
  $row['total'] = $row['amount'];
  $orders[] = $row;
}

echo json_encode($orders);
