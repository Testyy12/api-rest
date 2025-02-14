<?php
header('Content-Type: application/json');

$url = $_GET['url'] ?? null;
$type = $_GET['type'] ?? null;

if (!$url || !$type) {
    echo json_encode(["error" => "Missing required parameters"]);
    exit;
}

$apiUrl = "https://api.snaptik.app/download?url=" . urlencode($url);
$response = file_get_contents($apiUrl);
$data = json_decode($response, true);

if ($data && isset($data['success']) && $data['success']) {
    $downloadUrl = null;
    if ($type === "mp4") {
        $downloadUrl = $data['video'] ?? null;
    } elseif ($type === "mp3") {
        $downloadUrl = $data['audio'] ?? null;
    } elseif ($type === "slide") {
        $downloadUrl = $data['slide'] ?? null;
    } else {
        echo json_encode(["error" => "Invalid type"]);
        exit;
    }
    echo json_encode(["success" => true, "downloadUrl" => $downloadUrl]);
} else {
    echo json_encode(["error" => "Failed to fetch TikTok media"]);
}
?>
