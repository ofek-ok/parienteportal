// ===== Arbox URLs (update with real URLs later) =====
const ARBOX_URLS = {
    kids: {
        jimbo:  'https://arbox.link/lJv7O-V7',
        '2pw':  'https://arbox.link/27JIzMnQ',
        '4pw':  'https://arbox.link/L8bU5tDH'
    },
    general: {
        '1pw':  'https://arbox.link/N3YbI3az',
        '2pw':  'https://arbox.link/OJ-e-0hF',
        '3pw':  'https://arbox.link/LTj2l1n7',
        '4pw':  'https://arbox.link/LcW792rD',
        open:   'https://arbox.link/SK2EmASJ'
    }
};

let selectedAge = null;

// ===== Start Button =====
document.getElementById('startBtn').addEventListener('click', () => {
    showStep('stepAge');
});

function showStep(stepId) {
    document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById(stepId);
    step.classList.remove('active');
    // Force reflow for animation
    void step.offsetWidth;
    step.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToIntro() {
    showStep('stepIntro');
}

function goToAge() {
    showStep('stepAge');
}

// ===== Age Selection =====
function selectAge(age) {
    selectedAge = age;

    // Animate button press
    document.querySelectorAll('.age-btn').forEach(btn => {
        btn.style.borderColor = '';
        btn.style.background = '';
    });

    const clicked = document.querySelector(`.age-btn[data-age="${age}"]`);
    clicked.style.borderColor = 'var(--gold)';
    clicked.style.background = 'rgba(245, 166, 35, 0.08)';

    // Show correct frequency grid
    document.getElementById('freqKids').style.display = 'none';
    document.getElementById('freqGeneral').style.display = 'none';

    if (age === 'kids') {
        document.getElementById('freqKids').style.display = 'flex';
        document.getElementById('freqDesc').textContent = 'בחרו מסלול לילדים:';
    } else {
        document.getElementById('freqGeneral').style.display = 'flex';
        const label = age === 'teens' ? 'נוער' : 'בוגרים';
        document.getElementById('freqDesc').textContent = `בחרו מסלול ל${label}:`;
    }

    // Short delay then switch
    setTimeout(() => {
        showStep('stepFrequency');
    }, 300);
}

// ===== Plan Selection =====
function selectPlan(category, plan) {
    const url = ARBOX_URLS[category]?.[plan] || 'https://pariente.arboxapp.com/';
    document.getElementById('arboxLink').href = url;
    openConfirm();
}

// ===== Confirmation Modal =====
function openConfirm() {
    document.getElementById('confirmModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConfirm() {
    document.getElementById('confirmModal').classList.remove('active');
    document.body.style.overflow = '';
}

// Close on overlay
document.getElementById('confirmModal').addEventListener('click', (e) => {
    if (e.target.id === 'confirmModal') {
        closeConfirm();
    }
});

// ESC to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeConfirm();
});
