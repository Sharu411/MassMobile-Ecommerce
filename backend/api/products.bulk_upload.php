<?php
/**
 * Bulk product uploader
 * • CSV header uses "warranty"
 * • DB column remains "warrenty"
 * • Variable $warrenty used everywhere after mapping.
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';  // supplies $conn (MySQLi)

/* ───────── 1. Validate upload ───────── */
if (!isset($_FILES['csv']) || $_FILES['csv']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'CSV file missing or failed to upload.']);
    exit;
}
$csvFile = $_FILES['csv']['tmp_name'];
$handle  = fopen($csvFile, 'r');
if (!$handle) {
    http_response_code(400);
    echo json_encode(['success'=>false,'error'=>'Cannot open CSV file.']);
    exit;
}


/* ───────── 2. Header validation ───────── */
$expectedHeader = [
  "name","description","category","price","offer_price","image",
  "quantity","brand","imei","is_top_deal","color","video",
  "ram","battery","warranty","storage","colour","condition",
  "discount_percentage","rear_camera","front_camera","display",
  "network_type","full_kit","sim_type","processor"
];

$header = array_map('trim', fgetcsv($handle));

if ($header !== $expectedHeader) {
    http_response_code(422);
    echo json_encode([
        'success'  => false,
        'error'    => 'CSV header mismatch.',
        'expected' => $expectedHeader,
        'received' => $header
    ]);
    fclose($handle);
    exit;
}

/* ───────── 3. Iterate rows ───────── */
$inserted = 0;
$rowNum   = 1;
$errors   = [];

while (($data = fgetcsv($handle)) !== false) {
    $rowNum++;

    // skip blank line
    if ($data === [null] || (count($data)===1 && trim($data[0])==='')) continue;

    if (count($data) !== count($expectedHeader)) {
        $errors[] = "Row $rowNum: column count mismatch.";
        continue;
    }

    [
      $name,$description,$category,$price,$offer_price,$image,
      $quantity,$brand,$imei,$is_top_deal,$color,$video,
      $ram,$battery,$warrantyCSV,$storage,$colour,$condition,
      $discount_percentage,$rear_camera,$front_camera,$display,
      $network_type,$full_kit,$sim_type,$processor
    ] = array_map('trim', $data);

    /* Map CSV "warranty" → PHP variable $warrenty (legacy spelling) */
    $warrenty = $warrantyCSV;

    // numeric casts
    $price               = (float) str_replace(',','',$price);
    $offer_price         = (float) str_replace(',','',$offer_price);
    $quantity            = (int)   $quantity;
    $discount_percentage = (float) $discount_percentage;
    $is_top_deal         = (int)   $is_top_deal;

    /* 3a — insert into products */
    $stmt = $conn->prepare(
      "INSERT INTO products
       (name,description,category,price,offer_price,image,quantity,
        brand,imei,is_top_deal,color,video,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?, ?,NOW())"
    );
    $stmt->bind_param(
      "sssddsssisss",
      $name,$description,$category,$price,$offer_price,$image,
      $quantity,$brand,$imei,$is_top_deal,$color,$video
    );
    if (!$stmt->execute()) {
        $errors[] = "Row $rowNum: products insert error – ".$stmt->error;
        continue;
    }
    $product_id = $conn->insert_id;

    /* 3b — insert into productdetail (DB column is still 'warrenty') */
    $stmt2 = $conn->prepare(
      "INSERT INTO productdetail
       (product_id,ram,battery,warrenty,storage,
        colour,`condition`,discount_percentage,rear_camera,front_camera,
        display,network_type,full_kit,sim_type,processor,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())"
    );
    $stmt2->bind_param(
      "issssssssssssss",
      $product_id,$ram,$battery,$warrenty,$storage,
      $colour,$condition,$discount_percentage,$rear_camera,$front_camera,
      $display,$network_type,$full_kit,$sim_type,$processor
    );
    if ($stmt2->execute()) {
        $inserted++;
    } else {
        $errors[] = "Row $rowNum: productdetail insert error – ".$stmt2->error;
    }
}

fclose($handle);

/* ───────── 4. Final response ───────── */
if ($inserted === 0) {
    http_response_code(422);
    echo json_encode([
        'success'=>false,
        'inserted'=>0,
        'errors'=>$errors ?: ['No rows inserted.']
    ]);
    exit;
}

echo json_encode([
    'success'  => true,
    'inserted' => $inserted,
    'errors'   => $errors
]);
?>
