<?php
include_once(__DIR__ . '/../config/db.php');
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ✅ Step 0: Ensure DB connection
if (!$conn) {
    die(json_encode(["success" => false, "error" => "DB connection failed"]));
}

// ✅ Step 1: Receive POST data
$status = $_POST['status'] ?? 'disabled';
$link = $_POST['link'] ?? '';
$sale_end = $_POST['sale_end'] ?? null; // 🆕 NEW sale end datetime
$image = $_FILES['image']['name'] ?? null;

// ✅ Step 2: Define upload path
$target_dir = __DIR__ . '/images/welcome_popup/';
$target_file = $target_dir . basename($image);

// ✅ Step 3: Fetch existing popup
$sql = "SELECT image FROM welcome_popup WHERE id = 1";
$result = $conn->query($sql);
$oldImage = null;

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $oldImage = $row['image'];

    // ✅ Delete old image from server
    $oldImagePath = $target_dir . $oldImage;
    if ($image && file_exists($oldImagePath)) {
        unlink($oldImagePath);
    }

    // ✅ Remove old row
    $conn->query("DELETE FROM welcome_popup WHERE id = 1");
}

// ✅ Step 4: Move uploaded image (if available)
$uploadSuccess = true;
if ($image) {
    $uploadSuccess = move_uploaded_file($_FILES["image"]["tmp_name"], $target_file);
}

// ✅ Step 5: Insert new record
if ($uploadSuccess) {
    $stmt = $conn->prepare("INSERT INTO welcome_popup (id, image, status, link, sale_end) VALUES (1, ?, ?, ?, ?)");
    $stmt->bind_param("ssss", $image, $status, $link, $sale_end);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Popup updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Image upload failed"]);
}
?>
