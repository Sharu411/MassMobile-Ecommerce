<?php
include '../config/db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// For preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);
$customer_id = $data['customer_id'] ?? null;

if (!$customer_id) {
    echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
    exit;
}

// Safely extract values (use null coalescing to prevent undefined values)
$name         = $conn->real_escape_string($data['name'] ?? '');
$phone        = $conn->real_escape_string($data['phone'] ?? '');
$pincode      = $conn->real_escape_string($data['pincode'] ?? '');
$address1     = $conn->real_escape_string($data['address_line1'] ?? '');
$address2     = $conn->real_escape_string($data['address_line2'] ?? '');
$city         = $conn->real_escape_string($data['city'] ?? '');
$state        = $conn->real_escape_string($data['state'] ?? '');
$landmark     = $conn->real_escape_string($data['landmark'] ?? '');
$is_default   = isset($data['is_default']) && $data['is_default'] ? 1 : 0;

// Check for required fields
if (empty($name) || empty($phone) || empty($pincode) || empty($address1) || empty($city) || empty($state)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// If default, unset previous defaults
if ($is_default) {
    $conn->query("UPDATE customer_addresses SET is_default = 0 WHERE customer_id = $customer_id");
}

// Now insert the address
$sql = "INSERT INTO customer_addresses 
(customer_id, name, phone, pincode, address_line1, address_line2, city, state, landmark, is_default)
VALUES 
($customer_id, '$name', '$phone', '$pincode', '$address1', '$address2', '$city', '$state', '$landmark', $is_default)";

if ($conn->query($sql)) {
    echo json_encode(['success' => true, 'message' => 'Address added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}

$conn->close();
?>
