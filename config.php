<?php
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

define("TELEGRAM_BOT_TOKEN", $_ENV['TELEGRAM_BOT_TOKEN']);
define("TELEGRAM_CHAT_ID", $_ENV['TELEGRAM_CHAT_ID']);

function sendTelegramMessage($message) {
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $data = [
        "chat_id" => TELEGRAM_CHAT_ID,
        "text" => $message,
        "parse_mode" => "Markdown"
    ];
    file_get_contents($url . "?" . http_build_query($data));
}
?>
