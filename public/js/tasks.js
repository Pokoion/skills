document.addEventListener('DOMContentLoaded', function() {
    const evidence = document.querySelector('.skillEvidence');
    const checkboxes = document.querySelectorAll('input[type = "checkbox"]');

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

});