// === shared config
const API = 'https://coop-cert-app-production.up.railway.app/';

// === login behavior
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const res = await fetch(`${API}/login`, {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({
                username: fd.get('username'),
                password: fd.get('password')
            })
        });
        if (!res.ok) return document.getElementById('error').style.display = 'block';
        const { token } = await res.json();
        localStorage.setItem('jwt', token);
        location.href = 'certificate.html?name=' + encodeURIComponent(fd.get('username'));
    });
}

// === certificate behavior
if (location.pathname.endsWith('certificate.html')) {
    const token = localStorage.getItem('jwt');
    if (!token) { // noinspection JSAnnotator
        return location.href = 'index.html';
    }

    // extract name from URL for display + fetch date
    const name = new URLSearchParams(location.search).get('name');
    document.getElementById('recipient').textContent = name;

    // fetch real certificate payload (e.g. date)
    fetch(`${API}/certificate?name=${encodeURIComponent(name)}`, {
        headers:{ 'Authorization': `Bearer ${token}` }
    })
        .then(r => r.json())
        .then(data => {
            document.getElementById('date').textContent = data.date;
        })
        .catch(_ => {
            // invalid JWT? redirect back to login
            localStorage.removeItem('jwt');
            location.href = 'index.html';
        });

    // print & logout
    document.getElementById('printBtn').onclick = () => window.print();
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('jwt');
        location.href = 'index.html';
    };
}
