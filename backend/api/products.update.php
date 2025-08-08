<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include('../config/db.php');

// ✅ Validate product ID
if (!isset($_POST['id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing product ID']);
    exit;
}

$product_id = intval($_POST['id']);
$imageNames = [];
$mainImageName = null;

// ✅ Initialize update fields
$fields = [];
$values = [];
$types = "";

// ✅ Upload Main Image (single image - 'image' column)
if (!empty($_FILES['mainImage']['name'])) {
    $mainImageName = basename($_FILES['mainImage']['name']);
    $targetMain = __DIR__ . "/images/" . $mainImageName;

    if (move_uploaded_file($_FILES['mainImage']['tmp_name'], $targetMain)) {
        $fields[] = "image=?";
        $values[] = $mainImageName;
        $types .= "s";
    }
}

// ✅ Upload Gallery Images (multiple - 'images' column)
if (!empty($_FILES['images']['name'][0])) {
    $totalFiles = count($_FILES['images']['name']);

    for ($i = 0; $i < $totalFiles; $i++) {
        $fileName = basename($_FILES['images']['name'][$i]);
        $targetFile = __DIR__ . "/images/" . $fileName;

        if (move_uploaded_file($_FILES['images']['tmp_name'][$i], $targetFile)) {
            $imageNames[] = $fileName;
        }
    }

    if (!empty($imageNames)) {
        $imageListString = implode(",", $imageNames);
        $fields[] = "images=?";
        $values[] = $imageListString;
        $types .= "s";
    }
}

// ✅ Upload Video File (single - 'video' column)
if (!empty($_FILES['video']['name'])) {
    $videoFileName = basename($_FILES['video']['name']);
    $videoTmp = $_FILES['video']['tmp_name'];
    $videoPath = __DIR__ . "/videos/" . $videoFileName;

    // Ensure videos directory exists
    if (!is_dir(__DIR__ . "/videos/")) {
        mkdir(__DIR__ . "/videos/", 0777, true);
    }

    if (move_uploaded_file($videoTmp, $videoPath)) {
        $fields[] = "video=?";
        $values[] = $videoFileName;
        $types .= "s";
    }
}

// ✅ Collect other POST fields to update if needed
$mainFields = [
    'name', 'description', 'price', 'offer_price', 'brand', 'imei',
    'quantity', 'color', 'category'
];

foreach ($mainFields as $field) {
    if (isset($_POST[$field])) {
        $fields[] = "$field=?";
        $values[] = $_POST[$field];
        $types .= is_numeric($_POST[$field]) ? "d" : "s";
    }
}

// ✅ Proceed to update only if there are fields to update
if (!empty($fields)) {
    $query = "UPDATE products SET " . implode(", ", $fields) . " WHERE id=?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $types .= "i"; // for product_id
        $values[] = $product_id;
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Database update failed']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Query preparation failed']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No data to update']);
}

$conn->close();
?>
