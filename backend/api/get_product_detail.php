<?php
// CORS Headers — Must be at the top
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Include DB config
include '../config/db.php';

// Get Product ID from query
$productId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($productId === 0) {
    echo json_encode(["error" => "Invalid product ID"]);
    exit;
}

// SQL query with JOIN
$sql = "SELECT 
            p.id, 
            p.name, 
            p.description,
            p.price,
            p.offer_price,
            p.image,
            p.images, 
            p.quantity,
            p.created_at,
            p.brand,
            p.imei,
            p.is_top_deal,

            d.ram, 
            d.storage, -- <--- changed from rom
           
            d.rear_camera, 
            d.front_camera, 
            d.battery, 
            d.display, 
            d.colour,       -- also corrected spelling
            d.network_type, 
            d.sim_type, 
            
           d.warrenty AS warranty,     -- keep spelling consistent
            d.full_kit,
            d.condition,
            p.video,
            d.discount_percentage

        FROM products p
        LEFT JOIN productdetail d ON p.id = d.product_id
        WHERE p.id = $productId";


$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(["error" => "Query failed: " . mysqli_error($conn)]);
    exit;
}

if ($row = mysqli_fetch_assoc($result)) {
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
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Product not found"]);
}
