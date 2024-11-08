const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url =  'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki#listado-de-rangos';

let lortu = async () => {
    try{
        // Launch a new browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Navigate to the webpage
        await page.goto(url, { waitUntil: 'networkidle0' });

        const data = await page.evaluate(() => {
            const allTables = Array.from(document.querySelectorAll("table"));
            let tables = allTables.slice(-5)
            let list = [];
            tables.forEach(table=>{
                Array.from(table.childNodes[3].children).forEach(child=>{
                    list.push(child)
                })
            })
            let bitpoints = -1;
           return list.map(tr=>{
                let img =  tr.cells[1].innerHTML.split('/').pop().split('"')[0]
                let rango = tr.children[2].childNodes[0].firstChild.data
                let minbit=bitpoints+1;
                bitpoints+=10;
                let maxbit = bitpoints;
                return {
                   'rango':rango,
                    'bitpoints_min':minbit,
                    'bitpoints_max':maxbit,
                    'png':img
                }
            })
        });
        console.log(data);

        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        const filePath = path.join(publicDir, 'badges.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log('Data saved to skills.json');

        await browser.close();

        }catch(e){
            console.log('error:', e)
        }
}

lortu();