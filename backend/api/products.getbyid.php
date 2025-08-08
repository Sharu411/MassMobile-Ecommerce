<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Missing product ID']);
    exit;
}

$product_id = intval($_GET['id']);

$sql = "SELECT 
            p.id, p.name, p.description, p.price, p.offer_price, p.image, p.quantity, 
            p.brand,p.imei, p.category, p.color, p.video, 
            d.ram, d.storage, d.battery, d.warrenty AS warranty, d.condition, 
            d.discount_percentage, d.rear_camera, d.front_camera, d.display, 
            d.network_type, d.full_kit, d.sim_type,d.processor
        FROM products p
        LEFT JOIN productdetail d ON p.id = d.product_id
        WHERE p.id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $product = $result->fetch_assoc();
    echo json_encode($product);
} else {
    echo json_encode(['error' => 'Product not found']);
}

$stmt->close();
$conn->close();
