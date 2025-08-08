<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$query = "SELECT o.*, c.name AS customer_name, p.name AS product_name, p.image 
          FROM orders o 
          JOIN customers c ON o.customer_id = c.id 
          JOIN products p ON o.product_id = p.id 
          WHERE o.return_requested = 1 
          ORDER BY o.order_date DESC";

$result = mysqli_query($conn, $query);

$orders = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }

    echo json_encode(["orders" => $orders]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Query failed"]);
}
