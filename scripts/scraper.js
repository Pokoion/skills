const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree'

let lortu = async () => {
    try{
        // Launch a new browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Navigate to the webpage
        await page.goto(url, { waitUntil: 'networkidle0' });

        const data = await page.evaluate(() => {
            const skills = Array.from(document.querySelectorAll('.svg-wrapper'));
            
            return skills.map(skill => {
                let id = skill.getAttribute('data-id'); //svg-wrapper-en data-id atributua lortu
                let skill_texts = Array.from(skill.querySelectorAll('text > tspan')); // svg-wrapper-en textuak lortu
                let full_text = skill_texts.map(tspan => tspan.textContent).join('\n\n\n'); // text barruko textuak array batean elkartu, gero '\n\n\n'-rekin elkartu string batean
                let img = skill.querySelector('image').getAttribute('href').split('/').pop(); // argazkiaren izena lortu

                return{
                    'id': id,
                    'text': full_text,
                    'icon': img
                }
            });
        });
        console.log(data);

        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        // Write data to skills.json in the public directory
        const filePath = path.join(publicDir, 'skills.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log('Data saved to skills.json');

        await browser.close();

        }catch(e){
            console.log('error:', e)
        }
}

lortu();