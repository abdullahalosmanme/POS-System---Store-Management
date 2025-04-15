<?php
$conn = new mysqli("127.0.0.1", "root", "", "pos");
if ($conn->connect_error) die(json_encode(['status' => 'error', 'message' => 'Connection failed']));

$category = $_POST['category'];
$name = $_POST['name'];
$price = $_POST['price'];

if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
    $imageName = time() . "_" . basename($_FILES['image']['name']);
    $targetFile = $targetDir . $imageName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $stmt = $conn->prepare("INSERT INTO stock (category, name, price, image_path) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssds", $category, $name, $price, $targetFile);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Stock added successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Database error']);
        }
        $stmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload image']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Image upload failed']);
}

$conn->close();
?>