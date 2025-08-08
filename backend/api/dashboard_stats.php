<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$response = [
  "total_orders" => 0,
  "total_revenue" => 0,
  "total_customers" => 0,
  "total_products" => 0,
  "out_of_stock" => 0,
];

// Get total orders and revenue
$orderSql = "SELECT COUNT(*) AS total_orders, SUM(amount) AS total_revenue FROM orders";
$orderResult = mysqli_query($conn, $orderSql);
if ($orderRow = mysqli_fetch_assoc($orderResult)) {
  $response['total_orders'] = (int)$orderRow['total_orders'];
  $response['total_revenue'] = (float)$orderRow['total_revenue'];
}

// Get total customers
$customerSql = "SELECT COUNT(*) AS total_customers FROM customers";
$customerResult = mysqli_query($conn, $customerSql);
if ($customerRow = mysqli_fetch_assoc($customerResult)) {
  $response['total_customers'] = (int)$customerRow['total_customers'];
}

// ✅ Get total products
$productSql = "SELECT COUNT(*) AS total_products FROM products WHERE quantity>0";
$productResult = mysqli_query($conn, $productSql);
if ($productRow = mysqli_fetch_assoc($productResult)) {
  $response['total_products'] = (int)$productRow['total_products'];
}

// ✅ Get out-of-stock count (quantity = 0)
$outOfStockSql = "SELECT COUNT(*) AS out_of_stock FROM products WHERE quantity = 0";
$outOfStockResult = mysqli_query($conn, $outOfStockSql);
if ($outOfStockRow = mysqli_fetch_assoc($outOfStockResult)) {
  $response['out_of_stock'] = (int)$outOfStockRow['out_of_stock'];
}

echo json_encode($response);
?>
