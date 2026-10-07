
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
