<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

$order_id = $_GET['order_id'] ?? null;
$payment_id = $_GET['payment_id'] ?? null;

if (!$order_id && !$payment_id) {
    echo json_encode(['success' => false, 'message' => 'Missing order_id or payment_id']);
    exit;
}

if ($order_id) {
    $sql = "
        SELECT 
            o.*, 
            o.id AS order_id,
            o.return_requested,
            p.name AS product_name,
            p.image AS image,
            p.category AS product_category,
            ca.name AS receiver_name,
            ca.address_line1,
            ca.address_line2,
            ca.city,
            ca.state,
            ca.pincode,
            ca.phone,
            pl.product_price,
            pl.addon_price,
            pl.plan_price,
            pl.total_amount
        FROM orders o
        LEFT JOIN products p ON o.product_id = p.id
        LEFT JOIN customer_addresses ca ON o.address_id = ca.id
        LEFT JOIN payment_logs pl ON o.razorpay_payment_id = pl.payment_id
        WHERE o.id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $order_id);
} else {
    $sql = "
        SELECT 
            o.*, 
            o.id AS order_id,
             o.return_requested,
            p.name AS product_name,
            p.image AS image,
            p.category AS product_category,
            ca.name AS receiver_name,
            ca.address_line1,
            ca.address_line2,
            ca.city,
            ca.state,
            ca.pincode,
            ca.phone,
            pl.product_price,
            pl.addon_price,
            pl.plan_price,
            pl.total_amount
        FROM orders o
        LEFT JOIN products p ON o.product_id = p.id
        LEFT JOIN customer_addresses ca ON o.address_id = ca.id
        LEFT JOIN payment_logs pl ON o.razorpay_payment_id = pl.payment_id
        WHERE o.razorpay_payment_id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $payment_id);
}

$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'order' => $row]);
} else {
    echo json_encode(['success' => false, 'message' => 'Order not found']);
}

$conn->close();
