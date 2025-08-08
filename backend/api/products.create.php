<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include('../config/db.php');

// Validate required fields
if (!isset($_POST['name'], $_POST['price'], $_POST['brand'], $_POST['imei'], $_POST['category'], $_FILES['image'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Collect form data
$name = $_POST['name'];
$description = $_POST['description'] ?? '';
$price = $_POST['price'];
$offer_price = $_POST['offer_price'] ?? null;
$brand = $_POST['brand'];
$imei = $_POST['imei'];
$category = $_POST['category'];
$color = $_POST['color'] ?? '';
$quantity = $_POST['quantity'] ?? 0;

// Extra product details
$warranty = $_POST['warranty'] ?? '';
$storage = $_POST['storage'] ?? '';
$ram = $_POST['ram'] ?? '';
$battery = $_POST['battery'] ?? '';
$rear_camera = $_POST['rear_camera'] ?? '';
$front_camera = $_POST['front_camera'] ?? '';
$condition = $_POST['condition'] ?? '';
$discount_percentage = $_POST['discount_percentage'] ?? '';
$display = $_POST['display'] ?? '';
$network_type = $_POST['network_type'] ?? '';
$full_kit = $_POST['full_kit'] ?? '';
$sim_type = $_POST['sim_type'] ?? '';
$processor = $_POST['processor'] ?? '';
$video = $_POST['video'] ?? '';

// Handle image upload
$targetDir = __DIR__ . "/../api/images/";
$imageName = basename($_FILES["image"]["name"]);
$targetFile = $targetDir . $imageName;
$imagePath = "images/" . $imageName;

if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
    echo json_encode(['success' => false, 'error' => 'Image upload failed']);
    exit;
}

// 1. Insert into products table
$stmt = $conn->prepare("INSERT INTO products 
    (name, description, price, offer_price, brand,imei, image, quantity, color, category, video, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, NOW())");

$stmt->bind_param("ssddsdssiss", 
    $name, $description, $price, $offer_price, $brand,$imei, $imageName, $quantity, $color, $category, $video
);

if ($stmt->execute()) {
    $product_id = $conn->insert_id;

    // 2. Insert into productdetail table
   $stmt2 = $conn->prepare("INSERT INTO productdetail 
    (product_id, ram, battery, warrenty, storage, colour, `condition`, discount_percentage, rear_camera, front_camera, display, network_type, full_kit, sim_type,processor, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW())");

$stmt2->bind_param("issssssssssssss", 
    $product_id, $ram, $battery, $warranty, $storage, $color, $condition, $discount_percentage, 
    $rear_camera, $front_camera, $display, $network_type, $full_kit, $sim_type,$processor
);


     if ($stmt2->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
          "success" => false, 
          "error" => "Failed to insert into productdetail",
          "mysqli_error" => $stmt2->error
        ]);
    }
} else {
    echo json_encode([
      "success" => false,
      "error" => "Failed to insert into products",
      "mysqli_error" => $stmt->error
    ]);
}
?>
