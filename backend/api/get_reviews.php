<?php
include '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET['product_id'])) {
    echo json_encode([]);
    exit;
}

$productId = intval($_GET['product_id']);
$sql = "SELECT nickname, summary, review, rating, created_at 
        FROM product_reviews 
        WHERE product_id = $productId 
        ORDER BY created_at DESC";

$result = mysqli_query($conn, $sql);

$reviews = [];
while ($row = mysqli_fetch_assoc($result)) {
    $reviews[] = $row;
}

echo json_encode($reviews);
