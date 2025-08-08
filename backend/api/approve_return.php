<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;

if ($order_id > 0) {
    $update = "UPDATE orders SET return_status='Approved', returned=1 WHERE id=$order_id";
    if (mysqli_query($conn, $update)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid ID"]);
}
