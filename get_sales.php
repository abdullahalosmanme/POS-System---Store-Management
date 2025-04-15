<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$result = $conn->query("SELECT * FROM sales");
$sales = [];
while ($row = $result->fetch_assoc()) {
    $sales[] = $row;
}
echo json_encode($sales);
$conn->close();
?>