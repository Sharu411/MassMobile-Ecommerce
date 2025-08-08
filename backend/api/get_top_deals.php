<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/db.php'; // Adjust as needed

$sql = "SELECT id, name, image, offer_price, price FROM products WHERE is_top_deal = 1 ORDER BY id DESC LIMIT 10";
$result = mysqli_query($conn, $sql);

$deals = [];

if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $deals[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "image" => $row['image'],
            "offer_price" => $row['offer_price'],
            "price" => $row['price']
        ];
    }
}

echo json_encode($deals);
?>
