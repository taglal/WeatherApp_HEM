
async function getAllUsers() {

    const loggedUser = loadUser();

    if (!loggedUser) {
        showMessage('danger', 'ERROR', 'You must be logged in!');
        return;
    }

    const luid = loggedUser.ID;

    const response = await fetch('http://localhost:3000/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            luid: luid
        })
    });

    const res = await response.json();

    if (response.status !== 200) {
        showMessage('danger', 'ERROR', res.error);
        return;
    }

    drawUsersTable(res);
}


function drawUsersTable(users) {

    const usersList = document.querySelector('#usersList');
    const usersCount = document.querySelector('#usersCount');

    if (!usersList) {
        return;
    }

    usersList.innerHTML = '';

    if (usersCount) {
        usersCount.textContent = users.length;
    }

    if (users.length === 0) {

        usersList.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }

    users.forEach(user => {
        addUserRow(user);
    });
}


function addUserRow(user) {

    const usersList = document.querySelector('#usersList');

    const loggedUser = loadUser();

    const tr = document.createElement('tr');

    const registered = user.reg
        ? moment(user.reg).format('YYYY-MM-DD HH:mm')
        : '-';

    const lastLogin = user.last
        ? moment(user.last).format('YYYY-MM-DD HH:mm')
        : 'Never';

    const isActive = Number(user.status) === 1;

    let action = '';

    if (loggedUser && Number(loggedUser.ID) === Number(user.ID)) {

        action = `
            <button class="btn btn-secondary btn-sm" disabled>
                Current user
            </button>
        `;

    } else if (isActive) {

        action = `
            <button
                class="btn btn-danger btn-sm"
                onclick="changeUserStatus(${user.ID}, 0)">
                <i class="bi bi-person-x"></i>
                Block
            </button>
        `;

    } else {

        action = `
            <button
                class="btn btn-success btn-sm"
                onclick="changeUserStatus(${user.ID}, 1)">
                <i class="bi bi-person-check"></i>
                Activate
            </button>
        `;
    }

    tr.innerHTML = `
        <td>${user.ID}</td>

        <td>${user.name}</td>

        <td>${user.email}</td>

        <td>
            <span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
                ${user.role}
            </span>
        </td>

        <td>${registered}</td>

        <td>${lastLogin}</td>

        <td>${user.loginCount}</td>

        <td>
            <span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}">
                ${isActive ? 'Active' : 'Blocked'}
            </span>
        </td>

        <td>
            ${action}
        </td>
    `;

    usersList.appendChild(tr);
}


async function changeUserStatus(uid, status) {

    const loggedUser = loadUser();

    if (!loggedUser) {
        showMessage('danger', 'ERROR', 'You must be logged in!');
        return;
    }

    const luid = loggedUser.ID;

    const response = await fetch('http://localhost:3000/admin/status', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            luid: luid,
            uid: uid,
            status: status
        })
    });

    const res = await response.json();

    if (response.status !== 200) {
        showMessage('danger', 'ERROR', res.error);
        return;
    }

    showMessage(
        'success',
        'SUCCESS',
        res.message
    );

    getAllUsers();
}

// ==============================
// ADMIN WEATHER DASHBOARD
// ==============================

async function getDashboard() {

    const user = loadUser();

    if (!user) {
        showMessage(
            'danger',
            'ERROR',
            'You must be logged in!'
        );
        return;
    }

    try {

        const response = await fetch(
            'http://localhost:3000/admin/dashboard',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    luid: user.ID
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

        drawDashboard(res);

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
// DASHBOARD MEGJELENÍTÉSE
// ==============================

function drawDashboard(data) {

    const statistics = data.statistics;
    const latest = data.latest;


    // =========================
    // STATISZTIKAI KÁRTYÁK
    // =========================

    document.querySelector('#totalRecords').textContent =
        Number(statistics.totalRecords || 0).toLocaleString();


    document.querySelector('#totalLocations').textContent =
        Number(statistics.totalLocations || 0).toLocaleString();


    document.querySelector('#averageTemperature').textContent =
        `${Number(statistics.averageTemperature || 0).toFixed(1)} °C`;


    document.querySelector('#averageHumidity').textContent =
        `${Number(statistics.averageHumidity || 0).toFixed(1)} %`;


    // =========================
    // LEGUTÓBBI REKORDOK
    // =========================

    const list = document.querySelector('#latestWeatherList');

    list.innerHTML = '';


    if (!latest || latest.length === 0) {

        list.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No weather records found.
                </td>
            </tr>
        `;

        return;
    }


    latest.forEach(weather => {

        const tr = document.createElement('tr');

        tr.innerHTML = `

            <td>
                ${moment(weather.date).format('YYYY-MM-DD')}
            </td>

            <td>
                <i class="bi bi-geo-alt"></i>
                ${weather.location}
            </td>

            <td>
                ${weather.temp_min} °C
                -
                ${weather.temp_max} °C
            </td>

            <td>
                ${weather.weather_type}
            </td>

            <td>
                ${weather.precipitation} mm
            </td>

            <td>
                ${weather.humidity} %
            </td>

            <td>
                ${weather.wind_speed} km/h
            </td>

        `;

        list.appendChild(tr);
        // =========================
// IDŐJÁRÁS TÍPUSOK
// =========================

const weatherTypes =
    data.weatherTypes || [];

const weatherTypesList =
    document.querySelector('#weatherTypesList');

weatherTypesList.innerHTML = '';


if (weatherTypes.length === 0) {

    weatherTypesList.innerHTML = `
        <div class="text-center text-muted">
            No weather type data available.
        </div>
    `;

} else {

    weatherTypes.forEach(type => {

        const count =
            Number(type.count || 0);

        const item =
            document.createElement('div');

        item.className =
            'd-flex justify-content-between align-items-center border-bottom py-2';


        item.innerHTML = `

            <span>

                <i class="bi bi-cloud"></i>

                ${type.weather_type}

            </span>

            <span class="badge bg-primary">

                ${count}

            </span>

        `;


        weatherTypesList.appendChild(item);

    });

}
    });
}