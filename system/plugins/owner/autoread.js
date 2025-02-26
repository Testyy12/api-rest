module.exports = {
  command: "autoread",
  alias: ["readmsg", "autobaca"],
  settings: {
    owner: true, // Only owner can use this command
  },
  loading: true,
}

// Handler function
module.exports = async (m, { sock, config, Func }) => {
  let db_settings = db.list().settings;

  // Toggle the online (autoread) setting
  db_settings.online = !db_settings.online;

  // Save the updated settings
  await db.save();

  // Respond with the current status
  return m.reply(`✅ *Auto Read Messages* telah ${db_settings.online ? 'diaktifkan' : 'dinonaktifkan'}.

🔰 Status saat ini: ${db_settings.online ? '🟢 AKTIF' : '🔴 NONAKTIF'}

${db_settings.online 
  ? '📱 Bot akan otomatis membaca semua pesan yang masuk.' 
  : '📱 Bot tidak akan otomatis membaca pesan yang masuk.'}`);
}