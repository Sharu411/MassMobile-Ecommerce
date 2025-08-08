<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['product_id']) || !isset($data['nickname']) ||
    !isset($data['summary']) || !isset($data['review']) || !isset($data['rating'])
) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$productId = intval($data['product_id']);
$nickname = mysqli_real_escape_string($conn, $data['nickname']);
$summary = mysqli_real_escape_string($conn, $data['summary']);
$review = mysqli_real_escape_string($conn, $data['review']);
$rating = intval($data['rating']);

$sql = "INSERT INTO product_reviews (product_id, nickname, summary, review, rating)
        VALUES ($productId, '$nickname', '$summary', '$review', $rating)";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => mysqli_error($conn)]);
}
?>
