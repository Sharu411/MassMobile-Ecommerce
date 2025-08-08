<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Get and sanitize inputs
$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
$rejection_reason = isset($_POST['rejection_reason']) ? mysqli_real_escape_string($conn, $_POST['rejection_reason']) : '';

if ($order_id > 0 && !empty($rejection_reason)) {
    $update = "UPDATE orders SET return_status='Rejected', returned=0, rejection_reason='$rejection_reason' WHERE id=$order_id";
    if (mysqli_query($conn, $update)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid ID or missing reason"]);
}
