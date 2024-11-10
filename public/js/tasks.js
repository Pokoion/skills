document.addEventListener('DOMContentLoaded', function() {
    const evidence = document.querySelector('.skillEvidence');
    const checkboxes = document.querySelectorAll('input[type = "checkbox"]');
    const submitButton = document.querySelector('#submitButton');
    const evidenceText = document.querySelector('#evidence');

    // Checbox guztiak klikatzean, evidence erakutsi, denak ez badaude ezkutatu
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                evidence.style.display = 'block';
            } else {
                evidence.style.display = 'none';
            }
        });
    });

    submitButton.addEventListener('click', () => {

        if(evidenceText.value === '') {
            alert('Enter a valid evidence please!'); 
            return;
        }

        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';

        // Submit Evidence botoiaren posizioa lortu
        const rect = submitButton.getBoundingClientRect();
        
        // Posizioa 0 eta 1 artean normalizatu
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 300,
            spread: 360,
            startVelocity: 60,
            scalar: 1,
            origin: { x: x, y: y }
         });

    });

}); 