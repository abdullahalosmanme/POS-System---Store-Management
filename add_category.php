<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$name = $_POST['name'];
$stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
$stmt->bind_param("s", $name);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Category already exists or error occurred']);
}
$stmt->close();
$conn->close();
?>