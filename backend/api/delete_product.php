<?php
// Allow CORS for any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

require_once('../config/db.php');

// Enable error reporting for debugging (remove in prod)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Grab the ID from the query string
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid product ID"
    ]);
    exit;
}

$id = (int) $_GET['id'];

// Prepare and execute the DELETE
$sql  = "DELETE FROM `products` WHERE `id` = ?";
$stmt = $conn->prepare($sql);

if (! $stmt) {
    http_response_code(500);
    error_log("Prepare failed: " . $conn->error);
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Product deleted successfully"
    ]);
} else {
    http_response_code(500);
    error_log("Execute failed: " . $stmt->error);
    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);
}
