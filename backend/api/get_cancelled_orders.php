<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$query = "
SELECT 
  o.id AS order_id,
  o.amount,
  o.status,
  o.order_date,
  o.cancel_reason,
  c.name AS customer_name,
  c.email,
  c.phone,
  p.name AS product_name,
  p.image
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
WHERE o.status = 'Cancelled'
ORDER BY o.order_date DESC
";

$result = $conn->query($query);
$orders = [];

if ($result) {
  while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
  }
  echo json_encode(["orders" => $orders]);
} else {
  echo json_encode(["error" => "Query failed", "details" => $conn->error]);
}
?>
