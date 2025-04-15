<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$items = json_decode($_POST['items'], true);
$customer_id = $_POST['customer_id'] ?: null;
$total = array_sum(array_column($items, 'price'));

$stmt = $conn->prepare("INSERT INTO sales (customer_id, total, date) VALUES (?, ?, NOW())");
$stmt->bind_param("sd", $customer_id, $total);
$stmt->execute();
$sale_id = $conn->insert_id;

foreach ($items as $item) {
    $stmt = $conn->prepare("INSERT INTO sale_items (sale_id, item_id, price) VALUES (?, ?, ?)");
    $stmt->bind_param("iid", $sale_id, $item['id'], $item['price']);
    $stmt->execute();
}

$stmt->close();
$conn->close();
?>