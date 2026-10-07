const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();
const sha1 = require('sha1');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: process.env.CONN_LIMIT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


pool.getConnection((err, connection) => {

    if (err) {
        console.log('Database connection failed!');
        console.log(err);
        return;
    }

    console.log('Database connected successfully!');

    connection.release();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Weather API!'
    });
});



//register
app.post('/users/register', (req, res) => {

    const { name, email, passwd, confirm } = req.body;

    
    if (!name || !email || !passwd || !confirm) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    
    if (passwd !== confirm) {
        return res.status(400).json({
            error: 'Passwords do not match'
        });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email address'
        });
    }

    
    if (passwd.length < 6) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters long'
        });
    }

    
    const checkSql = 'SELECT ID FROM users WHERE email = ?';

    pool.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        // Jelszó SHA1 hash-elése
        const hashedPassword = sha1(passwd);

        const sql = `
            INSERT INTO users
            (name, email, passwd, role, status)
            VALUES (?, ?, ?, 'user', 1)
        `;

        pool.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: 'Registration failed'
                    });
                }

                res.status(201).json({
                    message: 'Registration successful',
                    userID: result.insertId
                });
            }
        );
    });
});

//weather

// ==============================
// WEATHER - ÖSSZES REKORD
// ==============================

app.get('/weather', (req, res) => {

    const sql = `
        SELECT
            ID,
            date,
            location,
            temp_min,
            temp_max,
            weather_type,
            precipitation,
            precipitation_probability,
            wind_speed,
            wind_direction,
            humidity,
            pressure,
            uv_index,
            created_at,
            updated_at
        FROM weather_forecasts
        ORDER BY date DESC, ID DESC
    `;

    pool.query(sql, (err, results) => {

        if (err) {
            console.log('WEATHER ERROR:', err);

            return res.status(500).json({
                error: 'Database error'
            });
        }


        res.status(200).json(results);
    });
});
app.post('/weather', (req, res) => {

    const {
        date,
        location,
        temp_min,
        temp_max,
        weather_type,
        precipitation,
        precipitation_probability,
        wind_speed,
        wind_direction,
        humidity,
        pressure,
        uv_index
    } = req.body;

    if (!date || !location || temp_min === undefined ||
        temp_max === undefined || !weather_type) {

        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const sql = `
        INSERT INTO weather_forecasts
        (
            date,
            location,
            temp_min,
            temp_max,
            weather_type,
            precipitation,
            precipitation_probability,
            wind_speed,
            wind_direction,
            humidity,
            pressure,
            uv_index
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
        sql,
        [
            date,
            location,
            temp_min,
            temp_max,
            weather_type,
            precipitation || 0,
            precipitation_probability || 0,
            wind_speed || 0,
            wind_direction || null,
            humidity || 0,
            pressure || 0,
            uv_index || 0
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Weather forecast creation failed'
                });
            }

            res.status(201).json({
                message: 'Weather forecast created successfully',
                weatherID: result.insertId
            });
        }
    );
});

app.patch('/weather/:id', (req, res) => {

    if (!req.body) {
        return res.status(400).json({
            error: 'Request body is missing'
        });
    }

    const id = req.params.id;

    const {
        date,
        location,
        temp_min,
        temp_max,
        weather_type,
        precipitation,
        precipitation_probability,
        wind_speed,
        wind_direction,
        humidity,
        pressure,
        uv_index
    } = req.body;

    const sql = `
        UPDATE weather_forecasts
        SET date = ?,
            location = ?,
            temp_min = ?,
            temp_max = ?,
            weather_type = ?,
            precipitation = ?,
            precipitation_probability = ?,
            wind_speed = ?,
            wind_direction = ?,
            humidity = ?,
            pressure = ?,
            uv_index = ?,
            updated_at = NOW()
        WHERE ID = ?
    `;

    pool.query(
        sql,
        [
            date,
            location,
            temp_min,
            temp_max,
            weather_type,
            precipitation,
            precipitation_probability,
            wind_speed,
            wind_direction,
            humidity,
            pressure,
            uv_index,
            id
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Database error'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Weather forecast not found'
                });
            }

            res.status(200).json({
                message: 'Weather forecast updated successfully'
            });
        }
    );
});

app.delete('/weather/:id', (req, res) => {

    const id = req.params.id;

    const checkSql = `
        SELECT ID
        FROM weather_forecasts
        WHERE ID = ?
    `;

    pool.query(checkSql, [id], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Weather forecast not found'
            });
        }

        const sql = `
            DELETE FROM weather_forecasts
            WHERE ID = ?
        `;

        pool.query(sql, [id], (err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Weather forecast deletion failed'
                });
            }

            res.status(200).json({
                message: 'Weather forecast deleted successfully'
            });
        });
    });
});

app.get('/weather/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT *
        FROM weather_forecasts
        WHERE ID = ?
    `;

    pool.query(sql, [id], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Weather forecast not found'
            });
        }

        res.status(200).json(results[0]);
    });
});

//admin

app.post('/admin/users', (req, res) => {

    const { luid } = req.body;

    if (!luid) {
        return res.status(400).json({
            error: 'Missing user ID'
        });
    }

    const checkSql = `
        SELECT role
        FROM users
        WHERE ID = ?
    `;

    pool.query(checkSql, [luid], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (results[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        const sql = `
            SELECT
                ID,
                name,
                email,
                role,
                status,
                reg,
                last,
                loginCount
            FROM users
            ORDER BY ID ASC
        `;

        pool.query(sql, (err, results) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Database error'
                });
            }

            res.status(200).json(results);
        });
    });
});

// ==============================
// ADMIN DASHBOARD
// ==============================

app.post('/admin/dashboard', (req, res) => {

    const { luid } = req.body;

    if (!luid) {
        return res.status(400).json({
            error: 'Missing user ID'
        });
    }

    // Admin ellenőrzése
    const checkSql = `
        SELECT role
        FROM users
        WHERE ID = ?
    `;

    pool.query(checkSql, [luid], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        if (results[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }


        // =========================
        // FŐ STATISZTIKÁK
        // =========================

        const statisticsSql = `
            SELECT
                COUNT(*) AS totalRecords,
                COUNT(DISTINCT location) AS totalLocations,
                ROUND(
                    AVG((temp_min + temp_max) / 2),
                    1
                ) AS averageTemperature,
                ROUND(
                    AVG(humidity),
                    1
                ) AS averageHumidity
            FROM weather_forecasts
        `;


        pool.query(statisticsSql, (err, statistics) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Database error'
                });
            }


            // =========================
            // LEGUTÓBBI REKORDOK
            // =========================

            const latestSql = `
                SELECT
                    ID,
                    date,
                    location,
                    temp_min,
                    temp_max,
                    weather_type,
                    precipitation,
                    precipitation_probability,
                    wind_speed,
                    wind_direction,
                    humidity,
                    pressure,
                    uv_index
                FROM weather_forecasts
                ORDER BY date DESC
                LIMIT 5
            `;


            pool.query(latestSql, (err, latest) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: 'Database error'
                    });
                }


                // =========================
                // IDŐJÁRÁS TÍPUSOK
                // =========================

                const weatherTypesSql = `
                    SELECT
                        weather_type,
                        COUNT(*) AS count
                    FROM weather_forecasts
                    GROUP BY weather_type
                    ORDER BY count DESC
                `;


                pool.query(
                    weatherTypesSql,
                    (err, weatherTypes) => {

                        if (err) {
                            console.log(err);

                            return res.status(500).json({
                                error: 'Database error'
                            });
                        }


                        res.status(200).json({

                            statistics: statistics[0],

                            latest: latest,

                            weatherTypes: weatherTypes

                        });

                    }
                );

            });

        });

    });

});

app.patch('/admin/status', (req, res) => {

    const { luid, uid, status } = req.body;

    if (!luid || !uid || status === undefined) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const checkSql = `
        SELECT role
        FROM users
        WHERE ID = ?
    `;

    pool.query(checkSql, [luid], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'Admin user not found'
            });
        }

        if (results[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        const sql = `
            UPDATE users
            SET status = ?
            WHERE ID = ?
        `;

        pool.query(sql, [status, uid], (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Database error'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.status(200).json({
                message: status == 1
                    ? 'User activated successfully'
                    : 'User blocked successfully'
            });
        });
    });
});

//login


app.post('/users/login', (req, res) => {

    const { email, passwd } = req.body;

    
    if (!email || !passwd) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    
    const sql = `
        SELECT ID, name, email, passwd, role, status
        FROM users
        WHERE email = ?
    `;

    pool.query(sql, [email], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

       
        if (results.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const user = results[0];

        
        if (user.status === 0) {
            return res.status(403).json({
                error: 'Your account has been blocked'
            });
        }

        
        const hashedPassword = sha1(passwd);

        
        if (hashedPassword !== user.passwd) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        
        const updateSql = `
            UPDATE users
            SET last = NOW(),
                loginCount = loginCount + 1
            WHERE ID = ?
        `;

        pool.query(updateSql, [user.ID], (err) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    error: 'Login update failed'
                });
            }

           
            delete user.passwd;

            res.status(200).json({
                message: 'Login successful',
                loggedUser: user
            });
        });
    });
});

app.get('/users/:uid', (req, res) => {

    const uid = req.params.uid;

    const sql = `
        SELECT ID, name, email, role, status, reg, last, loginCount
        FROM users
        WHERE ID = ?
    `;

    pool.query(sql, [uid], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.status(200).json(results[0]);
    });
});

// ==============================
// PROFILE MÓDOSÍTÁSA
// ==============================

app.patch('/users/:uid', (req, res) => {

    const uid = req.params.uid;

    const {
        username,
        email,
        loggedUserID
    } = req.body;


    // =========================
    // ADATOK ELLENŐRZÉSE
    // =========================

    if (!username || !email || !loggedUserID) {

        return res.status(400).json({
            error: 'Missing required fields'
        });

    }


    // Csak a saját profilját módosíthatja
    if (Number(uid) !== Number(loggedUserID)) {

        return res.status(403).json({
            error: 'Access denied'
        });

    }


    // =========================
    // EMAIL ELLENŐRZÉSE
    // =========================

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        return res.status(400).json({
            error: 'Invalid email address'
        });

    }


    // =========================
    // EMAIL FOGLALTSÁG
    // =========================

    const checkSql = `
        SELECT ID
        FROM users
        WHERE email = ?
        AND ID != ?
    `;

    pool.query(
        checkSql,
        [email, uid],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: 'Database error'
                });

            }


            if (results.length > 0) {

                return res.status(400).json({
                    error: 'Email already exists'
                });

            }


            // =========================
            // USER FRISSÍTÉSE
            // =========================

            const sql = `
                UPDATE users
                SET name = ?,
                    email = ?
                WHERE ID = ?
            `;

            pool.query(
                sql,
                [username, email, uid],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            error: 'Profile update failed'
                        });

                    }


                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            error: 'User not found'
                        });

                    }


                    res.status(200).json({
                        message: 'Profile updated successfully'
                    });

                }
            );

        }
    );

});

app.post('/users/:uid/passmod', (req, res) => {

    const uid = req.params.uid;

    const {
        oldpass,
        newpass,
        confirm
    } = req.body;

    if (!oldpass || !newpass || !confirm) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    if (newpass !== confirm) {
        return res.status(400).json({
            error: 'Passwords do not match'
        });
    }

    if (newpass.length < 6) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters long'
        });
    }

    const sql = `
        SELECT passwd
        FROM users
        WHERE ID = ?
    `;

    pool.query(sql, [uid], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const oldPasswordHash = sha1(oldpass);

        if (oldPasswordHash !== results[0].passwd) {
            return res.status(401).json({
                error: 'Old password is incorrect'
            });
        }

        const newPasswordHash = sha1(newpass);

        const updateSql = `
            UPDATE users
            SET passwd = ?
            WHERE ID = ?
        `;

        pool.query(
            updateSql,
            [newPasswordHash, uid],
            (err) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: 'Password change failed'
                    });
                }

                res.status(200).json({
                    message: 'Password changed successfully'
                });
            }
        );
    });
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});