<?php
// =========================
// CORS HEADERS
// =========================
header("Access-Control-Allow-Origin: *"); // Change * to your frontend domain for production
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =========================
// RAZORPAY API KEYS
// =========================
$key_id = "rzp_test_ho7iv3a12qICHb";
$key_secret = "qVTDahEZWQYCrs61Bc62VQdw";

// =========================
// GET & VALIDATE INPUT
// =========================
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['amount']) || !is_numeric($input['amount']) || $input['amount'] <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid amount"
    ]);
    exit();
}

$amount = (int)$input['amount']; // amount should be in paise (e.g., ₹130 = 13000)

// =========================
// PREPARE ORDER DATA
// =========================
$orderData = [
    "amount" => $amount,
    "currency" => "INR",
    "receipt" => "mass_" . time(),
    "payment_capture" => 1
];

// =========================
// SEND REQUEST TO RAZORPAY
// =========================
$ch = curl_init("https://api.razorpay.com/v1/orders");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERPWD, "$key_id:$key_secret");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// ✅ Proper success check: Accept 200 and 201
if (($http_status !== 200 && $http_status !== 201) || !$response) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to create Razorpay order",
        "error" => $curl_error ?: "HTTP Status $http_status"
    ]);
    exit();
}


// =========================
// SUCCESS RESPONSE
// =========================
echo $response;
