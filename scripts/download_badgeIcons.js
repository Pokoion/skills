const fs = require('fs');
const path = require('path');
const axios = require('axios');

const baseUrl = 'https://raw.githubusercontent.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/master/rangos/png/';
const publicDir = path.join(__dirname, '..', 'public');
const badgesDir = path.join(publicDir, 'badges.json');

const imageFolder = path.join(publicDir, 'badges');

if (!fs.existsSync(imageFolder)) {
    fs.mkdirSync(imageFolder);
  }

const badgeJSON = JSON.parse(fs.readFileSync(badgesDir, 'utf8'));

// Argazki bat deskargatzeko funtzioa
async function downloadImage(url, filename) {
  const filePath = path.join(imageFolder, filename);
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function downloadImages() {
    const downloadPromises = badgeJSON.map(badge => {
        const filename = badge.png;
        const url = baseUrl + filename;
            return downloadImage(url, filename).then(() => console.log(`${filename} deskargatu da`))
            .catch(() => console.log(`Errorea ${filename} deskargatzean`));
    });
    await Promise.all(downloadPromises) // Promesa guztiak bukatu arte itxaron
}
downloadImages();