const contentBox = document.querySelector('#content');



async function navigate(page) {

    const user = loadUser();

    updateNavbar();

    
    if (!user &&
        page !== 'views/users/login' &&
        page !== 'views/users/register') {

        navigate('views/users/login');
        return;
    }

    try {

        const response = await fetch(`${page}.html`);

        if (!response.ok) {
            throw new Error('Page not found');
        }

        const html = await response.text();

        contentBox.innerHTML = html;


        switch (page) {

            case 'views/users/home':
                loadHome();
                getHomeWeather();
                showHomeGreeting();
                break;

            case 'views/users/login':
                break;

            case 'views/users/register':
                break;

            case 'views/users/forecast':
                getWeather();
                break;

            case 'views/users/details':
                break;

            case 'views/users/profile':
                getProfile();
                break;

            case 'views/users/password':
                break;

            case 'views/users/logout':
                logout();
                break;

            case 'views/admin/dashboard':
                getDashboard();
                break;

            case 'views/admin/users':
                getAllUsers();
                break;

            case 'views/admin/weather':
                getAllWeather();
                break;
        }

    } catch (error) {

        console.log(error);

        contentBox.innerHTML = `
            <div class="alert alert-danger">
                <strong>Error!</strong>
                The requested page could not be loaded.
            </div>
        `;
    }
}

function loadHome() {

    const user = loadUser();

    const welcome = document.querySelector('#homeWelcome');
    const date = document.querySelector('#homeDate');

    if (welcome) {

        if (user) {

            welcome.innerText =
                `Welcome, ${user.name}!`;

        } else {

            welcome.innerText =
                'Welcome to the Weather App!';

        }
    }


    if (date) {

        const today = new Date();

        date.innerText =
            today.toLocaleDateString('hu-HU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
    }
}

function updateNavbar() {

    const userMenu = document.querySelector('#userMenu');

    if (!userMenu) {
        return;
    }

    const user = loadUser();


    // =========================
    // VENDÉG
    // =========================

    if (!user) {

        userMenu.innerHTML = `

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/users/login'); return false;">

                    <i class="bi bi-box-arrow-in-right"></i>
                    Login

                </a>
            </li>


            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/users/register'); return false;">

                    <i class="bi bi-person-plus"></i>
                    Register

                </a>
            </li>

        `;

        return;
    }


    // =========================
    // BEJELENTKEZETT USER
    // =========================

    userMenu.innerHTML = `

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/home'); return false;">

                <i class="bi bi-house"></i>
                Home

            </a>
        </li>


        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/forecast'); return false;">

                <i class="bi bi-cloud-sun"></i>
                Weather

            </a>
        </li>

    `;


    // =========================
    // ADMIN MENÜ
    // =========================

    if (user.role === 'admin') {

        userMenu.innerHTML += `

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/dashboard'); return false;">

                    <i class="bi bi-speedometer2"></i>
                    Dashboard

                </a>
            </li>


            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/users'); return false;">

                    <i class="bi bi-people"></i>
                    Users

                </a>
            </li>


            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/weather'); return false;">

                    <i class="bi bi-cloud-sun"></i>
                    Admin Weather

                </a>
            </li>

        `;
    }


    // =========================
    // PROFILE / PASSWORD / LOGOUT
    // =========================

    userMenu.innerHTML += `

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/profile'); return false;">

                <i class="bi bi-person"></i>
                Profile

            </a>
        </li>


        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/password'); return false;">

                <i class="bi bi-key"></i>
                Password

            </a>
        </li>


        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="logout(); return false;">

                <i class="bi bi-box-arrow-right"></i>
                Logout

            </a>
        </li>


        <!-- =========================
             USER JOBB OLDALT
        ========================= -->

        <li class="nav-item ms-3 border-start ps-3">

            <span class="nav-link fw-bold">

                <i class="bi bi-person-circle"></i>

                ${user.name}

            </span>

        </li>

    `;
}

function setTheme(theme) {

    document.body.setAttribute('data-bs-theme', theme);

    localStorage.setItem('weatherTheme', theme);
}



document.addEventListener('DOMContentLoaded', () => {

    updateNavbar();

    navigate('views/users/home');

});
