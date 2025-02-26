module.exports = {
  command: "self",
  alias: ["private", "privatemode"],
  settings: {
    owner: true, // Only owner can use this command
  },
  loading: true,
}

// Handler function
module.exports = async (m, { sock, config, Func }) => {
  let db_settings = db.list().settings;

  // Toggle the self setting
  db_settings.self = !db_settings.self;

  // Save the updated settings
  await db.save();

  // Respond with the current status
  return m.reply(`✅ *Mode Self* telah ${db_settings.self ? 'diaktifkan' : 'dinonaktifkan'}.

🔰 Status saat ini: ${db_settings.self ? '🟢 AKTIF' : '🔴 NONAKTIF'}

${db_settings.self 
  ? '🔒 Hanya owner yang dapat menggunakan perintah bot.' 
  : '🔓 Semua pengguna dapat menggunakan perintah bot sesuai dengan izin mereka.'}`);
}