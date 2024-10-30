const fs = require('fs');
const path = require('path');

const baseUrl = 'https://tinkererway.dev/web_skill_trees_resources/svg/electronics_icons/';
const publicDir = path.join(__dirname, '../public');

const skillsArray = await fetch(publicDir + '/skills.json').then(response => response.json())

async function downloadImage(imageUrl, dest) {
    return new Promise((resolve, reject) => {
        
}