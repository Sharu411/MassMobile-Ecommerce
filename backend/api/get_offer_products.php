<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

include_once(__DIR__ . '/../config/db.php');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
$offer_name = $data["offer_name"] ?? "";

if (!$offer_name) {
    echo json_encode(["success" => false, "message" => "Missing offer name"]);
    exit;
}

// Fetch products for the given offer
$stmt = $conn->prepare("SELECT * FROM products WHERE offer_name = ?");
$stmt->bind_param("s", $offer_name);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}
$stmt->close();

// Fetch sale_end from welcome_popup where link matches the offer
$sale_end = null;
$link_pattern = "/offers/" . $offer_name;
$saleQuery = $conn->prepare("SELECT sale_end FROM welcome_popup WHERE link = ? AND status = 'enabled' LIMIT 1");
$saleQuery->bind_param("s", $link_pattern);
$saleQuery->execute();
$saleResult = $saleQuery->get_result();
if ($saleResult && $saleResult->num_rows > 0) {
    $row = $saleResult->fetch_assoc();
    $sale_end = $row['sale_end'];
}
$saleQuery->close();

$conn->close();

// Final JSON response
echo json_encode([
    "success" => true,
    "products" => $products,
    "count" => count($products),
    "sale_end" => $sale_end,
]);
?>
