
// ==============================
// REGISTER
// ==============================

async function register() {

    const name = document.querySelector('#registerName').value.trim();
    const email = document.querySelector('#registerEmail').value.trim();
    const passwd = document.querySelector('#registerPassword').value;
    const confirm = document.querySelector('#registerConfirm').value;

    if (!name || !email || !passwd || !confirm) {
        showMessage('danger', 'ERROR', 'Please fill in all fields!');
        return;
    }

    if (passwd !== confirm) {
        showMessage('danger', 'ERROR', 'Passwords do not match!');
        return;
    }

    const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            passwd,
            confirm
        })
    });

    const res = await response.json();

    if (response.status !== 201) {
        showMessage('danger', 'ERROR', res.error);
        return;
    }

    showMessage('success', 'SUCCESS', 'Registration successful!');

    setTimeout(() => {
        navigate('views/users/login');
    }, 1000);
}

// ==============================
// LOGIN
// ==============================

async function login() {

    const email = document.querySelector('#loginEmail').value.trim();
    const passwd = document.querySelector('#loginPassword').value;

    if (!email || !passwd) {

        showMessage(
            'danger',
            'ERROR',
            'Please fill in all fields!'
        );

        return;
    }

    try {

        const response = await fetch(
            'http://localhost:3000/users/login',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email: email,
                    passwd: passwd
                })
            }
        );

        const res = await response.json();

        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                res.error
            );

            return;
        }

        // Bejelentkezett user mentése
sessionStorage.setItem(
    'loggedUser',
    JSON.stringify(res.loggedUser)
);

        showMessage(
            'success',
            'SUCCESS',
            'Login successful!'
        );

        setTimeout(() => {

            if (res.loggedUser.role === 'admin') {
                navigate('views/admin/dashboard');
            } else {
                navigate('views/users/home');
            }

        }, 500);

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}


// ==============================
// BETÖLTÖTT USER
// ==============================

function loadUser() {

    const user = sessionStorage.getItem('loggedUser');

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

// ==============================
// LOGOUT
// ==============================


function logout() {

    sessionStorage.removeItem('loggedUser');

    updateNavbar();

    showMessage(
        'success',
        'SUCCESS',
        'You have been logged out successfully!'
    );

    setTimeout(() => {
        navigate('views/users/login');
    }, 1000);
}

