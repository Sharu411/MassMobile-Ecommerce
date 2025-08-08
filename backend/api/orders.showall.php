<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$sql = "SELECT 
          o.id, c.name AS customer_name, o.amount AS total, o.status, o.delivered_at,
          o.tracking_status, o.order_date AS date, o.payment_mode, o.razorpay_payment_id,
          p.name AS product_name
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN products p ON o.product_id = p.id
        ORDER BY o.id DESC";

$result = mysqli_query($conn, $sql);
$orders = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = [
            "id" => $row['id'],
            "name" => $row['customer_name'],
            "product_name" => $row['product_name'],
            "total" => $row['total'],
            "status" => $row['status'],
             "delivered_at" => $row['delivered_at'],
            "tracking_status" => $row['tracking_status'],
            "date" => $row['date'],
            "payment_mode" => $row['payment_mode'],
            "payment_id" => $row['payment_id'] ?? null
        ];
    }
    echo json_encode(["orders" => $orders]);
} else {
    echo json_encode(["error" => "Failed to fetch orders"]);
}

mysqli_close($conn);
