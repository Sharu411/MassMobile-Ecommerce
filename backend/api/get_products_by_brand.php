<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

include '../config/db.php';

$brand = $_GET['brand'] ?? '';

$sql = "
SELECT 
    p.*, 
    d.warrenty AS warranty
FROM products p
LEFT JOIN productdetail d ON p.id = d.product_id
WHERE p.brand = ?
ORDER BY p.created_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $brand);
$stmt->execute();
$result = $stmt->get_result();

$products = [];

while ($row = $result->fetch_assoc()) {
    // ✅ Format the warranty date to remove time part
 $warranty_raw = $row['warranty'];

if (
    empty($warranty_raw) ||
    strtoupper(trim($warranty_raw)) === 'NILL' || 
    strtotime($warranty_raw) === false
) {
    $row['warranty'] = 'NILL';
} else {
    $row['warranty'] = date('Y-m-d', strtotime($warranty_raw));
}



    // Get review summary
    $reviewQuery = $conn->prepare("
        SELECT 
            ROUND(AVG(rating), 1) as avg_rating, 
            COUNT(*) as total_reviews 
        FROM product_reviews 
        WHERE product_id = ?
    ");
    $reviewQuery->bind_param("i", $row['id']);
    $reviewQuery->execute();
    $reviewResult = $reviewQuery->get_result()->fetch_assoc();

    $row['avg_rating'] = $reviewResult['avg_rating'] ?? 0;
    $row['total_reviews'] = $reviewResult['total_reviews'] ?? 0;

    $products[] = $row;
}

echo json_encode($products);
