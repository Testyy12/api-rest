<?php
header('Content-Type: application/json');
require_once '../config.php';

$date = $_GET['date'] ?? null;
$amount = $_GET['amount'] ?? null;
$fee = $_GET['fee'] ?? null;
$balance = $_GET['balance'] ?? null;
$status = $_GET['status'] ?? null;
$issuer = $_GET['issuer'] ?? null;
$rrn = $_GET['rrn'] ?? null;
$us_key = $_GET['us_key'] ?? null;

if (!$date || !$amount || !$fee || !$balance || !$status || !$issuer || !$rrn || !$us_key) {
    echo json_encode(["error" => "Missing required parameters"]);
    exit;
}

$message = "📢 Callback Received!\n📅 Date: $date\n💰 Amount: $amount\n💸 Fee: $fee\n🏦 Balance: $balance\n✅ Status: $status\n🏦 Issuer: $issuer\n🔢 RRN: $rrn\n🔑 US Key: $us_key";

sendTelegramMessage($message);

echo json_encode(["success" => true, "message" => "Callback received"]);
?>
