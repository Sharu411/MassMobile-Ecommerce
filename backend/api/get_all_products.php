<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$sql = "SELECT 
            p.id, 
            p.name, 
            p.price, 
            p.offer_price, 
            p.image, 
            p.brand, 
            p.offer_name
        FROM products p
        ORDER BY p.id DESC";

$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode(["products" => $products]);
?>
