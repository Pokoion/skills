document.addEventListener('DOMContentLoaded', async () => { // Dokumentua kargatzean funtzioa exekutatu
    const svgContainer = document.querySelector('.svg-container'); // svg-container elementua lortu
    const footer = document.querySelector('.description'); // footer elementua lortu

    async function loadSkills() {
        const isAdmin = await fetch('/api/user').then(response => response.json()).then(data => data.admin);
        //const skillsArray = await fetch('/skills.json').then(response => response.json()) // lehen sortutako JSON fitxategia lortu
        const skillTreeName = window.location.pathname.split('/')[2]; // URLa lortu eta skillTreeName lortu
        const skillsArray = await fetch(`/skills/${skillTreeName}/skills`).then(response => response.json()) // orain datu basean dauden skill-ak lortu

        skillsArray.forEach(skill => {
            const UserSkill = fetchUserSkills(skill._id);
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

            UserSkill!=null ? completed =UserSkill.completed : completed = false;
 
            // polygon elementua sortu
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5');
            polygon.style.fill = completed ? '#0ea13f' : 'white';
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

            skill.text.split('\n').forEach(line => {
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
            image.setAttribute('href', `/icons/${skill.icon}`);
            svg.appendChild(image);
            
            UserSkill!=null ? unverifiedEvidence = getSkillUnverifiedEvidence(UserSkill.verifications) : unverifiedEvidence = 0;
          
            // borobil gorria
            const redDotEmoji = document.createElement('div');
            redDotEmoji.className = 'Evidenceemoji red-dot';
            redDotEmoji.innerHTML = `🔴<span class="evidence-count">${unverifiedEvidence}</span>`;
            UserSkill!=null ? redDotEmoji.style.display = 'block' : redDotEmoji.style.display = 'none';
   

            UserSkill!=null ? completedSkill = getSkillCompleted(UserSkill.verifications) : completedSkill = 0;


            // borobil berdea
            const greenDotEmoji = document.createElement('div');
            greenDotEmoji.className = 'Evidenceemoji completed';
            greenDotEmoji.innerHTML = `🟢<span class="evidence-count">${completedSkill}</span>`;
            UserSkill!=null ? greenDotEmoji.style.display = 'block' : greenDotEmoji.style.display = 'none';
 
            let pencilEmoji;
            // Arkatz emoji-a sortu
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

            // Liburu emoji-a sortu
            const bookEmoji = document.createElement('div');
            bookEmoji.className = 'emoji';
            bookEmoji.textContent = '📖';
            bookEmoji.style.position = 'absolute';
            bookEmoji.style.bottom = '10px';
            bookEmoji.style.right = '10px';
            bookEmoji.style.display = 'none';

            // Liburu emoji-a klikatzean tasks iriki
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
                    if (!svgWrapper.matches(':hover')) { // Arratoia skill gainean ez badago
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

    async function fetchUserSkills(skillId) {
          try {
            const response =  await fetch(`/user-skill/${skillId}`);

            if (!response.ok) {
                console.error(`Failed to fetch userSkill. Status: ${response.status}`);
                return null; 
              }
              return await response.json();

          } catch (error) {
            console.error('Errorea:', error);
            return null;
          }
        }
      

    // Skill baten berifikatu gabeko ebidentziak lortzeko funtzioa, oraingoz random
    const getSkillUnverifiedEvidence = (verifications) => {
        let count=0;
        if (this.verifications.length === 0) {
            return 0;
        }
        verifications.forEach(v=>{
            if(!v.approved){
                count++;
            }
        });
        return count;
    }

    const getSkillCompleted = (verifications) => {
        let count=0;
        if (this.verifications.length === 0) {
            return 0;
        }
        verifications.forEach(v=>{
            if(v.approved){
                count++;
            }
        });
        return count;
    }

   
    loadSkills();
});