const fs = require('fs');
const path = require('path');
const axios = require('axios');

const baseUrl = 'https://tinkererway.dev/web_skill_trees_resources/svg/electronics_icons/';
const publicDir = path.join(__dirname, '..', 'public');
const skillsDir = path.join(publicDir, 'skills.json');
const iconsDir = path.join(publicDir, 'icons');

// Folder to store images
const imageFolder = path.join(publicDir, 'icons');

if (!fs.existsSync(imageFolder)) {
  fs.mkdirSync(imageFolder);
}

// skills.json irakurri, eta JSON bihurtu parse erabiliz
const skills = JSON.parse(fs.readFileSync(skillsDir, 'utf8'));

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

// Argazki guztiak deskargatzeko funtzioa (Promesak array batean gorde)
async function downloadImages() {
    const downloadPromises = skills.map(skill => {
        const filename = skill.icon;
        const url = baseUrl + filename;
            return downloadImage(url, filename).then(() => console.log(`${filename} deskargatu da`))
            .catch(() => console.log(`Errorea ${filename} deskargatzean`));
    });
    await Promise.all(downloadPromises) // Promesa guztiak bukatu arte itxaron
}

downloadImages();