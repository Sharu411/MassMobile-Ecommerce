<?php  
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$sql = "
SELECT 
    p.*, 
    d.warrenty AS warranty
FROM products p
LEFT JOIN productdetail d ON p.id = d.product_id
ORDER BY p.created_at DESC
";


$result = mysqli_query($conn, $sql);
$products = [];

while ($row = mysqli_fetch_assoc($result)) {
    // ✅ Normalize warranty
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

    // ✅ Add full image URL
$row['image'] = "https://massmobiles.com/api/images/" . $row['image'];


    // ✅ Fetch average rating and total reviews
    $productId = $row['id'];
    $reviewQuery = $conn->prepare("
        SELECT 
            ROUND(AVG(rating), 1) AS avg_rating, 
            COUNT(*) AS total_reviews 
        FROM product_reviews 
        WHERE product_id = ?
    ");
    $reviewQuery->bind_param("i", $productId);
    $reviewQuery->execute();
    $reviewResult = $reviewQuery->get_result()->fetch_assoc();

    $row['avg_rating'] = $reviewResult['avg_rating'] ?? 0;
    $row['total_reviews'] = $reviewResult['total_reviews'] ?? 0;

    $products[] = $row;
}

echo json_encode($products);
?>
