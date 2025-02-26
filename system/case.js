//============================
// - buat Pengguna case bisa tambah fitur disini
// - Fitur akan otomatis terlihat di .menu jadi jangan bikin fitur menu lagi 👍
//============================

const util = require("util");
const {
    exec
} = require("child_process");
const fs = require("node:fs");
const axios = require("axios");
const Func = require("../lib/function");
const {
    writeExif
} = require("../lib/sticker");
const pkg = require("../lib/case");
const Case = new pkg("./system/case.js");

module.exports = async (m,
    sock,
    config,
    text,
    Func,
    Scraper,
    Uploader,
    store,
    isAdmin,
    botAdmin,
    isPrems,
    isBanned,
) => {
    let user = db.user[m.sender]
    if (typeof user !== 'object') db.user[m.sender] = {}
    if (user) {
        if (!('status_deposit' in user)) user.status_deposit = false
        if (!('saldo' in user)) user.saldo = 0
    } else {
        db.user[m.sender] = {
            status_deposit: false, 
            saldo: 0
        }
    }
    const quoted = m.isQuoted ? m.quoted : m;
    switch (m.command) {

            case "buyvps": {
              if (m.isGroup) return m.reply("Pembelian VPS hanya bisa di dalam private chat")
              if (db.user[m.sender].status_deposit) return m.reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!")

              // Track the user's VPS configuration state
              if (!db.user[m.sender].vpsConfig) {
                db.user[m.sender].vpsConfig = {
                  step: 1, // Start at step 1: Plan selection
                  plan: null,
                  os: null,
                  region: null,
                  hostname: null,
                  backups: false,
                  price: 0
                }
              }

              const currentStep = db.user[m.sender].vpsConfig.step;

              // STEP 1: Plan Selection
              if (currentStep === 1) {
                // If text parameter exists, user is selecting a plan
                if (text) {
                  const planId = text.toLowerCase();
                  let selectedPlan = {};

                  if (planId === "1") {
                    selectedPlan = {
                      id: "1",
                      size: "s-1vcpu-2gb",
                      description: "Ram 2GB & Cpu 1",
                      price: 25000
                    }
                  } else if (planId === "2") {
                    selectedPlan = {
                      id: "2",
                      size: "s-2vcpu-4gb",
                      description: "Ram 4GB & Cpu 2",
                      price: 35000
                    }
                  } else if (planId === "3") {
                    selectedPlan = {
                      id: "3",
                      size: "s-4vcpu-8gb",
                      description: "Ram 8GB & Cpu 4",
                      price: 45000
                    }
                  } else if (planId === "4") {
                    selectedPlan = {
                      id: "4",
                      size: "s-4vcpu-16gb",
                      description: "Ram 16GB & Cpu 4",
                      price: 55000
                    }
                  } else {
                    return m.reply("Pilihan tidak valid. Silakan pilih dari opsi yang tersedia.")
                  }

                  // Save selected plan to user state
                  db.user[m.sender].vpsConfig.plan = selectedPlan;
                  db.user[m.sender].vpsConfig.price = selectedPlan.price;
                  db.user[m.sender].vpsConfig.step = 2; // Move to OS selection

                  // Show OS selection menu
                  return sock.sendMessage(m.chat, {
                    buttons: [
                      {
                        buttonId: 'action',
                        buttonText: { displayText: 'ini pesan interactiveMeta' },
                        type: 4,
                        nativeFlowInfo: {
                          name: 'single_select',
                          paramsJson: JSON.stringify({
                            title: 'Pilih Sistem Operasi',
                            sections: [
                              {
                                title: 'OS Options',
                                rows: [
                                  {
                                    title: 'Ubuntu 20.04 LTS',
                                    description: "Most popular for general use", 
                                    id: '.buyvps ubuntu-20-04-x64'
                                  },
                                  {
                                    title: 'Ubuntu 22.04 LTS',
                                    description: "Latest LTS version", 
                                    id: '.buyvps ubuntu-22-04-x64'
                                  },
                                  {
                                    title: 'Debian 11',
                                    description: "Stable and secure", 
                                    id: '.buyvps debian-11-x64'
                                  },
                                  {
                                    title: 'CentOS 7',
                                    description: "For enterprise applications", 
                                    id: '.buyvps centos-7-x64'
                                  },
                                  {
                                    title: 'Fedora 36',
                                    description: "Latest features", 
                                    id: '.buyvps fedora-36-x64'
                                  }
                                ]
                              }
                            ]
                          })
                        }
                      }
                    ],
                    footer: `© 2024 ${botname}`,
                    headerType: 1,
                    viewOnce: true,
                    text: `*VPS Plan:* ${selectedPlan.description}\n*Harga:* Rp${selectedPlan.price}\n\nSekarang pilih sistem operasi yang Anda inginkan:`,
                    contextInfo: {
                      isForwarded: true, 
                      mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
                    },
                  }, {quoted: m})
                }

                // Display plan selection options if no text parameter
                return sock.sendMessage(m.chat, {
                  buttons: [
                    {
                      buttonId: 'action',
                      buttonText: { displayText: 'ini pesan interactiveMeta' },
                      type: 4,
                      nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                          title: 'Pilih Spesifikasi VPS',
                          sections: [
                            {
                              title: 'List Ram Server VPS',
                              highlight_label: 'Recommended',
                              rows: [
                                {
                                  title: 'Ram 16GB & Cpu 4', 
                                  description: "Rp55.000", 
                                  id: '.buyvps 4'
                                },
                                {
                                  title: 'Ram 2GB & Cpu 1', 
                                  description: "Rp25.000", 
                                  id: '.buyvps 1'
                                },
                                {
                                  title: 'Ram 4GB & Cpu 2', 
                                  description: "Rp35.000", 
                                  id: '.buyvps 2'
                                },
                                {
                                  title: 'Ram 8GB & Cpu 4', 
                                  description: "Rp45.000", 
                                  id: '.buyvps 3'
                                }                       
                              ]
                            }
                          ]
                        })
                      }
                    }
                  ],
                  footer: `© 2024 ${botname}`,
                  headerType: 1,
                  viewOnce: true,
                  text: "*🖥️ ORDER VPS DIGITAL OCEAN*\n\nSilahkan pilih spesifikasi VPS yang Anda inginkan:",
                  contextInfo: {
                    isForwarded: true, 
                    mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
                  },
                }, {quoted: m})
              }

              // STEP 2: OS Selection
              else if (currentStep === 2) {
                if (!text) return m.reply("Silakan pilih sistem operasi dari menu.");

                const validOS = ['ubuntu-20-04-x64', 'ubuntu-22-04-x64', 'debian-11-x64', 'centos-7-x64', 'fedora-36-x64'];

                if (!validOS.includes(text)) {
                  return m.reply("Pilihan sistem operasi tidak valid. Silakan pilih dari opsi yang tersedia.");
                }

                // Save selected OS to user state
                db.user[m.sender].vpsConfig.os = text;
                db.user[m.sender].vpsConfig.step = 3; // Move to region selection

                // Show region selection menu
                return sock.sendMessage(m.chat, {
                  buttons: [
                    {
                      buttonId: 'action',
                      buttonText: { displayText: 'ini pesan interactiveMeta' },
                      type: 4,
                      nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({
                          title: 'Pilih Region Server',
                          sections: [
                            {
                              title: 'Asian Regions',
                              highlight_label: 'Best for Indonesia',
                              rows: [
                                {
                                  title: 'Singapore (SGP1)', 
                                  description: "Best latency for Indonesia", 
                                  id: '.buyvps sgp1'
                                },
                                {
                                  title: 'Bangalore (BLR1)', 
                                  description: "India region", 
                                  id: '.buyvps blr1'
                                }
                              ]
                            },
                            {
                              title: 'Other Regions',
                              rows: [
                                {
                                  title: 'New York (NYC1)', 
                                  description: "US East Coast", 
                                  id: '.buyvps nyc1'
                                },
                                {
                                  title: 'Amsterdam (AMS3)', 
                                  description: "Europe region", 
                                  id: '.buyvps ams3'
                                },
                                {
                                  title: 'London (LON1)', 
                                  description: "UK region", 
                                  id: '.buyvps lon1'
                                }
                              ]
                            }
                          ]
                        })
                      }
                    }
                  ],
                  footer: `© 2024 ${botname}`,
                  headerType: 1,
                  viewOnce: true,
                  text: `*VPS Plan:* ${db.user[m.sender].vpsConfig.plan.description}\n*OS:* ${Func.formatOsName(db.user[m.sender].vpsConfig.os)}\n*Harga:* Rp${db.user[m.sender].vpsConfig.price}\n\nSekarang pilih region server:`,
                  contextInfo: {
                    isForwarded: true, 
                    mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
                  },
                }, {quoted: m})
              }

              // STEP 3: Region Selection
              else if (currentStep === 3) {
                if (!text) return m.reply("Silakan pilih region server dari menu.");

                const validRegions = ['sgp1', 'blr1', 'nyc1', 'ams3', 'lon1'];

                if (!validRegions.includes(text)) {
                  return m.reply("Pilihan region tidak valid. Silakan pilih dari opsi yang tersedia.");
                }

                // Save selected region to user state
                db.user[m.sender].vpsConfig.region = text;
                db.user[m.sender].vpsConfig.step = 4; // Move to hostname input

                // Ask for hostname
                return m.reply(`*VPS Plan:* ${db.user[m.sender].vpsConfig.plan.description}\n*OS:* ${Func.formatOsName(db.user[m.sender].vpsConfig.os)}\n*Region:* ${Func.formatRegionName(db.user[m.sender].vpsConfig.region)}\n*Harga:* Rp${db.user[m.sender].vpsConfig.price}\n\nSilakan ketik hostname untuk VPS Anda (contoh: myserver1):\n\nKetik dengan format: .buyvps hostname:nama-hostname`);
              }

              // STEP 4: Hostname Input
              else if (currentStep === 4) {
                if (!text.startsWith("hostname:")) {
                  return m.reply("Format salah. Gunakan format: .buyvps hostname:nama-hostname");
                }

                const hostname = text.split(":")[1].trim();

                // Validate hostname (only alphanumeric and hyphens, no spaces)
                if (!/^[a-z0-9-]+$/i.test(hostname)) {
                  return m.reply("Hostname hanya boleh berisi huruf, angka, dan tanda hubung (-).");
                }

                if (hostname.length < 3 || hostname.length > 32) {
                  return m.reply("Hostname harus antara 3-32 karakter.");
                }

                // Save hostname to user state
                db.user[m.sender].vpsConfig.hostname = hostname;
                db.user[m.sender].vpsConfig.step = 5; // Move to backup option

                // Ask for backup option
                return sock.sendMessage(m.chat, {
                  buttons: [
                    {
                      buttonId: '.buyvps backup:yes',
                      buttonText: { displayText: 'Ya (+Rp5.000)' },
                      type: 1
                    },
                    {
                      buttonId: '.buyvps backup:no',
                      buttonText: { displayText: 'Tidak' },
                      type: 1
                    }
                  ],
                  headerType: 1,
                  text: `*VPS Plan:* ${db.user[m.sender].vpsConfig.plan.description}\n*OS:* ${Func.formatOsName(db.user[m.sender].vpsConfig.os)}\n*Region:* ${Func.formatRegionName(db.user[m.sender].vpsConfig.region)}\n*Hostname:* ${db.user[m.sender].vpsConfig.hostname}\n*Harga:* Rp${db.user[m.sender].vpsConfig.price}\n\nApakah Anda ingin mengaktifkan backup otomatis?`,
                  footer: `© 2024 ${botname}`,
                }, {quoted: m});
              }

              // STEP 5: Backup Option
              else if (currentStep === 5) {
                if (!text.startsWith("backup:")) {
                  return m.reply("Format salah. Silakan pilih opsi dari tombol yang tersedia.");
                }

                const backupOption = text.split(":")[1].trim().toLowerCase();

                if (backupOption !== "yes" && backupOption !== "no") {
                  return m.reply("Pilihan tidak valid. Silakan pilih Ya atau Tidak.");
                }

                // Save backup option to user state
                db.user[m.sender].vpsConfig.backups = backupOption === "yes";

                // Add backup price if enabled
                if (db.user[m.sender].vpsConfig.backups) {
                  db.user[m.sender].vpsConfig.price += 5000;
                }

                db.user[m.sender].vpsConfig.step = 6; // Move to confirmation

                // Show summary and ask for confirmation
                return sock.sendMessage(m.chat, {
                  buttons: [
                    {
                      buttonId: '.buyvps confirm:yes',
                      buttonText: { displayText: 'Konfirmasi & Bayar' },
                      type: 1
                    },
                    {
                      buttonId: '.batalbeli',
                      buttonText: { displayText: 'Batalkan Pembelian' },
                      type: 1
                    }
                  ],
                  headerType: 1,
                  text: `*RINGKASAN PEMBELIAN VPS*\n\n*Spesifikasi:* ${db.user[m.sender].vpsConfig.plan.description}\n*Sistem Operasi:* ${Func.formatOsName(db.user[m.sender].vpsConfig.os)}\n*Region:* ${Func.formatRegionName(db.user[m.sender].vpsConfig.region)}\n*Hostname:* ${db.user[m.sender].vpsConfig.hostname}\n*Backup Otomatis:* ${db.user[m.sender].vpsConfig.backups ? 'Ya' : 'Tidak'}\n\n*Total Harga:* Rp${db.user[m.sender].vpsConfig.price}\n\nSilakan konfirmasi pesanan Anda.`,
                  footer: `© 2024 ${botname}`,
                }, {quoted: m});
              }

              // STEP 6: Confirmation and Payment
              else if (currentStep === 6) {
                if (!text.startsWith("confirm:yes")) {
                  return m.reply("Format salah. Silakan pilih opsi dari tombol yang tersedia.");
                }

                // Proceed to payment
                const UrlQr = global.qrisOrderKuota;
                const amount = Number(db.user[m.sender].vpsConfig.price) + generateRandomNumber(110, 250);

                const get = await axios.get(`https://api.simplebot.my.id/api/orkut/createpayment?apikey=${global.apiSimpleBot}&amount=${amount}&codeqr=${UrlQr}`);

                const teks3 = `
            *乂 INFORMASI PEMBAYARAN*

             *• ID :* ${get.data.result.transactionId}
             *• Total Pembayaran :* Rp${await Func.toIDR(get.data.result.amount)}
             *• Barang :* VPS Digital Ocean
             *• Expired :* 5 menit

            *Note :* 
            Qris pembayaran hanya berlaku dalam 5 menit, jika sudah melewati 5 menit pembayaran dinyatakan tidak valid!
            Jika pembayaran berhasil bot akan otomatis mengirim notifikasi status pembayaran kamu.

            Ketik *.batalbeli* untuk membatalkan
            `;

                let msgQr = await sock.sendMessage(m.chat, {
                  footer: `© 2024 ${botname}`,
                  buttons: [
                    {
                      buttonId: `.batalbeli`,
                      buttonText: { displayText: 'Batalkan Pembelian' },
                      type: 1
                    }
                  ],
                  headerType: 1,
                  viewOnce: true,
                  image: {url: get.data.result.qrImageUrl}, 
                  caption: teks3,
                  contextInfo: {
                    mentionedJid: [m.sender]
                  },
                });

                // Set payment status
                db.user[m.sender].status_deposit = true;
                db.user[m.sender].saweria = {
                  msg: msgQr, 
                  chat: m.sender,
                  idDeposit: get.data.result.transactionId, 
                  amount: get.data.result.amount.toString(),
                  vpsConfig: db.user[m.sender].vpsConfig, // Store VPS config for later use
                  exp: function () {
                    setTimeout(async () => {
                      if (db.user[m.sender].status_deposit == true && db.user[m.sender].saweria && db.user[m.sender].saweria.amount == db.user[m.sender].saweria.amount) {
                        await sock.sendMessage(db.user[m.sender].saweria.chat, {text: "QRIS Pembayaran telah expired!"}, {quoted: db.user[m.sender].saweria.msg});
                        await sock.sendMessage(db.user[m.sender].saweria.chat, { delete: db.user[m.sender].saweria.msg.key });
                        db.user[m.sender].status_deposit = false;
                        delete db.user[m.sender].vpsConfig; // Clear VPS config
                        await clearInterval(db.user[m.sender].saweria.exp);
                        delete db.user[m.sender].saweria;
                      }
                    }, 300000);
                  }
                };

                await db.user[m.sender].saweria.exp();

                // Check payment status
                while (db.user[m.sender].status_deposit == true && db.user[m.sender].saweria && db.user[m.sender].saweria.amount) {
                  await sleep(8000);
                  const resultcek = await axios.get(`https://api.simplebot.my.id/api/orkut/cekstatus?apikey=${global.apiSimpleBot}&merchant=${global.merchantIdOrderKuota}&keyorkut=${global.apiOrderKuota}`);
                  const req = await resultcek.data;

                  if (db.user[m.sender].saweria && req?.amount == db.user[m.sender].saweria.amount) {
                    db.user[m.sender].status_deposit = false;
                    await clearInterval(db.user[m.sender].saweria.exp);

                    await sock.sendMessage(db.user[m.sender].saweria.chat, {
                      text: `
            *PEMBAYARAN BERHASIL DITERIMA ✅*

             *• ID :* ${db.user[m.sender].saweria.idDeposit}
             *• Total Pembayaran :* Rp${await Func.toIDR(db.user[m.sender].saweria.amount)}
             *• Barang :* VPS Digital Ocean
            `
                    }, {quoted: db.user[m.sender].saweria.msg});

                    var orang = db.user[m.sender].saweria.chat;
                    const vpsConfig = db.user[m.sender].saweria.vpsConfig;
                    let hostname = vpsConfig.hostname;

                    try {        
                      let dropletData = {
                        name: hostname,
                        region: vpsConfig.region,
                        size: vpsConfig.plan.size,
                        image: vpsConfig.os,
                        ssh_keys: null,
                        backups: vpsConfig.backups,
                        ipv6: true,
                        user_data: null,
                        private_networking: null,
                        volumes: null,
                        tags: ['T']
                      };

                      let password = await generateRandomPassword();
                      dropletData.user_data = `#cloud-config
            password: ${password}
            chpasswd: { expire: False }`;

                      let response = await fetch('https://api.digitalocean.com/v2/droplets', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': "Bearer " + global.apiDigitalOcean 
                        },
                        body: JSON.stringify(dropletData)
                      });

                      let responseData = await response.json();

                      if (response.ok) {
                        let dropletConfig = responseData.droplet;
                        let dropletId = dropletConfig.id;

                        // Wait for VPS creation to complete
                        await sock.sendMessage(orang, {text: `Memproses pembuatan VPS dengan konfigurasi:
            • Spesifikasi: ${vpsConfig.plan.description}
            • OS: ${Func.formatOsName(vpsConfig.os)}
            • Region: ${Func.formatRegionName(vpsConfig.region)}
            • Hostname: ${hostname}
            • Backup: ${vpsConfig.backups ? 'Aktif' : 'Tidak aktif'}

            Harap tunggu sekitar 60 detik...`});

                        await new Promise(resolve => setTimeout(resolve, 60000));

                        // Get complete information about the VPS
                        let dropletResponse = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + global.apiDigitalOcean
                          }
                        });

                        let dropletData = await dropletResponse.json();
                        let ipVPS = dropletData.droplet.networks.v4 && dropletData.droplet.networks.v4.length > 0 
                          ? dropletData.droplet.networks.v4[0].ip_address 
                          : "Tidak ada alamat IP yang tersedia";

                        let messageText = `*VPS BERHASIL DIBUAT! ✅*\n\n`;
                        messageText += `*Informasi VPS:*\n`;
                        messageText += `• ID: ${dropletId}\n`;
                        messageText += `• Hostname: ${hostname}\n`;
                        messageText += `• IP VPS: ${ipVPS}\n`;
                        messageText += `• Username: root\n`;
                        messageText += `• Password: ${password}\n\n`;
                        messageText += `*Detail Konfigurasi:*\n`;
                        messageText += `• Spesifikasi: ${vpsConfig.plan.description}\n`;
                        messageText += `• OS: ${Func.formatOsName(vpsConfig.os)}\n`;
                        messageText += `• Region: ${Func.formatRegionName(vpsConfig.region)}\n`;
                        messageText += `• Backup: ${vpsConfig.backups ? 'Aktif' : 'Tidak aktif'}\n\n`;
                        messageText += `Silahkan login menggunakan SSH dengan username: root dan password di atas.`;

                        await sock.sendMessage(orang, { text: messageText });
                      } else {
                        throw new Error(`Gagal membuat VPS: ${responseData.message}`);
                      }
                    } catch (err) {
                      console.error(err);
                      sock.sendMessage(orang, { text: `Terjadi kesalahan saat membuat VPS: ${err.message}` });
                    }

                    await sock.sendMessage(db.user[m.sender].saweria.chat, { delete: db.user[m.sender].saweria.msg.key });
                    delete db.user[m.sender].vpsConfig;
                    delete db.user[m.sender].saweria;
                  }
                }
              }
            }
            break;

           

            // Add this code for the cancel purchase command
            case "batalbeli": {
              if (db.user[m.sender].status_deposit) {
                db.user[m.sender].status_deposit = false;

                if (db.user[m.sender].saweria) {
                  await clearInterval(db.user[m.sender].saweria.exp);

                  if (db.user[m.sender].saweria.msg) {
                    await sock.sendMessage(m.chat, { delete: db.user[m.sender].saweria.msg.key });
                  }

                  delete db.user[m.sender].saweria;
                }

                // Clear VPS configuration
                if (db.user[m.sender].vpsConfig) {
                  delete db.user[m.sender].vpsConfig;
                }

                return m.reply("Transaksi pembelian berhasil dibatalkan!");
              } else {
                return m.reply("Tidak ada transaksi yang sedang berlangsung.");
              }
            }
            break;
            
                case "rvo":
        case "readviewonce": {
            if (!m.quoted) return m.reply("📝 Balas media dengan satu kali lihat");
            let messages = m.quoted
            if (!messages.msg.viewOnce) return m.reply("❌ Itu bukan pesan sekali liat !");
            delete messages.msg.viewOnce
            sock.copyNForward(m.cht, messages);
        }
        break
        case "brat": {
            const {
                execSync
            } = require("child_process");
            const fs = require("fs");
            const path = require("path");

            let input = m.isQuoted ? m.quoted.body : text;
            if (!input) return m.reply("> Reply/Masukan pesan");
            m.reply(config.messages.wait);

            if (m.text.includes("--animated")) {
                let txt = input.replace("--animated", "").trim().split(" ");
                let array = [];
                let tmpDirBase = path.resolve(`./tmp/brat_${Date.now()}`);

                fs.mkdirSync(tmpDirBase, {
                    recursive: true
                })
                for (let i = 0; i < txt.length; i++) {
                    let word = txt.slice(0, i + 1).join(" ");
                    let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(word)}`, {
                        responseType: 'arraybuffer'
                    })).data;
                    let tmpDir = path.resolve(`${tmpDirBase}/brat_${i}.mp4`);
                    fs.writeFileSync(tmpDir, media);
                    array.push(tmpDir);
                }

                let fileTxt = path.resolve(`${tmpDirBase}/cmd.txt`);
                let content = "";
                for (let i = 0; i < array.length; i++) {
                    content += `file '${array[i]}'\n`;
                    content += `duration 0.5\n`;
                }
                content += `file '${array[array.length - 1]}'\n`;
                content += `duration 3\n`;
                fs.writeFileSync(fileTxt, content);

                let output = path.resolve(`${tmpDirBase}/output.mp4`);
                execSync(`ffmpeg -y -f concat -safe 0 -i ${fileTxt} -vf "fps=30" -c:v libx264 -preset veryfast -pix_fmt yuv420p -t 00:00:10 ${output}`);
                let sticker = await writeExif({
                    mimetype: "video",
                    data: fs.readFileSync(output)
                }, {
                    packName: config.sticker.packname,
                    packPublish: config.sticker.author
                });
                fs.rmSync(tmpDirBase, {
                    recursive: true,
                    force: true
                });
                await m.reply({
                    sticker
                });
            } else {
                let media = (await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(input)}`, {
                    responseType: 'arraybuffer'
                })).data;
                let sticker = await writeExif({
                    mimetype: "image",
                    data: media
                }, {
                    packName: config.sticker.packname,
                    packPublish: config.sticker.author
                });
                await m.reply({
                    sticker
                });
            }
        }
        break;
        case "daftar": {
            let user = db.list().user[m.sender];
            if (user.register) return m.reply("> 🎉 Kamu sudah terdaftar!");
            if (!text) return m.reply("> 📢 Masukkan nama kamu untuk pendaftaran!");

            let list = Object.values(db.list().user).find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (list) return m.reply("> ❗ Nama tersebut sudah digunakan!");

            let bonus = 1000;
            user.register = true;
            user.name = text;
            user.rpg.money += bonus;
            user.rpg.exp += bonus;

            let cap = `*– 乂 Pendaftaran Berhasil!*\n`;
            cap += `> 🎉 Selamat ${user.name}, kamu berhasil mendaftar dan mendapatkan bonus tambahan!\n\n`;

            cap += `*– 乂 Hadiah Pendaftaran*\n`;
            cap += `> 💰 *Money:* 1.000\n`;
            cap += `> 📊 *Exp:* 1.000\n`;

            m.reply(cap);
        }
        break;

        case "jadwalsholat": {
            const axios = require('axios');
            const cheerio = require('cheerio');
            if (!text) return m.reply("> 📍 Masukkan nama kota yang kamu tuju!");
            const kota = text?.toLowerCase() || 'jakarta';

            try {
                const {
                    data
                } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
                const $ = cheerio.load(data);

                const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

                if (jadwal.length === 7) {
                    const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

                    const zan = `
╭──[ *📅 Jadwal Sholat* ]──✧
᎒⊸ *🌆 Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *📅 Tanggal*: ${tanggal}

╭──[ *🕰️ Waktu Sholat* ]──✧
᎒⊸ *Subuh:* ${subuh}
᎒⊸ *Duha:* ${duha}
᎒⊸ *Dzuhur:* ${dzuhur}
᎒⊸ *Ashar:* ${ashar}
᎒⊸ *Maghrib:* ${maghrib}
᎒⊸ *Isya:* ${isya}
╰────────────•`;

                    await m.reply(zan);
                } else {
                    await m.reply('❌ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.');
                }
            } catch (error) {
                await m.reply('❌ Terjadi kesalahan saat mengambil data!');
            }
        }
        break;

        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);

            let cap = "*– 乂 *Fitur Case* –*\n";
            cap += "> 📝 *`--add`* : Menambahkan fitur case baru\n";
            cap += "> 🔄 *`--get`* : Mengambil fitur case\n";
            cap += "> ❌ *`--delete`* : Menghapus fitur case\n";
            cap += "\n*– 乂 *List Case yang Tersedia* –*\n";
            cap += Case.list().map((a, i) => `> ${i + 1}. *${a}*`).join("\n");

            if (!text) return m.reply(cap);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("> ⚠️ Reply fitur case yang ingin disimpan!");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "> ✅ Berhasil menambahkan case baru!" : "> ❌ Gagal menambahkan case baru.");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin dihapus!");
                let status = Case.delete(input);
                m.reply(status ? `> ✅ Berhasil menghapus case *${input}*!` : `> ❌ Case *${input}* tidak ditemukan!`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("> ⚠️ Masukkan nama case yang ingin diambil!");
                if (!Case.list().includes(input)) return m.reply("> ❌ Case tidak ditemukan!");
                let status = Case.get(input);
                m.reply(status ? status : `> ❌ Case *${input}* tidak ditemukan!`);
            }
        }
        break;
        case "zzz": {
            let list = await Scraper.zzz.list();
            if (!text) return m.reply("> *🔍 Masukkan nama karakter dari game ZZZ*");

            let chara = list.find((a) => a.name.toLowerCase() === text.toLowerCase());
            if (!chara) return m.reply(`> *😞 Karakter tidak ditemukan!*

*– 乂 Berikut ${list.length} karakter dari game ZZZ:*

${list.map((a) => Object.entries(a).map(([a, b]) => `> *🔸 ${a.capitalize()}* : ${b}`).join('\n')).join("\n\n")}`);

            let data = await Scraper.zzz.chara(text);
            let cap = "*– 乂 **Zenless Zone Zero - Detail Karakter***\n"
            cap += Object.entries(data.info).map(([a, b]) => `> *🔹 ${a.capitalize()}* : ${b}`).join("\n");
            cap += "\n\n*– **Statistik Karakter** :*\n"
            cap += data.stats.map((a) => `> *🔸 ${a.name.capitalize()}* : ${a.value}`).join("\n");
            cap += "\n\n*– **Info Tim Karakter** :*\n"
            cap += data.team.map((a) => `> *🔹 Nama*: ${a.name}\n> *🔸 Peran*: ${a.role}`).join("\n\n");

            cap += "\n\n*– **Kemampuan Karakter** :*\n"
            cap += data.skills.map((a) => `> *🔸 Nama Kemampuan*: ${a.name}\n> ${a.description}`).join("\n\n");

            m.reply({
                text: cap,
                contextInfo: {
                    externalAdReply: {
                        title: `– **Zenless Zone Zero Wiki**: ${data.info.name}`,
                        body: `- **Elemen**: ${data.info.element}`,
                        mediaType: 1,
                        thumbnailUrl: data.info.image
                    }
                }
            });
        }
        break;

        case "sticker":
        case "s": {
            if (/image|video|webp/.test(quoted.msg.mimetype)) {
                let media = await quoted.download();
                if (quoted.msg?.seconds > 10)
                    throw "> *⚠️ Video lebih dari 10 detik tidak dapat dijadikan sticker*.";

                let exif;
                if (text) {
                    let [packname, author] = text.split(/[,|\-+&]/);
                    exif = {
                        packName: packname ? packname : "",
                        packPublish: author ? author : "",
                    };
                } else {
                    exif = {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    };
                }

                let sticker = await writeExif({
                    mimetype: quoted.msg.mimetype,
                    data: media
                }, exif);

                await m.reply({
                    sticker
                });
            } else if (m.mentions.length !== 0) {
                for (let id of m.mentions) {
                    await delay(1500);
                    let url = await sock.profilePictureUrl(id, "image");
                    let media = await axios
                        .get(url, {
                            responseType: "arraybuffer",
                        })
                        .then((a) => a.data);
                    let sticker = await writeExif(media, {
                        packName: config.sticker.packname,
                        packPublish: config.sticker.author,
                    });
                    await m.reply({
                        sticker
                    });
                }
            } else if (
                /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                    text,
                )
            ) {
                for (let url of Func.isUrl(text)) {
                    await delay(1500);
                }
            } else {
                m.reply("> *📸 Balas dengan foto atau video untuk dijadikan sticker*.");
            }
        }
        break;

        case "cases": {
            if (!m.isOwner) return m.reply(config.messages.owner);

            let cap = "*– 乂 **Cara Penggunaan Fitur Case***\n";
            cap += "> *➕ `--add`* untuk menambah fitur case baru\n";
            cap += "> *🔄 `--get`* untuk mengambil fitur case yang ada\n";
            cap += "> *❌ `--delete`* untuk menghapus fitur case\n";
            cap += "\n*– 乂 **Daftar Case yang Tersedia** :*\n";
            cap += Case.list().map((a, i) => `> *${i + 1}.* ${a}`).join("\n");

            if (!text) return m.reply(cap);

            if (text.includes("--add")) {
                if (!m.quoted) return m.reply("> *⚠️ Balas dengan fitur case yang ingin disimpan*.");
                let status = Case.add(m.quoted.body);
                m.reply(status ? "> *✅ Berhasil menambahkan case baru!*" : "> *❌ Gagal menambahkan case baru*.");
            } else if (text.includes("--delete")) {
                let input = text.replace("--delete", "").trim();
                if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin dihapus*!");
                let status = Case.delete(input);
                m.reply(status ? `> *✅ Berhasil menghapus case: ${input}!*` : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
            } else if (text.includes("--get")) {
                let input = text.replace("--get", "").trim();
                if (!input) return m.reply("> *⚠️ Masukkan nama case yang ingin diambil*!");
                if (!Case.list().includes(input)) return m.reply("> *❌ Case tidak ditemukan!*");
                let status = Case.get(input);
                m.reply(status ? status : `> *❌ Case ${input} tidak ditemukan. Periksa daftar case yang tersedia*.`);
            }
        }
        break;
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log("- Terjadi perubahan pada files case.js");
    delete require.cache[file];
});