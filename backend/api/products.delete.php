<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST with _method: DELETE
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['_method']) && $input['_method'] === 'DELETE') {
        include('../config/db.php');

        if (!isset($input['id'])) {
            echo json_encode(["success" => false, "error" => "Missing ID"]);
            exit;
        }

        $id = intval($input['id']);

        mysqli_query($conn, "DELETE FROM productdetail WHERE product_id = $id");

        if (mysqli_query($conn, "DELETE FROM products WHERE id = $id")) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Delete failed"]);
        }

        mysqli_close($conn);
        exit;
    }
}

echo json_encode(["success" => false, "error" => "Invalid request"]);
