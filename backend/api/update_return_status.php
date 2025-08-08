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
$order_id = intval($data['order_id']);
$return_status = $data['return_status'];

if (!$order_id || !$return_status) {
  echo json_encode(["success" => false, "message" => "Missing data"]);
  exit;
}

// Step 1: Update return_status in orders table
$stmt = $conn->prepare("UPDATE orders SET return_status = ? WHERE id = ?");
$stmt->bind_param("si", $return_status, $order_id);

if ($stmt->execute()) {

  // Step 2: If return is approved, increase product quantity
  if ($return_status === 'Approved') {
    // Get the product_id from this order
    $getProductStmt = $conn->prepare("SELECT product_id FROM orders WHERE id = ?");
    $getProductStmt->bind_param("i", $order_id);
    $getProductStmt->execute();
    $result = $getProductStmt->get_result();
    $row = $result->fetch_assoc();

    if ($row) {
      $product_id = $row['product_id'];

      // Increase quantity
      $updateQtyStmt = $conn->prepare("UPDATE products SET quantity = quantity + 1 WHERE id = ?");
      $updateQtyStmt->bind_param("i", $product_id);
      $updateQtyStmt->execute();
    }
  }

  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>
