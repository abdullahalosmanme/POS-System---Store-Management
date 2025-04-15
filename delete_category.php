<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$name = $_POST['name'];
$stmt = $conn->prepare("DELETE FROM categories WHERE name = ?");
$stmt->bind_param("s", $name);
$stmt->execute();
$stmt->close();
$conn->close();
?>