<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('../config/db.php');

$razorpaySecret = "qVTDahEZWQYCrs61Bc62VQdw";
$input = json_decode(file_get_contents("php://input"), true);

file_put_contents("verify_log.txt", date("Y-m-d H:i:s") . " - " . json_encode($input) . PHP_EOL, FILE_APPEND);

// === Validation ===
if (
    empty($input['razorpay_order_id']) ||
    empty($input['razorpay_payment_id']) ||
    empty($input['razorpay_signature']) ||
    empty($input['orderDetails'])
) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// === Signature Check ===
$order_id = $input['razorpay_order_id'];
$payment_id = $input['razorpay_payment_id'];
$signature = $input['razorpay_signature'];
$expected_signature = hash_hmac('sha256', "$order_id|$payment_id", $razorpaySecret);

if (!hash_equals($expected_signature, $signature)) {
    echo json_encode(["success" => false, "message" => "❌ Signature verification failed"]);
    exit;
}

// === Extract Order Data ===
$order = $input['orderDetails'];
$customer_id = $input['customer_id'] ?? null;
$address_id = $order['addressId'] ?? null;
$product_id = $order['buyNowProduct']['id'] ?? null;
$product_price = floatval($order['buyNowProduct']['offer_price'] ?? 0);
$addon_price = 0;
$addons = $order['addons'] ?? [];
foreach ($addons as $addon) {
    $addon_price += floatval($addon['price'] ?? 0);
}
$plan_price = floatval($order['selectedPlan'] ?? 0);
$total_amount = floatval($order['totalAmount'] ?? 0);

// === Razorpay Order Optional ===
$razorpay_order_data = $input['razorpay_order_data'] ?? null;
$currency = "INR";
$status = "paid";
$attempts = 1;
$payment_mode = "Razorpay";
$created_at = date("Y-m-d H:i:s");

if ($razorpay_order_data) {
    $currency = $razorpay_order_data['currency'] ?? "INR";
    $status = $razorpay_order_data['status'] ?? "paid";
    $attempts = $razorpay_order_data['attempts'] ?? 1;
    $created_at = date("Y-m-d H:i:s", $razorpay_order_data['created_at']);
}

// === Invoice Number ===
$year = date("Y");
$prefix = "MM/$year/";
$inv_query = $conn->query("SELECT COUNT(*) AS count FROM orders WHERE YEAR(order_date) = $year");
$row = $inv_query->fetch_assoc();
$invoice_no = $prefix . str_pad($row['count'] + 1, 3, "0", STR_PAD_LEFT);

// === Prevent Duplicate ===
$stmt = $conn->prepare("SELECT id FROM orders WHERE razorpay_payment_id = ?");
$stmt->bind_param("s", $payment_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => true, "message" => "Order already recorded."]);
    exit;
}

// === Save to orders table ===
$stmt = $conn->prepare("INSERT INTO orders (
    customer_id, product_id, address_id, amount, payment_mode, razorpay_payment_id,
    status, order_date, return_requested, return_reason, return_status,
    returned, rejection_reason, cancel_reason, cancelled_at, delivered_at,
    tracking_status, created_at, razorpay_order_id
) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)");

$stmt->bind_param(
    "iiidsssss",
    $customer_id,
    $product_id,
    $address_id,
    $total_amount,
    $payment_mode,
    $payment_id,
    $status,
    $created_at,
    $order_id
);

// === Save Breakdown to payment_logs table ===
$log_stmt = $conn->prepare("INSERT INTO payment_logs 
(payment_id, product_id, product_price, addon_price, plan_price, total_amount, created_at) 
VALUES (?, ?, ?, ?, ?, ?, NOW())");

$log_stmt->bind_param(
    "sidddd",
    $payment_id,
    $product_id,
    $product_price,
    $addon_price,
    $plan_price,
    $total_amount
);

// === Execute Both Inserts ===
if ($stmt->execute() && $log_stmt->execute()) {
    // Update product quantity
    $qty_stmt = $conn->prepare("UPDATE products SET quantity = quantity - 1 WHERE id = ? AND quantity > 0");
    $qty_stmt->bind_param("i", $product_id);
    $qty_stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "✅ Payment verified & order saved",
        "invoice_number" => $invoice_no,
        "order_date" => date("Y-m-d H:i:s")
    ]);
}
 else {
    echo json_encode(["success" => false, "message" => "Database insert failed"]);
}
?>
