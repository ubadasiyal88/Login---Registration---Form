/* ══════════════════════════════════════
   DESKTOP — toggle login / register
══════════════════════════════════════ */
const container   = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn    = document.querySelector('.login-btn');

registerBtn && registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn    && loginBtn.addEventListener('click',    () => container.classList.remove('active'));


/* ══════════════════════════════════════
   PASSWORD ICON — smart eye / lock
   Eye only appears once user starts typing.
   Lock returns when field is cleared.
══════════════════════════════════════ */
function initPasswordIcons(scope) {
    const pairs = scope.querySelectorAll('.input-box');
    pairs.forEach(box => {
        const input = box.querySelector('.pw-input');
        const icon  = box.querySelector('.pw-icon');
        if (!input || !icon) return;

        // Start: lock, not clickable
        icon.classList.remove('fa-eye', 'clickable');
        icon.classList.add('fa-lock');

        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                // User typed — show eye, make clickable
                if (!icon.classList.contains('fa-eye')) {
                    icon.classList.remove('fa-lock');
                    icon.classList.add('fa-eye', 'clickable');
                    // Reset to password type when icon switches
                    input.type = 'password';
                }
            } else {
                // Cleared — back to lock
                icon.classList.remove('fa-eye', 'clickable');
                icon.classList.add('fa-lock');
                input.type = 'password';
            }
        });

        icon.addEventListener('click', () => {
            if (!icon.classList.contains('clickable')) return;
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Init for desktop forms
initPasswordIcons(document);


/* ══════════════════════════════════════
   MOBILE FLOW
══════════════════════════════════════ */
const isMobile = () => window.innerWidth <= 768;

const coverLogin    = document.getElementById('cover-login');
const coverRegister = document.getElementById('cover-register');
const mobileLogin   = document.getElementById('mobile-login');
const mobileReg     = document.getElementById('mobile-register');

let autoTimer = null;

/* ── Helpers ── */
function hideAll() {
    [coverLogin, coverRegister, mobileLogin, mobileReg].forEach(el => el.classList.add('hidden'));
    clearTimeout(autoTimer);
}

function startTimerBar(fillId, duration, callback) {
    const fill = document.getElementById(fillId);
    if (!fill) return;
    // Force reflow so transition fires
    fill.classList.remove('running');
    void fill.offsetWidth;
    fill.classList.add('running');
    autoTimer = setTimeout(callback, duration);
}

function showCoverLogin() {
    hideAll();
    coverLogin.classList.remove('hidden');
    // Remove old animation then re-trigger
    coverLogin.style.animation = 'none';
    void coverLogin.offsetWidth;
    coverLogin.style.animation = '';
    startTimerBar('timer-fill-login', 5000, showMobileLogin);
}

function showCoverRegister() {
    hideAll();
    coverRegister.classList.remove('hidden');
    coverRegister.style.animation = 'none';
    void coverRegister.offsetWidth;
    coverRegister.style.animation = '';
    startTimerBar('timer-fill-register', 5000, showMobileRegister);
}

function showMobileLogin() {
    clearTimeout(autoTimer);
    hideAll();
    mobileLogin.classList.remove('hidden');
    mobileLogin.style.animation = 'none';
    void mobileLogin.offsetWidth;
    mobileLogin.style.animation = '';
    initPasswordIcons(mobileLogin);
}

function showMobileRegister() {
    clearTimeout(autoTimer);
    hideAll();
    mobileReg.classList.remove('hidden');
    mobileReg.style.animation = 'none';
    void mobileReg.offsetWidth;
    mobileReg.style.animation = '';
    initPasswordIcons(mobileReg);
}

/* ── Button wiring ── */
document.getElementById('cover-login-btn')    && document.getElementById('cover-login-btn').addEventListener('click', showMobileLogin);
document.getElementById('cover-register-btn') && document.getElementById('cover-register-btn').addEventListener('click', showMobileRegister);

// "Register" link inside login form → show register cover first
document.getElementById('goto-register') && document.getElementById('goto-register').addEventListener('click', e => {
    e.preventDefault();
    showCoverRegister();
});

// "Login" link inside register form → show login cover first
document.getElementById('goto-login') && document.getElementById('goto-login').addEventListener('click', e => {
    e.preventDefault();
    showCoverLogin();
});

/* ── Boot: on mobile, start with login cover ── */
if (isMobile()) {
    showCoverLogin();
}

/* ── Resize: clean up if going desktop ↔ mobile ── */
window.addEventListener('resize', () => {
    if (!isMobile()) {
        clearTimeout(autoTimer);
        hideAll();
    } else {
        // Coming back to mobile — show login cover if nothing visible
        const anyVisible = [coverLogin, coverRegister, mobileLogin, mobileReg]
            .some(el => !el.classList.contains('hidden'));
        if (!anyVisible) showCoverLogin();
    }
});