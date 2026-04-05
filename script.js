// ===== Announcement Banner =====
const announcementBar = document.getElementById('announcementBar');
const announcementClose = document.getElementById('announcementClose');

announcementClose.addEventListener('click', () => {
    announcementBar.classList.add('hidden');
    sessionStorage.setItem('announcementClosed', 'true');
});

// Restore state
if (sessionStorage.getItem('announcementClosed') === 'true') {
    announcementBar.classList.add('hidden');
}

// ===== FAQ Accordion =====
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all others
    document.querySelectorAll('.faq-item.active').forEach(el => {
        el.classList.remove('active');
    });

    // Toggle clicked
    if (!isActive) {
        item.classList.add('active');
    }
}

// ===== Request Modal =====
function openRequestModal() {
    document.getElementById('requestModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRequestModal() {
    document.getElementById('requestModal').classList.remove('active');
    document.body.style.overflow = '';
}

function handleRequestSubmit(e) {
    e.preventDefault();

    const btn = document.querySelector('#requestForm .modal-submit-btn');
    const originalText = btn.textContent;

    const name = document.getElementById('reqName').value;
    const phone = document.getElementById('reqPhone').value;
    const message = document.getElementById('reqMessage').value;

    btn.textContent = 'שולח...';
    btn.disabled = true;

    fetch('https://hook.eu2.make.com/0yoinphtflks4kt8dalm8ppqac4nlpcn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, message }),
    })
    .then(response => {
        btn.classList.add('success');
        btn.textContent = '✓ נשלח בהצלחה!';

        setTimeout(() => {
            closeRequestModal();
            btn.classList.remove('success');
            btn.textContent = originalText;
            btn.disabled = false;
            document.getElementById('requestForm').reset();
        }, 1800);
    })
    .catch(error => {
        console.error('Error:', error);
        btn.textContent = 'שגיאה בשליחה';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 3000);
    });
}

// ===== Team Modal =====
function openTeamModal() {
    document.getElementById('teamModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTeamModal() {
    document.getElementById('teamModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Close modal on overlay click =====
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===== Close modal on Escape =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ===== Newsletter Form =====
function handleNewsletter(e) {
    e.preventDefault();
    const btn = document.getElementById('newsletterBtn');
    const input = document.getElementById('newsletterEmail');
    const originalText = btn.textContent;

    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✓ תודה!';
        btn.style.background = '#25D366';
        btn.style.color = 'white';
        input.value = '';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 2500);
    }, 800);
}

// ===== Tile Hover Haptic (mobile) =====
document.querySelectorAll('.action-tile').forEach(tile => {
    tile.addEventListener('touchstart', () => {
        if (navigator.vibrate) navigator.vibrate(10);
    }, { passive: true });
});

// ===== Parallax on hero logo =====
const heroLogo = document.getElementById('heroLogo');
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        heroLogo.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// ===== WhatsApp float: hide when at bottom =====
const waFloat = document.getElementById('whatsappFloat');
const footer = document.getElementById('siteFooter');

window.addEventListener('scroll', () => {
    if (!footer || !waFloat) return;
    const footerRect = footer.getBoundingClientRect();
    if (footerRect.top < window.innerHeight) {
        waFloat.style.opacity = '0';
        waFloat.style.pointerEvents = 'none';
    } else {
        waFloat.style.opacity = '1';
        waFloat.style.pointerEvents = 'auto';
    }
}, { passive: true });
