<?php
header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "API is running on PHP!"
]);
?>
