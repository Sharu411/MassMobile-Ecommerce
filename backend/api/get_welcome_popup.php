<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/db.php';

if (!$conn || $conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$result = $conn->query("SELECT * FROM welcome_popup ORDER BY id DESC LIMIT 1");
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(["status" => "disabled", "image" => "", "link" => ""]);
}
?>
