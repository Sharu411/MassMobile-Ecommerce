<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('../config/db.php'); // ✅ make sure path is correct

$data = json_decode(file_get_contents("php://input"), true);
$customer_id = $data['customer_id'];

$response = ['success' => false];

if ($customer_id) {
    $stmt = $conn->prepare("SELECT * FROM customer_addresses WHERE customer_id = ?");
    $stmt->bind_param("i", $customer_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $addresses = [];
    while ($row = $result->fetch_assoc()) {
        $addresses[] = $row;
    }

    $response['success'] = true;
    $response['addresses'] = $addresses;
}

echo json_encode($response);
