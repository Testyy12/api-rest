<?php
header('Content-Type: application/json');
require_once '../config.php';

$ip = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$time = date("Y-m-d H:i:s");

$message = "📡 Device Info\n🌐 IP: $ip\n🕰 Time: $time\n💻 User-Agent: $userAgent";
sendTelegramMessage($message);

echo json_encode(["success" => true, "ip" => $ip, "time" => $time, "userAgent" => $userAgent]);
?>
