<?php
// Allow requests from React frontend (CORS setup)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Include DB connection
include_once("../config/db.php");

// Fetch all products
$query = "SELECT * FROM products";
$result = mysqli_query($conn, $query);

$products = [];

while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

// Return products as JSON
echo json_encode($products);
?>
