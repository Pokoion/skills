document.addEventListener('DOMContentLoaded', async () => { // Dokumentua kargatzean funtzioa exekutatu
    const svgContainer = document.querySelector('.svg-container'); // svg-container elementua lortu

    async function loadSkills() {
        const skillsArray = await fetch('/skills.json').then(response => response.json()) // lehen sortutako JSON fitxategia lortu

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
        });
    }
    loadSkills();
});