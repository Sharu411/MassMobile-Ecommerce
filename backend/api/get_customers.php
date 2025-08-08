<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config/db.php';

// Fetch all customers
$sql = "SELECT * FROM customers ORDER BY created_at DESC";
$result = mysqli_query($conn, $sql);

$customers = [];

while ($row = mysqli_fetch_assoc($result)) {
  $customerId = $row['id'];

  // Fetch default address
  $addrSql = "SELECT * FROM customer_addresses WHERE customer_id = $customerId AND is_default = 1 LIMIT 1";
  $addrResult = mysqli_query($conn, $addrSql);
  $address = mysqli_fetch_assoc($addrResult);

  $customers[] = [
    "id" => $row['id'],
    "name" => $row['name'],
    "email" => $row['email'],
    "phone" => $row['phone'],
    "created_at" => $row['created_at'],
    "address" => $address
  ];
}

echo json_encode($customers);
?>
