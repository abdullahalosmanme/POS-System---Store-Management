<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die("Connection failed");

$period = $_GET['period'];
$interval = $period === 'monthly' ? 'MONTH' : 'YEAR';
$result = $conn->query("SELECT SUM(total) as revenue FROM sales WHERE date >= DATE_SUB(NOW(), INTERVAL 1 $interval)");
$revenue = $result->fetch_assoc()['revenue'] ?? 0;

// Placeholder for profit/loss (add cost logic if needed)
$profit_loss = $revenue;
echo json_encode(['profit_loss' => $profit_loss]);
$conn->close();
?>