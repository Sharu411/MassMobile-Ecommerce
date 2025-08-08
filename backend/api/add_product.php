<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No JSON data received."]);
    exit;
}

// Validate input
if (
    !isset($data['name'], $data['brand'], $data['price'], $data['offer_price'], $data['quantity'], $data['image'], $data['description'], $data['imei'])
) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit;
}

$name = $data['name'];
$brand = $data['brand'];
$price = (float) $data['price'];
$offer_price = (float) $data['offer_price'];
$quantity = (int) $data['quantity'];
$image = $data['image'];
$description = $data['description'];
$imei = $data['imei'];

$stmt = $conn->prepare("INSERT INTO products (name, brand, price, offer_price, quantity, image, description, imei) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssddisss", $name, $brand, $price, $offer_price, $quantity, $image, $description, $imei);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product added successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
