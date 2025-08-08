<?php
// Allow CORS for any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

require_once('../config/db.php');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Read JSON input
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["message" => "Product ID is required"]);
    exit;
}

$id = $data->id;
$name = $data->name;
$brand = $data->brand;
$price = $data->price;
$image=$data->image;
$quantity = $data->quantity;

$sql = "UPDATE products SET name=?, brand=?, price=?,image=?, quantity=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdsii", $name, $brand, $price,$image, $quantity, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Product updated successfully"]);
} else {
    echo json_encode(["message" => "Update failed"]);
}
?>
