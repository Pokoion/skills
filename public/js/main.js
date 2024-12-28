document.addEventListener('DOMContentLoaded', async () => {
    const svgContainer = document.querySelector('.svg-container');
    const footer = document.querySelector('.description');

    async function loadSkills() {
        const isAdmin = await fetch('/api/user').then(response => response.json()).then(data => data.admin);
        const skillTreeName = window.location.pathname.split('/')[2];
        const skillsArray = await fetch(`/skills/${skillTreeName}/skills`).then(response => response.json());

        const userSkills = await Promise.all(skillsArray.map(skill => fetchUserSkills(skill._id)));

        skillsArray.forEach(async (skill, index) => {
            const UserSkill = userSkills[index];

            const svgWrapper = document.createElement('div');
            svgWrapper.className = 'svg-wrapper';
            svgWrapper.setAttribute('data-id', skill.id);
            svgWrapper.setAttribute('data-custom', false);
            svgContainer.appendChild(svgWrapper);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            svg.setAttribute('viewBox', '0 0 100 100');
            svgWrapper.appendChild(svg);

            let completed = UserSkill ? UserSkill.completed : false;

            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
            polygon.style.fill = completed ? '#0ea13f' : 'white';
            polygon.classList.add('hexagon');
            svg.appendChild(polygon);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '50%');
            text.setAttribute('y', '20%');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'black');
            text.setAttribute('font-size', '9');
            svg.appendChild(text);

            skill.text.split('\n').forEach(line => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.setAttribute('x', '50%');
                tspan.setAttribute('dy', '1.2em');
                tspan.setAttribute('font-weight', 'bold');
                tspan.textContent = line;
                text.appendChild(tspan);
            });

            const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            image.setAttribute('x', '35%');
            image.setAttribute('y', '60%');
            image.setAttribute('width', '30');
            image.setAttribute('height', '30');
            image.setAttribute('href', `/icons/${skill.icon}`);
            svg.appendChild(image);

            let unverifiedEvidence = await getSkillUnverifiedEvidence(skill._id);

            const redDotEmoji = document.createElement('div');
            redDotEmoji.className = 'Evidenceemoji red-dot';
            redDotEmoji.innerHTML = `🔴<span class="evidence-count">${unverifiedEvidence}</span>`;

            // If the user is an admin or the user has completed the skill and unverified evidence is greater than 0, show the red dot emoji
            if (isAdmin || UserSkill){
                (isAdmin || UserSkill.completed) && unverifiedEvidence > 0 ? redDotEmoji.style.display = 'block' : redDotEmoji.style.display = 'none';
            }else{
                redDotEmoji.style.display = 'none';
            };

            // If the user has completed the skill, show the green dot emoji
            let completedSkill = UserSkill? UserSkill.verifications.filter(v => v.approved).length : 0;
            const greenDotEmoji = document.createElement('div');
            greenDotEmoji.className = 'Evidenceemoji completed';
            greenDotEmoji.innerHTML = `🟢<span class="evidence-count">${completedSkill}</span>`;
            UserSkill ? greenDotEmoji.style.display = 'block' : greenDotEmoji.style.display = 'none';

            let pencilEmoji;
            if (isAdmin) {
                pencilEmoji = document.createElement('div');
                pencilEmoji.className = 'emoji pencil-emoji';
                pencilEmoji.textContent = '✏️';

                pencilEmoji.addEventListener('click', () => {
                    window.location.href = `/skills/${skillTreeName}/edit/${skill.id}`;
                    console.log('Pencil emoji clicked');
                });
                svgWrapper.appendChild(pencilEmoji);
            }

            const bookEmoji = document.createElement('div');
            bookEmoji.className = 'emoji';
            bookEmoji.textContent = '📖';
            bookEmoji.style.position = 'absolute';
            bookEmoji.style.bottom = '10px';
            bookEmoji.style.right = '10px';
            bookEmoji.style.display = 'none';

            bookEmoji.addEventListener('click', () => {
                window.location.href = `/skills/${skillTreeName}/view/${skill.id}`;
                console.log('Book emoji clicked');
            });

            svgWrapper.appendChild(redDotEmoji);
            svgWrapper.appendChild(greenDotEmoji);
            svgWrapper.appendChild(bookEmoji);

            svgWrapper.addEventListener('mouseover', () => {
                svgWrapper.style.transform = 'scale(1.2)';
                svgWrapper.classList.add('skill-hover');
                if (isAdmin) {
                    pencilEmoji.style.display = 'block';
                    pencilEmoji.classList.remove('hide');
                    pencilEmoji.classList.add('show');
                }
                bookEmoji.style.display = 'block';
                bookEmoji.classList.remove('hide');
                bookEmoji.classList.add('show');
                footer.innerText = skill.description;
                footer.style.visibility = 'visible';
            });

            svgWrapper.addEventListener('mouseout', () => {
                svgWrapper.style.transform = 'scale(1)';
                svgWrapper.classList.remove('skill-hover');
                if (isAdmin) {
                    pencilEmoji.classList.remove('show');
                    pencilEmoji.classList.add('hide');
                }
                bookEmoji.classList.remove('show');
                bookEmoji.classList.add('hide');
                footer.style.visibility = 'hidden';
                setTimeout(() => {
                    if (!svgWrapper.matches(':hover')) {
                        if (isAdmin) {
                            pencilEmoji.style.display = 'none';
                            pencilEmoji.classList.remove('hide');
                        }
                        bookEmoji.style.display = 'none';
                        bookEmoji.classList.remove('hide');
                    }
                }, 200);
            });
        });
    }

    // Fetch user skill data
    async function fetchUserSkills(skillId) {
        try {
            let data = await fetch(`/user-skill/${skillId}`)
            if (data.status === 204) {
                return null;
            }
            data = await data.json();
            console.log('UserSkill:', data);
            return data;

        } catch (error) {
            console.error('Errorea:', error);
            return null;
        }
    }

    // Get the number of unverified evidence for a skill
    const getSkillUnverifiedEvidence = async (skillId) => {
        const unverifiedEvidence = await fetch(`/user-skillCount/${skillId}`).then(response => response.json()).then(data => data.unverifiedEvidenceCount);
        return unverifiedEvidence;
    }

    loadSkills();
});