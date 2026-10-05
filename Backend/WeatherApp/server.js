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

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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

const APP_PORT = process.env.APP_PORT;

app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}`);
});