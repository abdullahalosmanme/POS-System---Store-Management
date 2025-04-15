<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$result = $conn->query("SELECT * FROM customers");
$customers = [];
while ($row = $result->fetch_assoc()) {
    $customers[] = $row;
}
echo json_encode($customers);
$conn->close();
?>