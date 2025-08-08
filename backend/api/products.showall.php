<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

$sql = "SELECT 
          p.id, p.name, p.description, p.price, p.offer_price, p.image, p.quantity, 
          p.brand, p.imei, p.is_top_deal, p.color, p.category, p.video,
          d.ram, d.storage, d.battery, d.warrenty, d.condition, 
          d.rear_camera, d.front_camera, d.display, d.network_type, d.sim_type
        FROM products p
        LEFT JOIN productdetail d ON p.id = d.product_id
        ORDER BY p.id DESC";

$result = mysqli_query($conn, $sql);

$products = [];

if ($result) {
  while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
  }
  echo json_encode($products);
} else {
  echo json_encode(["error" => "Failed to fetch products"]);
}

mysqli_close($conn);
