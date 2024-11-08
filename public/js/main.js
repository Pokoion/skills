document.addEventListener('DOMContentLoaded', async () => { // Dokumentua kargatzean funtzioa exekutatu
    const svgContainer = document.querySelector('.svg-container'); // svg-container elementua lortu

    async function loadSkills() {
        const skillsArray = await fetch('/skills.json').then(response => response.json()) // lehen sortutako JSON fitxategia lortu

        const footer = document.querySelector('.description'); // footer elementua lortu

        skillsArray.forEach(skill => {
            // svg-wrapper elementua sortu
            const svgWrapper = document.createElement('div');
            svgWrapper.className = 'svg-wrapper';
            svgWrapper.setAttribute('data-id', skill.id);
            svgWrapper.setAttribute('data-custom', false);
            svgContainer.appendChild(svgWrapper);

            // svg elementua sortu
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') // CreateElement ordez createElementNS erabili behar da
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            svg.setAttribute('viewBox', '0 0 100 100');
            svgWrapper.appendChild(svg);

            // polygon elementua sortu
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
            polygon.classList.add('hexagon');
            svg.appendChild(polygon);

            // text elementua sortu
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '50%');
            text.setAttribute('y', '20%');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'black');
            text.setAttribute('font-size', '9');
            svg.appendChild(text);

            skill.text.split('\n\n\n').forEach(line => {
                // lerro bakoitzeko tspan elementua sortu
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.setAttribute('x', '50%');
                tspan.setAttribute('dy', '1.2em');
                tspan.setAttribute('font-weight', 'bold');
                tspan.textContent = line;
                text.appendChild(tspan);
            });

            // image elementua sortu
            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('x', '35%');
            image.setAttribute('y', '60%');
            image.setAttribute('width', '30');
            image.setAttribute('height', '30');
            image.setAttribute('href', `icons/${skill.icon}`);
            svg.appendChild(image);

                // Arkatz emoji-a sortu
                const pencilEmoji = document.createElement('div');
                pencilEmoji.className = 'emoji pencil';
                pencilEmoji.textContent = '✏️';
                pencilEmoji.style.position = 'absolute';
                pencilEmoji.style.bottom = '10px';
                pencilEmoji.style.left = '10px';
                pencilEmoji.style.display = 'none';

                pencilEmoji.addEventListener('click', () => {
                    console.log('Pencil emoji clicked');
                });

                // Liburu emoji-a sortu
                const bookEmoji = document.createElement('div');
                bookEmoji.className = 'emoji book';
                bookEmoji.textContent = '📖';
                bookEmoji.style.position = 'absolute';
                bookEmoji.style.bottom = '10px';
                bookEmoji.style.right = '10px';
                bookEmoji.style.display = 'none';

                bookEmoji.addEventListener('click', () => {
                    window.location.href = `/tasks?id=${skill.id}`;
                    console.log('Book emoji clicked');
                });

                svgWrapper.appendChild(pencilEmoji);
                svgWrapper.appendChild(bookEmoji);

                svgWrapper.addEventListener('mouseover', () => {
                    svgWrapper.style.transform = 'scale(1.2)';
                    pencilEmoji.style.display = 'block';
                    bookEmoji.style.display = 'block';
                    footer.innerText = skill.description;
                    footer.style.visibility = 'visible';
                });

                svgWrapper.addEventListener('mouseout', () => {
                    svgWrapper.style.transform = 'scale(1)';
                    pencilEmoji.style.display = 'none';
                    bookEmoji.style.display = 'none';
                    footer.style.visibility = 'hidden';
                });

        });

    }
    loadSkills();
});