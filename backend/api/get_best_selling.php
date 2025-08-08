<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

// You can update this query to match your own sorting logic
$sql = "SELECT id, name, brand, price, image, quantity FROM products ORDER BY created_at DESC LIMIT 10";

$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {   /*http://localhost/ecommerce-website/backend/images/*/
        $row['image_url'] = "http://massmobile.byethost13.com/backend/api/images/" . $row['image'];
        $products[] = $row;  /*http://massmobile.byethost13.com/backend/api/images/*/
    }
}

echo json_encode($products);
$conn->close();
?>
