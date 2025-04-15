<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$sql = "SELECT DISTINCT category FROM stock";
$result = $conn->query($sql);

$categories = [];
while ($row = $result->fetch_assoc()) {
    $categories[] = $row['category'];
}

echo json_encode($categories);
$conn->close();
?>