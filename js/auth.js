const loginUser = document.getElementById('userName');
const loginPass = document.getElementById('password');
const loginBtn  = document.getElementById('btn');


loginBtn.addEventListener('click', () => {
    if (loginUser.value === 'admin2025' && loginPass.value === 'admin') {
        localStorage.setItem('isLoggedIn','true');
        location.href = 'certificate.html';
    } else {
        alert("Username and password is wrong");
    }
});

// Protect against direct access
window.addEventListener('load', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') return;
    // allow login page
});