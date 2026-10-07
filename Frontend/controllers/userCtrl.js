

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


    

        sessionStorage.setItem(
            'loggedUser',
            JSON.stringify(res.loggedUser)
        );


   

        updateNavbar();


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
function loadUser() {

    const user = sessionStorage.getItem('loggedUser');

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}
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

    }, 500);
}
async function getProfile() {

    const user = loadUser();

    if (!user) {

        navigate('views/users/login');
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/users/${user.ID}`
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

        document.querySelector('#profileName').value =
            res.name;

        document.querySelector('#profileEmail').value =
            res.email;

        document.querySelector('#profileRole').innerText =
            res.role;

        document.querySelector('#profileID').innerText =
            res.ID;

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
async function updateProfile() {

    const user = loadUser();

    if (!user) {

        navigate('views/users/login');
        return;
    }

    const name =
        document.querySelector('#profileName').value.trim();

    const email =
        document.querySelector('#profileEmail').value.trim();


    if (!name || !email) {

        showMessage(
            'danger',
            'ERROR',
            'Please fill in all fields!'
        );

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/users/${user.ID}`,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    username: name,
                    email: email,
                    loggedUserID: user.ID

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


     
        

        user.name = name;
        user.email = email;

        sessionStorage.setItem(
            'loggedUser',
            JSON.stringify(user)
        );


        
        updateNavbar();


        showMessage(
            'success',
            'SUCCESS',
            'Profile updated successfully!'
        );

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}

async function changePassword() {

    const user = loadUser();

    if (!user) {

        navigate('views/users/login');
        return;
    }


    const oldpass =
        document.querySelector('#oldPassword').value;

    const newpass =
        document.querySelector('#newPassword').value;

    const confirm =
        document.querySelector('#confirmPassword').value;



    if (!oldpass || !newpass || !confirm) {

        showMessage(
            'danger',
            'ERROR',
            'Please fill in all fields!'
        );

        return;
    }


    if (newpass.length < 6) {

        showMessage(
            'danger',
            'ERROR',
            'Password must be at least 6 characters long!'
        );

        return;
    }


    if (newpass !== confirm) {

        showMessage(
            'danger',
            'ERROR',
            'Passwords do not match!'
        );

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/users/${user.ID}/passmod`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    oldpass,
                    newpass,
                    confirm

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



        document.querySelector('#oldPassword').value = '';
        document.querySelector('#newPassword').value = '';
        document.querySelector('#confirmPassword').value = '';


        showMessage(
            'success',
            'SUCCESS',
            'Password changed successfully!'
        );


    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
function showHomeGreeting() {

    const loggedUser = loadUser();

    const greetingElement = document.querySelector('#homeGreeting');
    const textElement = document.querySelector('#homeGreetingText');
    const iconElement = document.querySelector('#homeGreetingIcon');

    if (!greetingElement || !textElement || !iconElement) {
        return;
    }

    const userName =
        loggedUser?.name ||
        loggedUser?.username ||
        loggedUser?.Name ||
        'Felhasználó';

    const hour = new Date().getHours();

    let greeting;
    let text;
    let icon;

    if (hour >= 5 && hour < 12) {

        greeting = `Jó reggelt, ${userName}!`;
        text = 'Indítsuk jól a napot! ☀️';
        icon = 'bi bi-sun';

    } else if (hour >= 12 && hour < 18) {

        greeting = `Szép napot, ${userName}!`;
        text = 'Nézzük meg, milyen idő van ma!';
        icon = 'bi bi-cloud-sun';

    } else if (hour >= 18 && hour < 22) {

        greeting = `Szép estét, ${userName}!`;
        text = 'Reméljük, jól telt a napod.';
        icon = 'bi bi-sunset';

    } else {

        greeting = `Jó éjszakát, ${userName}!`;
        text = 'Már késő van, pihenj is egy kicsit.';
        icon = 'bi bi-moon-stars';

    }

    greetingElement.textContent = greeting;
    textElement.textContent = text;

    iconElement.className = icon;
}




