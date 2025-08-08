<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$response = [
  'totalOrders' => 0,
  'totalRevenue' => 0,
  'totalProducts' => 0,
  'lowStock' => 0
];

// Total Orders
$orderQuery = mysqli_query($conn, "SELECT COUNT(*) AS total FROM orders");
$orderData = mysqli_fetch_assoc($orderQuery);
$response['totalOrders'] = (int) $orderData['total'];

// Total Revenue
$revenueQuery = mysqli_query($conn, "SELECT SUM(amount) AS revenue FROM orders");
$revenueData = mysqli_fetch_assoc($revenueQuery);
$response['totalRevenue'] = (int) $revenueData['revenue'];

// Total Products
$productQuery = mysqli_query($conn, "SELECT COUNT(*) AS total FROM products");
$productData = mysqli_fetch_assoc($productQuery);
$response['totalProducts'] = (int) $productData['total'];

// Low Stock Products (quantity <= 5)
$lowStockQuery = mysqli_query($conn, "SELECT COUNT(*) AS low FROM products WHERE quantity <= 5");
$lowStockData = mysqli_fetch_assoc($lowStockQuery);
$response['lowStock'] = (int) $lowStockData['low'];

echo json_encode($response);
?>
