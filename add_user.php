<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$name = $_POST['name'];
$role = $_POST['role'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (name, role, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $role, $password);
$stmt->execute();
$stmt->close();
$conn->close();
?>