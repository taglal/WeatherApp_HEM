const contentBox = document.querySelector('#content');



async function navigate(page) {


    const user = loadUser();

    // Vendég csak login és register oldalra mehet
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
                break;

            case 'views/users/password':
                break;

            case 'views/users/logout':
                logout();
                break;

            case 'views/admin/dashboard':
                getStatistics();
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
                   onclick="navigate('views/users/login')">

                    <i class="bi bi-box-arrow-in-right"></i>
                    Login

                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/users/register')">

                    <i class="bi bi-person-plus"></i>
                    Register

                </a>
            </li>

        `;

        return;
    }


    // =========================
    // BEJELENTKEZETT
    // =========================

    userMenu.innerHTML = `

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/home')">

                <i class="bi bi-house"></i>
                Home

            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/forecast')">

                <i class="bi bi-cloud-sun"></i>
                Weather

            </a>
        </li>

    `;


    // =========================
    // ADMIN
    // =========================

    if (user.role === 'admin') {

        userMenu.innerHTML += `

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/dashboard')">

                    <i class="bi bi-speedometer2"></i>
                    Dashboard

                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/users')">

                    <i class="bi bi-people"></i>
                    Users

                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link"
                   href="#"
                   onclick="navigate('views/admin/weather')">

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
               onclick="navigate('views/users/profile')">

                <i class="bi bi-person"></i>
                Profile

            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="navigate('views/users/password')">

                <i class="bi bi-key"></i>
                Password

            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link"
               href="#"
               onclick="logout()">

                <i class="bi bi-box-arrow-right"></i>
                Logout

            </a>
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
