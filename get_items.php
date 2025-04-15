<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$category = isset($_GET['category']) ? $_GET['category'] : null;
$sql = $category ? "SELECT * FROM stock WHERE category = ?" : "SELECT * FROM stock";

$stmt = $conn->prepare($sql);
if ($category) $stmt->bind_param("s", $category);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
$stmt->close();
$conn->close();
?>