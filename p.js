const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

async function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .glob('**/*', {
        cwd: source,
        ignore: ['sessions/**', 'node_modules/**', '.npm/**', out.replace(/^.*[\\/]/, '')], // Tambahkan nama file zip ke daftar ignore
        dot: true, // Sertakan file dotfiles (misalnya, .gitignore)
      })
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

// Contoh penggunaan:
async function main() {
  const sourceDir = __dirname; // Direktori saat ini
  const outputZip = path.join(__dirname, 'archive.zip'); // Lokasi file ZIP output

  try {
    await zipDirectory(sourceDir, outputZip);
    console.log(`Folder dan file berhasil di-zip ke ${outputZip}`);
  } catch (err) {
    console.error('Terjadi kesalahan saat membuat ZIP:', err);
  }
}

main();