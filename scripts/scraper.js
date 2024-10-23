const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree'

let lortu = async () => {
    try{
        // Launch a new browser instance
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Navigate to the webpage
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        const data = await page.evaluate(() => {
            const skills = Array.from(document.querySelectorAll('svg > text'));
            
            return skills.map((skill, i) => ({
                'id': i + 1,
                'text': Array.from(skill.querySelectorAll('tspan')).reduce((acc, text) => {
                    return acc + text.innerHTML + '\n\n\n';
                }, ''),
                'icon': argazkiak[i]
            }));
        });
        }catch(e){
            console.log('error:', e)
        }
}