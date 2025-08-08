<?php
// api/get_fbt.php
// ----------------------------------------------
// Return “Frequently Bought Together” suggestions
// ----------------------------------------------
//
// Expected query string:
//   get_fbt.php?product_id=123
//
// Response (application/json):
// {
//   "success": true,
//   "products": [
//     {
//       "id": 9,
//       "name": "Apple 20 W USB‑C Charger",
//       "image": "charger.jpg",
//       "price": 1899,
//       "offer_price": 1589,
//       "discount_percentage": 16
//     },
//     ...
//   ]
// }

header('Content-Type: application/json');

// ─────────── db connection ───────────
require_once __DIR__ . '/../config/db.php';
 // <- adjust path to your PDO connection
// $pdo = new PDO(...);

// ─────────── validate input ───────────
$productId = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
if ($productId <= 0) {
  echo json_encode(['success' => false, 'error' => 'Invalid product_id']);
  exit;
}

try {
  // ───── 1. find the category (or brand) of the main item ─────
  $stmt = $pdo->prepare('SELECT category FROM products WHERE id = ? LIMIT 1');
  $stmt->execute([$productId]);
  $category = $stmt->fetchColumn();

  if (!$category) {
    echo json_encode(['success' => false, 'error' => 'Product not found']);
    exit;
  }

  // ───── 2. fetch add‑ons you want to recommend ─────
  //
  // This sample logic:
  //   • same category
  //   • NOT the same product
  //   • quantity > 0 (in stock)
  //   • order by “frequently ordered” weight if you track it,
  //     else just cheapest first
  //
  // 👉 swap this query for your own ML / join‑table logic at any time.
  //
  $query = "
    SELECT
      id,
      name,
      image,
      price,
      offer_price,
      discount_percentage
    FROM products
    WHERE category = :cat
      AND id <> :pid
      AND quantity > 0
    ORDER BY price ASC
    LIMIT 3
  ";
  $stmt = $pdo->prepare($query);
  $stmt->execute([
    ':cat' => $category,
    ':pid' => $productId
  ]);
  $addons = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    'success'  => true,
    'products' => $addons
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error'   => 'Server error',
    'detail'  => $e->getMessage() // 👈 remove in production
  ]);
}
