document.addEventListener('DOMContentLoaded', function () {
    const evidence = document.querySelector('.skillEvidence');
    const checkboxes = document.querySelectorAll('input[type = "checkbox"]');
    const submitButton = document.querySelector('#submitButton');
    const evidenceText = document.querySelector('#evidence');
    const tablebody = document.querySelector("tbody")
    const unverifiedEvidence = document.querySelector('.unverifiedEvidence');

    // Checbox guztiak klikatzean, evidence erakutsi, denak ez badaude ezkutatu
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {

                confetti({
                    particleCount: 300,
                    spread: 360,
                    startVelocity: 45,
                    scalar: 1,
                });

                evidence.style.display = 'block';
            } else {

            }
        });
    });

    submitButton.addEventListener('click', () => {

        if (evidenceText.value === '') {
            alert('Enter a valid evidence please!');
            return;
        }
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
        enterValue(evidenceText.value);
    });

    function getSkillSubmissions() {
        return [{
            user: 'Peio',
            evidence: 'https://example.com/'
        },
        {
            user: 'Ane',
            evidence: 'https://example.com/proof'
        }]
    }

    function hasUserPassedSkill() {
        return true;
    }

    function addSkillSubmissions(evidence) {
        if (evidence.length == 0 || !hasUserPassedSkill()) {
            return;
        }
        unverifiedEvidence.style.display = 'block';
        evidence.forEach(evidence => {
            const row = document.createElement('tr');

            // User cell
            const userCell = document.createElement('td');
            userCell.textContent = evidence.user;
            row.appendChild(userCell);

            // Evidence cell
            const evidenceCell = document.createElement('td');
            evidenceCell.textContent = evidence.evidence;
            row.appendChild(evidenceCell);

            // Actions cell
            const actionsCell = document.createElement('td');
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'actions';
            actionsContainer.style.gap = '5px';

            const approveButton = document.createElement('button');
            approveButton.textContent = 'Approve';
            approveButton.className = 'approve-btn';
            approveButton.addEventListener('click', () => {

            });
            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Reject';
            rejectButton.className = 'reject-btn';
            rejectButton.addEventListener('click', () => {

            });

            actionsContainer.appendChild(approveButton);
            actionsContainer.appendChild(rejectButton);
            actionsCell.appendChild(actionsContainer);
            row.appendChild(actionsCell);

            tablebody.appendChild(row);
        });
    }

    submissions = getSkillSubmissions();
    console.log(submissions);
    addSkillSubmissions(submissions);

}); 