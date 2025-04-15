<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$name = $_POST['name'];
$phone = $_POST['phone'];

$stmt = $conn->prepare("INSERT INTO customers (name, phone) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $phone);
$stmt->execute();
$stmt->close();
$conn->close();
?>